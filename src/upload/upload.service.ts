import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import * as fs from 'fs';
import * as FormData from 'form-data';

@Injectable()
export class UploadService {
  private readonly telegramBotToken: string;
  private readonly telegramChatId: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });

    this.telegramBotToken = this.config.get('TELEGRAM_BOT_TOKEN');
    this.telegramChatId = this.config.get('TELEGRAM_CHAT_ID');
  }

  async uploadStartupVideo(file: Express.Multer.File, startupId: number) {
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

      // Delete the file after successful upload
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file: ${file.path}`, err);
        } else {
          console.log(`Successfully deleted file: ${file.path}`);
        }
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

  async uploadStartupImage(file: Express.Multer.File, startupId: number) {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'startup_images',
        public_id: `${startupId}_${file.originalname}`,
        // Image optimization settings
        transformation: [
          { width: 800, height: 600, crop: 'fill' }, // Resize to 800x600, crop if necessary
          { fetch_format: 'auto', quality: 'auto' }, // Use automatic format and quality
        ],
      });
      console.log(file.originalname);
      const imageUrl = uploadResult.secure_url;

      await this.prisma.imagesVideos.create({
        data: {
          image_url: imageUrl,
          startup: { connect: { id: startupId } },
        },
      });

      // Delete the file after successful upload
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file: ${file.path}`, err);
        } else {
          console.log(`Successfully deleted file: ${file.path}`);
        }
      });

      return {
        success: true,
        message: 'Image uploaded successfully',
        imageUrl,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        message: 'Error uploading image',
        error: error.message,
      };
    }
  }

  // New Methods for User and Investor Image Uploads

  async uploadUserProfileImage(file: Express.Multer.File, userId: number) {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'user_profile_images',
        public_id: `${userId}_${file.originalname}`,
        transformation: [
          { width: 800, height: 800, crop: 'fill' },
          { fetch_format: 'auto', quality: 'auto' },
        ],
      });

      const imageUrl = uploadResult.secure_url;

      await this.prisma.user.update({
        where: { id: userId },
        data: { profile_image_url: imageUrl },
      });

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file: ${file.path}`, err);
        } else {
          console.log(`Successfully deleted file: ${file.path}`);
        }
      });

      return {
        success: true,
        message: 'User profile image uploaded successfully',
        imageUrl,
      };
    } catch (error) {
      console.error('Error uploading user profile image:', error);
      return {
        success: false,
        message: 'Error uploading user profile image',
        error: error.message,
      };
    }
  }

  async uploadUserBannerImage(file: Express.Multer.File, userId: number) {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'user_banner_images',
        public_id: `${userId}_${file.originalname}`,
        transformation: [
          { width: 1920, height: 600, crop: 'fill' },
          { fetch_format: 'auto', quality: 'auto' },
        ],
      });

      const imageUrl = uploadResult.secure_url;

      await this.prisma.user.update({
        where: { id: userId },
        data: { banner_image_url: imageUrl },
      });

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file: ${file.path}`, err);
        } else {
          console.log(`Successfully deleted file: ${file.path}`);
        }
      });

      return {
        success: true,
        message: 'User banner image uploaded successfully',
        imageUrl,
      };
    } catch (error) {
      console.error('Error uploading user banner image:', error);
      return {
        success: false,
        message: 'Error uploading user banner image',
        error: error.message,
      };
    }
  }

  async uploadInvestorProfileImage(
    file: Express.Multer.File,
    investorId: number,
  ) {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'investor_profile_images',
        public_id: `${investorId}_${file.originalname}`,
        transformation: [
          { width: 800, height: 800, crop: 'fill' },
          { fetch_format: 'auto', quality: 'auto' },
        ],
      });

      const imageUrl = uploadResult.secure_url;

      await this.prisma.investorProfile.update({
        where: { id: investorId },
        data: { profile_image_url: imageUrl },
      });

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file: ${file.path}`, err);
        } else {
          console.log(`Successfully deleted file: ${file.path}`);
        }
      });

      return {
        success: true,
        message: 'Investor profile image uploaded successfully',
        imageUrl,
      };
    } catch (error) {
      console.error('Error uploading investor profile image:', error);
      return {
        success: false,
        message: 'Error uploading investor profile image',
        error: error.message,
      };
    }
  }

  async uploadInvestorBannerImage(
    file: Express.Multer.File,
    investorId: number,
  ) {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'investor_banner_images',
        public_id: `${investorId}_${file.originalname}`,
        transformation: [
          { width: 1920, height: 600, crop: 'fill' },
          { fetch_format: 'auto', quality: 'auto' },
        ],
      });

      const imageUrl = uploadResult.secure_url;

      await this.prisma.investorProfile.update({
        where: { id: investorId },
        data: { banner_image_url: imageUrl },
      });

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file: ${file.path}`, err);
        } else {
          console.log(`Successfully deleted file: ${file.path}`);
        }
      });

      return {
        success: true,
        message: 'Investor banner image uploaded successfully',
        imageUrl,
      };
    } catch (error) {
      console.error('Error uploading investor banner image:', error);
      return {
        success: false,
        message: 'Error uploading investor banner image',
        error: error.message,
      };
    }
  }

  async uploadStartupDocument(
    file: Express.Multer.File,
    documentType: string,
    startupId: number,
  ) {
    try {
      const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendDocument`;
      const formData = new FormData();
      formData.append('chat_id', this.telegramChatId);
      formData.append(
        'document',
        fs.createReadStream(file.path),
        file.originalname,
      ); // Pass original name

      const response = await axios.post(url, formData, {
        headers: formData.getHeaders(),
      });

      const fileId = response.data.result.document.file_id;

      const getFileUrl = `https://api.telegram.org/bot${this.telegramBotToken}/getFile?file_id=${fileId}`;
      const fileResponse = await axios.get(getFileUrl);
      const filePath = fileResponse.data.result.file_path;

      const documentUrl = `https://api.telegram.org/file/bot${this.telegramBotToken}/${fileId}`;

      await this.saveStartupDocumentUrl(documentUrl, documentType, startupId);

      // Delete the file after successful upload
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file: ${file.path}`, err);
        } else {
          console.log(`Successfully deleted file: ${file.path}`);
        }
      });

      return {
        success: true,
        message: 'Document uploaded successfully',
        documentUrl,
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        message: 'Error uploading document',
        error: error.message,
      };
    }
  }

  async saveStartupDocumentUrl(
    documentUrl: string,
    documentType: string,
    startupId: number,
  ) {
    await this.prisma.document.create({
      data: {
        document_url: documentUrl,
        document_type: documentType,
        startup: { connect: { id: startupId } },
      },
    });
  }

  async downloadStartupDocs(
    documentId: number,
  ): Promise<{ filePath: string; originalFileName: string }> {
    try {
      // Retrieve document information from the database
      const document = await this.prisma.document.findUnique({
        where: { id: documentId },
      });

      if (!document) {
        throw new Error('Document not found');
      }

      const documentUrl = document.document_url;
      const filePathParts = documentUrl.split('/');
      const fileNameWithSuffix = filePathParts[filePathParts.length - 1];
      const fileId = fileNameWithSuffix.split('-')[0]; // Extract the file ID without the suffix

      console.log(`Extracted file ID: ${fileId}`);

      // Use the Telegram Bot API to get the file details
      const getFileUrl = `https://api.telegram.org/bot${this.telegramBotToken}/getFile?file_id=${fileId}`;
      console.log(`getFileUrl: ${getFileUrl}`);

      const fileResponse = await axios.get(getFileUrl);
      console.log(`fileResponse: ${JSON.stringify(fileResponse.data)}`);

      if (!fileResponse.data.ok) {
        throw new Error('Failed to retrieve file details from Telegram API');
      }

      const telegramFilePath = fileResponse.data.result.file_path;

      const originalFileName = telegramFilePath.split('/').pop(); // Get the original file name

      // Construct the download URL
      const downloadUrl = `https://api.telegram.org/file/bot${this.telegramBotToken}/${telegramFilePath}`;
      console.log(`downloadUrl: ${downloadUrl}`);

      const response = await axios.get(downloadUrl, { responseType: 'stream' });

      const localFilePath = `./downloads/${originalFileName}`;
      const writer = fs.createWriteStream(localFilePath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () =>
          resolve({ filePath: localFilePath, originalFileName }),
        );
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('Error downloading document:', error.message);
      throw new Error('Error downloading document');
    }
  }
}
