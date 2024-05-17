import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
  HttpStatus,
  HttpException,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer'; // Import diskStorage
import * as path from 'path'; // Import path module
import { JwtGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

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
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Param('startupId') startupId: string,
    @Res() res: any,
  ) {
    try {
      const videoUrl = await this.uploadService.uploadVideo(
        file,
        parseInt(startupId),
      );
      console.log({
        file,
      });
      return res.status(HttpStatus.OK).json({
        message: 'Video uploaded successfully',
        url: videoUrl,
      });
    } catch (error) {
      throw new HttpException(
        'Error uploading video',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('startupId') startupId: string,
    @Res() res: any,
  ) {
    try {
      const imageUrl = await this.uploadService.uploadImage(
        file,
        parseInt(startupId),
      );
      return res.status(HttpStatus.OK).json({
        message: 'Image uploaded successfully',
        url: imageUrl,
      });
    } catch (error) {
      throw new HttpException(
        'Error uploading image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
