import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

enum Role {
  Entrepreneur = 'entrepreneur',
  Investor = 'investor',
  Engager = 'engager',
  Admin = 'admin',
}

async function main() {
  const roles = [Role.Engager, Role.Entrepreneur, Role.Investor, Role.Admin];

  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: role },
    });

    if (existingRole) {
      console.log(`Role ${role} already exists.`);
      continue;
    }

    await prisma.role.create({
      data: {
        name: role,
      },
    });

    console.log(`Role ${role} created.`);
  }

  // Create permissions first
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

  // Create RolePermission records
  const rolePermissionData: Prisma.RolePermissionCreateManyInput[] = [];

  // Entrepreneur Role
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

  // Investor Role
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

  // Engager Role
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

  // Admin Role
  const adminRoleId = (
    await prisma.role.findUnique({ where: { name: Role.Admin } })
  ).id;
  rolePermissionData.push(
    ...createdPermissions.map((permission) => ({
      roleId: adminRoleId,
      permissionId: permission.id,
    })),
  );

  await prisma.rolePermission.createMany({
    data: rolePermissionData,
  });

  console.log('Roles and permissions seeding completed.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
