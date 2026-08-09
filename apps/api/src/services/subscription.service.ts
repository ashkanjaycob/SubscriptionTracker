import { prisma } from '@sub-tracker/db';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from '@sub-tracker/shared';

export class SubscriptionService {
  static async create(userId: number, input: CreateSubscriptionInput) {
    return await prisma.subscription.create({
      data: {
        ...input,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        userId,
      },
    });
  }

  static async getAllByUser(userId: number) {
    return await prisma.subscription.findMany({
      where: { userId },
      include: { schedules: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id: number, userId: number) {
    const sub = await prisma.subscription.findFirst({
      where: { id, userId },
      include: { schedules: true },
    });
    if (!sub) throw { statusCode: 404, message: 'Subscription not found' };
    return sub;
  }

  static async update(id: number, userId: number, input: UpdateSubscriptionInput) {
    await this.getById(id, userId);
    return await prisma.subscription.update({
      where: { id },
      data: {
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      },
    });
  }

  static async delete(id: number, userId: number) {
    await this.getById(id, userId);
    return await prisma.subscription.delete({
      where: { id },
    });
  }
}
