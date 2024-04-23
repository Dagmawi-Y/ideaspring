import { Prisma, PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

enum Role {
  Entrepreneur = 'entrepreneur',
  Investor = 'investor',
  Engager = 'engager',
  Admin = 'admin',
}

async function hashPassword(password) {
  const hash = await argon2.hash(password);
  return hash;
}

async function main() {
  const investorTypes = [
    'Angel Investor',
    'Angel Group Angel Investor',
    'Advisor/Mentor',
    'Incubator/Accelerator',
    'Investment Professional',
    'Other',
    'Service Provider',
    'VC Fund',
  ];

  for (const typeName of investorTypes) {
    await prisma.investorType.create({
      data: {
        name: typeName,
      },
    });
  }

  console.log('Investor types created successfully.');
  // Investor Roles
  await prisma.investorRole.createMany({
    data: [
      { role_name: 'Silent' },
      { role_name: 'Daily Involvement' },
      { role_name: 'Weekly Involvement' },
      { role_name: 'Monthly Involvement' },
      { role_name: 'Any' },
    ],
  });
  console.log('Investor roles created successfully.'); // Added console log

  // Tax Relief Options
  await prisma.taxRelief.createMany({
    data: [{ relief_name: 'SEIS' }, { relief_name: 'EIS' }],
  });
  console.log('Tax relief options created successfully.'); // Added console log

  // Startup Stages
  await prisma.stage.createMany({
    data: [
      { stage_name: 'Achieving Sales' },
      { stage_name: 'Breaking Even' },
      { stage_name: 'MVP/Finished Product' },
      { stage_name: 'Other' },
      { stage_name: 'Pre-Startup/R&D' },
      { stage_name: 'Profitable' },
    ],
  });
  console.log('Startup stages created successfully.'); // Added console log

  // Industries
  await prisma.industry.createMany({
    data: [
      { industry_name: 'Agriculture' },
      { industry_name: 'Business Services' },
      { industry_name: 'Education & Training' },
      { industry_name: 'Energy & Natural Resources' },
      { industry_name: 'Entertainment & Leisure' },
      { industry_name: 'Fashion & Beauty' },
      { industry_name: 'Finance' },
      { industry_name: 'Food & Beverage' },
      { industry_name: 'Hospitality, Restaurants & Bars' },
      { industry_name: 'Manufacturing & Engineering' },
      { industry_name: 'Media' },
      { industry_name: 'Medical & Sciences' },
      { industry_name: 'Personal Services' },
      { industry_name: 'Products & Inventions' },
      { industry_name: 'Property' },
      { industry_name: 'Retail' },
      { industry_name: 'Sales & Marketing' },
      { industry_name: 'Software' },
      { industry_name: 'Technology' },
      { industry_name: 'Transportation' },
    ],
  });
  console.log('Industries created successfully.');

  // Countries and Cities (Example)
  await prisma.country.create({ data: { name: 'Ethiopia' } });
  await prisma.city.create({ data: { name: 'Addis Ababa' } });

  // Roles
  const roles = [Role.Engager, Role.Entrepreneur, Role.Investor, Role.Admin];

  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: role },
    });
    if (!existingRole) {
      await prisma.role.create({ data: { name: role } });
      console.log(`Role ${role} created.`);
    }
  }

  // Permissions
  const permissionNames = [
    'CREATE_PITCH',
    'READ_PITCH',
    'UPDATE_PITCH',
    'DELETE_PITCH',
    'CREATE_ACCOUNT',
    'UPDATE_ACCOUNT',
    'DELETE_ACCOUNT',
    'UPVOTE_PITCH',
    'COMMENT_PITCH',
    'VIEW_ANALYTICS',
    'SHORTLIST_INVESTOR',
    'VIEW_SHORTLISTED_INVESTORS',
    'VIEW_INVESTOR_PROFILE',
    'SEND_MESSAGE_TO_INVESTOR',
    'RECEIVE_MESSAGE_FROM_INVESTOR',
    'RECEIVE_ALERTS',
    'VIEW_MATCHED_PITCHES',
    'SEARCH_STARTUPS',
    'FILTER_STARTUPS',
    'VIEW_PITCH_PROFILE',
    'SHOW_INTEREST_IN_PITCH',
    'SHORTLIST_PITCH',
    'VIEW_SHORTLISTED_PITCHES',
    'DOWNLOAD_PITCH_DOCUMENTS',
    'ADMIN_ACCESS',
    'MANAGE_INVESTORS',
    'MANAGE_STARTUPS',
    'MANAGE_USERS',
    'MANAGE_ROLES',
    'MANAGE_PERMISSIONS',
  ];

  const createdPermissions = await Promise.all(
    permissionNames.map((permissionName) =>
      prisma.permission.create({ data: { name: permissionName } }),
    ),
  );

  // Role-Permission Associations
  const rolePermissionData: Prisma.RolePermissionCreateManyInput[] = [];

  // Entrepreneur Permissions
  const entrepreneurPermissions = createdPermissions.filter((permission) =>
    [
      'CREATE_PITCH',
      'READ_PITCH',
      'UPDATE_PITCH',
      'DELETE_PITCH',
      'CREATE_ACCOUNT',
      'UPDATE_ACCOUNT',
      'DELETE_ACCOUNT',
      'UPVOTE_PITCH',
      'COMMENT_PITCH',
      'VIEW_ANALYTICS',
      'SHORTLIST_INVESTOR',
      'VIEW_SHORTLISTED_INVESTORS',
      'VIEW_INVESTOR_PROFILE',
      'SEND_MESSAGE_TO_INVESTOR',
      'RECEIVE_MESSAGE_FROM_INVESTOR',
      'RECEIVE_ALERTS',
    ].includes(permission.name),
  );
  const entrepreneurRoleId = (
    await prisma.role.findUnique({ where: { name: Role.Entrepreneur } })
  ).id;
  rolePermissionData.push(
    ...entrepreneurPermissions.map((permission) => ({
      roleId: entrepreneurRoleId,
      permissionId: permission.id,
    })),
  );

  // Investor Permissions
  const investorPermissions = createdPermissions.filter((permission) =>
    [
      'VIEW_MATCHED_PITCHES',
      'SEARCH_STARTUPS',
      'FILTER_STARTUPS',
      'VIEW_PITCH_PROFILE',
      'SHOW_INTEREST_IN_PITCH',
      'SHORTLIST_PITCH',
      'VIEW_SHORTLISTED_PITCHES',
      'DOWNLOAD_PITCH_DOCUMENTS',
      'RECEIVE_ALERTS',
      'UPVOTE_PITCH',
      'COMMENT_PITCH',
      'CREATE_ACCOUNT',
      'UPDATE_ACCOUNT',
      'DELETE_ACCOUNT',
    ].includes(permission.name),
  );
  const investorRoleId = (
    await prisma.role.findUnique({ where: { name: Role.Investor } })
  ).id;
  rolePermissionData.push(
    ...investorPermissions.map((permission) => ({
      roleId: investorRoleId,
      permissionId: permission.id,
    })),
  );

  // Engager Permissions
  const engagerPermissions = createdPermissions.filter((permission) =>
    [
      'UPVOTE_PITCH',
      'COMMENT_PITCH',
      'CREATE_ACCOUNT',
      'UPDATE_ACCOUNT',
      'DELETE_ACCOUNT',
    ].includes(permission.name),
  );
  const engagerRoleId = (
    await prisma.role.findUnique({ where: { name: Role.Engager } })
  ).id;
  rolePermissionData.push(
    ...engagerPermissions.map((permission) => ({
      roleId: engagerRoleId,
      permissionId: permission.id,
    })),
  );

  // Admin Permissions (All permissions)
  const adminRoleId = (
    await prisma.role.findUnique({ where: { name: Role.Admin } })
  ).id;
  rolePermissionData.push(
    ...createdPermissions.map((permission) => ({
      roleId: adminRoleId,
      permissionId: permission.id,
    })),
  );

  await prisma.rolePermission.createMany({ data: rolePermissionData });
  console.log('Role-permission associations created.');

  // **--- User Creation with Argon2 Hashed Passwords ---**

  const defaultUsers = [
    {
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin@example.com',
      password: 'adminpassword', // Replace with a secure password
      role: Role.Admin,
      profileImage: 'https://example.com/admin_profile.jpg',
      bannerImage: 'https://example.com/admin_banner.jpg',
      town: 'Admintown',
      city: { connect: { name: 'Addis Ababa' } },
      country: { connect: { name: 'Ethiopia' } },
      phoneNumber: '+1234567890',
      mobileNumber: '+0987654321',
      bio: 'Platform administrator.',
    },
    {
      firstName: 'Entrepreneur',
      lastName: 'Test',
      email: 'entrepreneur@example.com',
      password: 'entrepreneurpassword', // Replace with a secure password
      role: Role.Entrepreneur,
      profileImage: 'https://example.com/entrepreneur1_profile.jpg',
      bannerImage: 'https://example.com/entrepreneur1_banner.jpg',
      town: 'Startuptown',
      city: { connect: { name: 'Addis Ababa' } },
      country: { connect: { name: 'Ethiopia' } },
      phoneNumber: '+2468101214',
      mobileNumber: '+13579111315',
      bio: 'Building the next big thing.',
    },
    // ... (Existing user data)

    {
      firstName: 'Engager',
      lastName: 'Test',
      email: 'engager@example.com',
      password: 'engagerpassword', // Replace with a secure password
      role: Role.Engager,
      profileImage: 'https://example.com/engager2_profile.jpg',
      bannerImage: 'https://example.com/engager2_banner.jpg',
      town: 'Engagementville',
      city: { connect: { name: 'Addis Ababa' } },
      country: { connect: { name: 'Ethiopia' } },
      phoneNumber: '+4812161922',
      mobileNumber: '+371114172023',
      bio: 'Supporting innovation and growth.',
    },
    {
      firstName: 'Investor',
      lastName: 'Test',
      email: 'investor@example.com',
      password: 'investorpassword', // Replace with a secure password
      role: Role.Investor,
      profileImage: 'https://example.com/investor2_profile.jpg',
      bannerImage: 'https://example.com/investor2_banner.jpg',
      town: 'Investment City',
      city: { connect: { name: 'Addis Ababa' } },
      country: { connect: { name: 'Ethiopia' } },
      phoneNumber: '+5012345678',
      mobileNumber: '+6098765432',
      bio: 'Seeking promising opportunities.',
    },
  ];

  for (const user of defaultUsers) {
    const hashedPassword = await hashPassword(user.password);

    const createdUser = await prisma.user.create({
      data: {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        password: hashedPassword,
        profile_image: user.profileImage,
        banner_image: user.bannerImage,
        town: user.town,
        city: user.city,
        country: user.country,
        phone_number: user.phoneNumber,
        mobile_number: user.mobileNumber,
        bio: user.bio,
        userRole: {
          create: {
            role: {
              connect: { name: user.role },
            },
          },
        },
      },
    });
    console.log(
      `User created with email: ${createdUser.email} and role: ${user.role}`,
    );
  }

  await prisma.$disconnect();
  console.log('Seeding completed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
