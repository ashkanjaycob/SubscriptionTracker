import { prisma } from '@sub-tracker/db';
import { CreateChannelInput } from '@sub-tracker/shared';

export class ChannelService {
  static async create(input: CreateChannelInput) {
    return await prisma.channel.create({ data: input });
  }

  static async getAll() {
    return await prisma.channel.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id: number) {
    const channel = await prisma.channel.findUnique({ where: { id } });
    if (!channel) throw { statusCode: 404, message: 'Channel not found' };
    return channel;
  }

  static async delete(id: number) {
    await this.getById(id);
    return await prisma.channel.delete({ where: { id } });
  }
}
