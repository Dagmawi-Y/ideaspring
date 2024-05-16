import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { JwtSocketGuard } from 'src/auth/guard/jwt_socket.guard';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(JwtSocketGuard)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { conversationId } = data;
    const client = socket.client;
    console.log({
      client,
    });
    const userId = 1;

    // Join the room
    socket.join(`conversation-${conversationId}`);
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

    // Check if the user is a participant in the conversation
    const isParticipant = conversation.participants.some(
      (participant) => participant.id === userId,
    );
    if (!isParticipant) {
      // Handle the case where the user is not a participant
      socket.emit('error', 'You are not a participant in this conversation');
      return;
    }

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

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() data: { conversationId: number; content: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { conversationId, content } = data;
    const senderId = 1;

    // Create a new message
    const newMessage = await this.prisma.message.create({
      data: {
        sender: { connect: { id: senderId } },
        conversation: { connect: { id: conversationId } },
        content,
      },
    });

    // Emit the new message to all clients in the room
    this.server
      .to(`conversation-${conversationId}`)
      .emit('newMessage', newMessage);
  }
}
