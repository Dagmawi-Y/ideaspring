import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Blob } from 'buffer';
const fs = require('fs');
const FormData = require('form-data');

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async uploadVideo(file: Express.Multer.File, startupId: number) {
    try {
      // 1. Get Filemoon upload server URL
      const filemoonKey = this.config.get('FILEMOON_API_KEY');
      const getServerUrl = 'https://filemoonapi.com/api/upload/server';
      const { data: serverResponse } = await axios.get(getServerUrl, {
        params: { key: filemoonKey },
      });
      const uploadServerUrl = serverResponse.result;

      // 2. Upload video to Filemoon
      const formData = new FormData();
      formData.append('key', filemoonKey);

      // Create a readable stream from the file
      const readableStream = fs.createReadStream(file.path);
      formData.append('file', readableStream, file.originalname);

      const { data: uploadResponse } = await axios.post(
        uploadServerUrl,
        formData,
        {
          headers: { ...formData.getHeaders() },
        },
      );

      console.log({ uploadResponse });

      const fileCode = uploadResponse.files[0].filecode;

      // 3. Store video URL in the database
      const videoUrl = `https://filemoon.sx/d/${fileCode}`;
      await this.prisma.imagesVideos.create({
        data: {
          video_url: videoUrl,
          startup: { connect: { id: startupId } },
        },
      });

      return {
        success: true,
        message: 'Video uploaded successfully',
        videoUrl,
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      return {
        success: false,
        message: 'Error uploading video',
        error: error.message,
      };
    }
  }
}
