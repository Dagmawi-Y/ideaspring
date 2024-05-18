import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Res,
  HttpStatus,
  HttpException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadService } from './upload.service';
import { JwtGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // Upload Startup Video
  @UseGuards(JwtGuard)
  @Roles('entrepreneur')
  @Post('video/:startupId')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.originalname + '-' + uniqueSuffix);
        },
      }),
    }),
  )
  async uploadStartupVideo(
    @UploadedFile() file: Express.Multer.File,
    @Param('startupId') startupId: string,
    @Res() res: any,
  ) {
    try {
      const result = await this.uploadService.uploadStartupVideo(
        file,
        parseInt(startupId),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        'Error uploading video',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Upload Startup Image
  @UseGuards(JwtGuard)
  @Roles('entrepreneur')
  @Post('image/:startupId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.originalname + '-' + uniqueSuffix);
        },
      }),
    }),
  )
  async uploadStartupImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('startupId') startupId: string,
    @Res() res: any,
  ) {
    try {
      const result = await this.uploadService.uploadStartupImage(
        file,
        parseInt(startupId),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        'Error uploading image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Upload User Profile Image
  @UseGuards(JwtGuard)
  @Roles('user')
  @Post('user/profile-image/:userId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/user_profile_images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.originalname + '-' + uniqueSuffix);
        },
      }),
    }),
  )
  async uploadUserProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string,
    @Res() res: any,
  ) {
    try {
      const result = await this.uploadService.uploadUserProfileImage(
        file,
        parseInt(userId),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        'Error uploading user profile image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Upload User Banner Image
  @UseGuards(JwtGuard)
  @Roles('user')
  @Post('user/banner-image/:userId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/user_banner_images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.originalname + '-' + uniqueSuffix);
        },
      }),
    }),
  )
  async uploadUserBannerImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string,
    @Res() res: any,
  ) {
    try {
      const result = await this.uploadService.uploadUserBannerImage(
        file,
        parseInt(userId),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        'Error uploading user banner image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Upload Investor Profile Image
  @UseGuards(JwtGuard)
  // @Roles('investor')
  @Post('investor/profile-image/:investorId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/investor_profile_images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.originalname + '-' + uniqueSuffix);
        },
      }),
    }),
  )
  async uploadInvestorProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('investorId') investorId: string,
    @Res() res: any,
  ) {
    try {
      const result = await this.uploadService.uploadInvestorProfileImage(
        file,
        parseInt(investorId),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        'Error uploading investor profile image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Upload Investor Banner Image
  @UseGuards(JwtGuard)
  // @Roles('investor')
  @Post('investor/banner-image/:investorId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/investor_banner_images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.originalname + '-' + uniqueSuffix);
        },
      }),
    }),
  )
  async uploadInvestorBannerImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('investorId') investorId: string,
    @Res() res: any,
  ) {
    try {
      const result = await this.uploadService.uploadInvestorBannerImage(
        file,
        parseInt(investorId),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        'Error uploading investor banner image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Upload Startup Document
  @UseGuards(JwtGuard)
  @Roles('entrepreneur')
  @Post('document/:startupId/:documentType')
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, cb) => {
          cb(null, file.originalname); // Keep the original file name
        },
      }),
    }),
  )
  async uploadStartupDocument(
    @UploadedFile() file: Express.Multer.File,
    @Param('startupId') startupId: string,
    @Param('documentType') documentType: string,
    @Res() res: any,
  ) {
    try {
      const result = await this.uploadService.uploadStartupDocument(
        file,
        documentType,
        parseInt(startupId),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        'Error uploading document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtGuard)
  @Roles('entrepreneur')
  @Get('document/:documentId')
  async downloadStartupDocs(
    @Param('documentId') documentId: string,
    @Res() res: any,
  ) {
    try {
      const { filePath, originalFileName } =
        await this.uploadService.downloadStartupDocs(parseInt(documentId));
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${originalFileName}"`,
      );
      res.sendFile(filePath, { root: './' });
    } catch (error) {
      throw new HttpException(
        'Error downloading document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
