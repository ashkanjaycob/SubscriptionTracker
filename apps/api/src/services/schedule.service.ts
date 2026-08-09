import { prisma } from '@sub-tracker/db';
import { CreateScheduleInput, UpdateScheduleInput } from '@sub-tracker/shared';

export class ScheduleService {
  static async create(userId: number, input: CreateScheduleInput) {
    // Verify the subscription belongs to the user
    const subscription = await prisma.subscription.findFirst({
      where: { id: input.subscriptionId, userId },
    });
    if (!subscription) throw { statusCode: 404, message: 'Subscription not found' };

    // Verify the channel exists
    const channel = await prisma.channel.findUnique({
      where: { id: input.channelId },
    });
    if (!channel) throw { statusCode: 404, message: 'Channel not found' };

    return await prisma.schedule.create({
      data: {
        ...input,
        reminderDate: new Date(input.reminderDate),
      },
    });
  }

  static async getAllByUser(userId: number) {
    return await prisma.schedule.findMany({
      where: {
        subscription: { userId },
      },
      include: {
        subscription: true,
        channel: true,
      },
      orderBy: { reminderDate: 'asc' },
    });
  }

  static async getById(id: number, userId: number) {
    const schedule = await prisma.schedule.findFirst({
      where: {
        id,
        subscription: { userId },
      },
      include: {
        subscription: true,
        channel: true,
      },
    });
    if (!schedule) throw { statusCode: 404, message: 'Schedule not found' };
    return schedule;
  }

  static async update(id: number, userId: number, input: UpdateScheduleInput) {
    await this.getById(id, userId);

    return await prisma.schedule.update({
      where: { id },
      data: {
        ...input,
        reminderDate: input.reminderDate ? new Date(input.reminderDate) : undefined,
      },
    });
  }

  static async delete(id: number, userId: number) {
    await this.getById(id, userId);
    return await prisma.schedule.delete({ where: { id } });
  }
}
