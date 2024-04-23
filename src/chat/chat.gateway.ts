import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from '../prisma/prisma.service';

import { Conversation, Message, User } from '@prisma/client';
import { JwtSocketGuard } from 'src/auth/guard/jwt_socket.guard';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  // @UseGuards(JwtSocketGuard)
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: { userId: string; conversationId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { userId, conversationId } = data;
    socket.join(`conversation-${conversationId}`);
    console.log({ conversationId });

    // Fetch conversation and messages
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: parseInt(conversationId) },
      include: {
        messages: {
          include: {
            sender: true,
          },
          orderBy: {
            created_at: 'asc',
          },
        },
        participants: true,
      },
    });

    // Emit conversation details and messages to the client
    socket.emit('conversationJoined', {
      conversation,
      messages: conversation.messages.map((message) => ({
        id: message.id,
        sender: message.sender,
        content: message.content,
        created_at: message.created_at,
      })),
    });
  }

  // @UseGuards(JwtSocketGuard)
  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody()
    data: { senderId: number; conversationId: number; content: string },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log({ data });
    const { senderId, conversationId, content } = data;

    // Create a new message
    const newMessage = await this.prisma.message.create({
      data: {
        sender: { connect: { id: senderId } }, // Connect the existing User record
        conversation: { connect: { id: conversationId } }, // Connect the existing Conversation record
        content,
      },
    });

    // Emit the new message to all clients in the room
    this.server
      .to(`conversation-${conversationId}`)
      .emit('newMessage', newMessage);
  }
}
