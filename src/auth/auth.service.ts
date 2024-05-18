import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/signIn.dto';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: SignupDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    try {
      // Create a Prisma transaction to ensure atomicity
      const result = await this.prisma.$transaction(async (tx) => {
        // Save the new user in the DB (but don't commit yet)
        const user = await tx.user.create({
          data: {
            email: dto.email,
            password: hash,
            first_name: dto.first_name,
            last_name: dto.last_name,
            isEmailVerified: false,
            verificationToken,
          },
        });

        const role = await tx.role.findUnique({
          where: { name: dto.role },
        });

        if (!role) {
          throw new BadRequestException(`Role ${dto.role} does not exist.`);
        }

        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });

        console.log({
          role: dto.role,
        });

        // Check if the user is registering as an investor
        if (dto.role === 'investor') {
          // Create an Investor record
          const investor = await tx.investor.create({
            data: {
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });

          console.log({
            investor,
          });

          // Create an InvestorProfile record
          await tx.investorProfile.create({
            data: {
              investor_id: investor.id,
              first_name: dto.first_name,
              last_name: dto.last_name,
              email: dto.email,
            },
          });

          // Create an InvestorCompanyProfile record
          await tx.investorCompanyProfile.create({
            data: {
              investor_id: investor.id,
            },
          });

          // Create an InvestorInterests record
          await tx.investorInterests.create({
            data: {
              investor_id: investor.id,
            },
          });
        }

        // Send the verification email
        await this.sendVerificationEmail(user.email, verificationToken);

        return {
          message: 'User registered successfully. Please verify your email.',
        };
      });

      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Username already in use. Please try another one',
          );
        }
      }
      throw error;
    }
  }

  private async sendVerificationEmail(email: string, token: string) {
    // Create a transporter object using Google SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get('GMAIL_USER'), // Replace with your Gmail address
        pass: this.config.get('GMAIL_PASSWORD'), // Replace with your Gmail password (or App Password)
      },
      secure: true,
      port: 465,
    });

    // Define the email options
    const mailOptions = {
      from: `"${this.config.get('APP_NAME')}" <${this.config.get(
        'APP_ADMIN',
      )}>`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your email address</title>
            <style>
              /* Reset and base styles */
              body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333; }
              a { color: #007bff; text-decoration: none; }
              a:hover { text-decoration: underline; }
    
              /* Layout and responsive styles */
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              @media (max-width: 600px) {
                .container { padding: 10px; }
              }
    
              /* Button styles */
              .btn { display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; border-radius: 4px; text-decoration: none; }
              .btn:hover { background-color: #0056b3; }
              .btn-text { color: #fff; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to IdeaSpring!</h1>
              <p>Hello there,</p>
              <p>We're thrilled to have you as a part of the IdeaSpring community. This email is coming to you from the friendly IdeaSpring team.</p>
              <p>To get started, please click the button below to verify your email address:</p>
              <p><a href="${this.config.get(
                'FRONTEND_URL',
              )}/verify-email?token=${token}" class="btn"><span class="btn-text">Verify Email</span></a></p>
              <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
              <p><a href="${this.config.get(
                'FRONTEND_URL',
              )}/verify-email?token=${token}">${this.config.get(
                'FRONTEND_URL',
              )}/verify-email?token=${token}</a></p>
              <p>We're excited to have you on board and can't wait to see what amazing ideas you'll bring to the table.</p>
              <p>Thanks,<br>The IdeaSpring Team</p>
            </div>
          </body>
        </html>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, verificationToken: null },
    });
    console.log({
      msg: 'email verified success',
    });

    return { message: 'Email verified successfully' };
  }

  async login(dto: SignInDto) {
    try {
      // Find the user by email
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
        include: { userRole: { include: { role: true } } },
      });

      // If the user is not found, throw an error
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      // Check the password
      const isPasswordCorrect = await argon.verify(user.password, dto.password);

      // If the password is not correct, throw an error
      if (!isPasswordCorrect) {
        throw new ForbiddenException('Invalid credentials');
      }

      // Get the user's role
      const role = user.userRole?.role;

      // Return the user
      return this.signToken(user.id, user.email, role?.name ?? '');
    } catch (error) {
      throw error;
    }
  }

  async logout(token: string) {
    try {
      // Verify the token to ensure it's valid
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      // Add the revoked token to the RevokedToken table
      await this.prisma.revokedToken.create({
        data: {
          token,
          userId: payload.sub,
        },
      });

      console.log({
        msg: 'User logged out - Token Revoked',
      });
    } catch (error) {
      // If the token is invalid or expired, throw an UnauthorizedException
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const pwResetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    await this.prisma.user.update({
      where: { id: user.id },
      data: { pwResetToken, pwResetTokenExpiry: expiresAt },
    });

    const resetUrl = `${this.config.get(
      'FRONTEND_URL',
    )}/reset-password?token=${pwResetToken}`;

    // Send the password reset email with the resetUrl
    await this.sendPasswordResetEmail(email, resetUrl);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        pwResetToken: token,
        pwResetTokenExpiry: { gte: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hash = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hash,
        pwResetToken: null,
        pwResetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successful' };
  }

  private async sendPasswordResetEmail(email: string, resetUrl: string) {
    // Create a transporter object using Google SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get('GMAIL_USER'), // Replace with your Gmail address
        pass: this.config.get('GMAIL_PASSWORD'), // Replace with your Gmail password (or App Password)
      },
      secure: true,
      port: 465,
    });

    // Define the email options
    const mailOptions = {
      from: `"${this.config.get('EMAIL_DISPLAY_NAME')}" <${this.config.get(
        'APP_ADMIN',
      )}>`,
      to: email,
      subject: 'Reset your password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset your password</title>
            <style>
              /* Reset and base styles */
              body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333; }
              a { color: #007bff; text-decoration: none; }
              a:hover { text-decoration: underline; }
    
              /* Layout and responsive styles */
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              @media (max-width: 600px) {
                .container { padding: 10px; }
              }
    
              /* Button styles */
              .btn { display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; border-radius: 4px; text-decoration: none; }
              .btn:hover { background-color: #0056b3; }
              .btn-text { color: #fff; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Reset your password</h1>
              <p>Hello there,</p>
              <p>We received a request to reset your password for your IdeaSpring account. If you didn't initiate this request, please ignore this email.</p>
              <p>To reset your password, click the button below:</p>
              <p><a href="${resetUrl}" class="btn"><span class="btn-text">Reset Password</span></a></p>
              <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
              <p><a href="${resetUrl}">${resetUrl}</a></p>
              <p>This link will expire in one hour.</p>
              <p>Thanks,<br>The IdeaSpring Team</p>
            </div>
          </body>
        </html>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  }

  async signToken(
    userId: number,
    email: string,
    role: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      role,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
