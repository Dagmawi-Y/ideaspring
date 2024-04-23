import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from '../prisma/prisma.service';
import { Conversation, User } from '@prisma/client';

@Controller('conversations')
export class ConversationController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtGuard)
  @Post('new')
  async createConversation(
    @Request() req,
    @Body() body: { participantIds: number[] },
  ): Promise<Conversation> {
    const user = req.user as User;
    const participantIds = [...body.participantIds, user.id];

    const conversation = await this.prisma.conversation.create({
      data: {
        participants: {
          connect: participantIds.map((id) => ({ id })),
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return conversation;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getConversation(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Conversation> {
    const user = req.user as User;
    return this.prisma.conversation.findFirst({
      where: {
        id,
        participants: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                ReadStatus: true,
              },
            },
          },
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });
  }

  @UseGuards(JwtGuard)
  @Get()
  async getConversations(@Request() req): Promise<Conversation[]> {
    const user = req.user as User;
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            ReadStatus: true,
          },
        },
      },
    });
  }
}
