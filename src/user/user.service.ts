import { HttpCode, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      const { password, ...userInfo } = user;
      return userInfo;
    } catch (error) {
      throw new Error('Failed to retrieve user profile');
    }
  }

  async updateUserProfile(userId: number, data: UpdateUserDto) {
    try {
      const { city_id, country_id, ...otherData } = data;

      // Get the current user to check existing associations
      const currentUser = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { city: true, country: true },
      });

      // Check if the provided city_id exists
      const cityExists = await this.prisma.city.findUnique({
        where: { id: city_id },
      });
      if (city_id && !cityExists) {
        throw new Error(`City with ID ${city_id} does not exist`);
      }

      // Check if the user is currently associated with the provided city
      const isCurrentlyAssociatedWithCity = currentUser.city?.id === city_id;

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...otherData,
          city: city_id
            ? { connect: { id: city_id } }
            : isCurrentlyAssociatedWithCity
              ? { disconnect: true }
              : undefined,
          country: country_id
            ? { connect: { id: country_id } }
            : { disconnect: true },
        },
      });

      const { password, ...userInfo } = updatedUser;
      return userInfo;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  async deleteUserProfile(userId: number) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: 'User profile deleted successfully' };
  }
}
