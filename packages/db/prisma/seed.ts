import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // --- Clean existing data ---
  await prisma.schedule.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  console.log('✓ Cleaned existing data');

  // --- Roles ---
  const adminRole = await prisma.role.create({
    data: { name: 'admin' },
  });
  const userRole = await prisma.role.create({
    data: { name: 'user' },
  });
  console.log('✓ Created roles: admin, user');

  // --- Users ---
  // Passwords are "password123" hashed with bcryptjs (10 rounds)
  const hashedPassword = '$2a$10$m3V6Z/9OXSRlyu7qEq.SM.du/wo3i0marBeM/Ebj.bV9xv1fx/7gy';

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@subtracker.com',
      password: hashedPassword,
      name: 'Admin User',
      roleId: adminRole.id,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@subtracker.com',
      password: hashedPassword,
      name: 'Regular User',
      roleId: userRole.id,
    },
  });
  console.log('✓ Created users: admin@subtracker.com, user@subtracker.com');

  // --- Channels ---
  const emailChannel = await prisma.channel.create({
    data: {
      name: 'Email',
      type: 'email',
      config: { smtpHost: 'smtp.example.com', smtpPort: 587 },
    },
  });

  const smsChannel = await prisma.channel.create({
    data: {
      name: 'SMS',
      type: 'sms',
      config: { provider: 'twilio' },
    },
  });

  const telegramChannel = await prisma.channel.create({
    data: {
      name: 'Telegram',
      type: 'telegram',
      config: { botToken: 'example-bot-token' },
    },
  });
  console.log('✓ Created channels: Email, SMS, Telegram');

  // --- Subscriptions (for admin user) ---
  const netflix = await prisma.subscription.create({
    data: {
      name: 'Netflix',
      description: 'Premium streaming plan',
      amount: 15.99,
      currency: 'USD',
      billingCycle: 'monthly',
      startDate: new Date('2026-01-01'),
      isActive: true,
      userId: adminUser.id,
    },
  });

  const spotify = await prisma.subscription.create({
    data: {
      name: 'Spotify',
      description: 'Family plan',
      amount: 16.99,
      currency: 'USD',
      billingCycle: 'monthly',
      startDate: new Date('2026-02-15'),
      isActive: true,
      userId: adminUser.id,
    },
  });

  const github = await prisma.subscription.create({
    data: {
      name: 'GitHub Pro',
      description: 'Developer plan',
      amount: 4.0,
      currency: 'USD',
      billingCycle: 'monthly',
      startDate: new Date('2025-06-01'),
      isActive: true,
      userId: adminUser.id,
    },
  });

  const adobeCC = await prisma.subscription.create({
    data: {
      name: 'Adobe Creative Cloud',
      description: 'All Apps plan',
      amount: 599.88,
      currency: 'USD',
      billingCycle: 'yearly',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2027-03-01'),
      isActive: true,
      userId: adminUser.id,
    },
  });

  // Subscriptions for regular user
  await prisma.subscription.create({
    data: {
      name: 'YouTube Premium',
      description: 'Ad-free streaming',
      amount: 13.99,
      currency: 'USD',
      billingCycle: 'monthly',
      startDate: new Date('2026-04-01'),
      isActive: true,
      userId: regularUser.id,
    },
  });

  console.log('✓ Created 5 subscriptions (4 admin, 1 regular user)');

  // --- Schedules ---
  await prisma.schedule.create({
    data: {
      subscriptionId: netflix.id,
      channelId: emailChannel.id,
      reminderDate: new Date('2026-09-01T09:00:00Z'),
      message: 'Netflix renewal is coming up tomorrow!',
      isSent: false,
    },
  });

  await prisma.schedule.create({
    data: {
      subscriptionId: spotify.id,
      channelId: smsChannel.id,
      reminderDate: new Date('2026-09-15T08:00:00Z'),
      message: 'Spotify Family plan renews on the 15th',
      isSent: false,
    },
  });

  await prisma.schedule.create({
    data: {
      subscriptionId: github.id,
      channelId: telegramChannel.id,
      reminderDate: new Date('2026-09-01T10:00:00Z'),
      message: 'GitHub Pro monthly charge incoming',
      isSent: false,
    },
  });

  await prisma.schedule.create({
    data: {
      subscriptionId: adobeCC.id,
      channelId: emailChannel.id,
      reminderDate: new Date('2027-02-15T09:00:00Z'),
      message: 'Adobe CC yearly renewal in 2 weeks',
      isSent: false,
    },
  });

  console.log('✓ Created 4 schedules');

  console.log('\n✅ Seeding complete!\n');
  console.log('Test users:');
  console.log(`  admin@subtracker.com (id: ${adminUser.id})`);
  console.log(`  user@subtracker.com (id: ${regularUser.id})`);
  console.log('\nTo generate a test JWT token, run:');
  console.log(
    `  pnpm --filter @sub-tracker/api exec node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({ userId: ${adminUser.id}, roleId: ${adminRole.id} }, 'super-secret-jwt-key-sub-tracker', { expiresIn: '24h' }))"`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    e.exit(1);
  });
