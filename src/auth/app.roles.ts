import { RolesBuilder } from 'nest-access-control';

export enum Roles {
  ENTREPRENEUR = 'entrepreneur',
  INVESTOR = 'investor',
  ENGAGER = 'engager',
  ADMIN = 'admin',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(Roles.ENTREPRENEUR)
  .createOwn('pitch')
  .readAny('pitch')
  .updateOwn('pitch')
  .deleteOwn('pitch')
  .grant(Roles.INVESTOR)
  .extend(Roles.ENTREPRENEUR)
  .readAny('startup')
  .createOwn('interest')
  .updateOwn('interest')
  .deleteOwn('interest')
  .grant(Roles.ENGAGER)
  .extend(Roles.ENTREPRENEUR)
  .readAny('pitch')
  .createOwn('comment')
  .updateOwn('comment')
  .deleteOwn('comment')
  .grant(Roles.ADMIN)
  .extend([Roles.ENTREPRENEUR, Roles.INVESTOR, Roles.ENGAGER])
  .updateAny('pitch')
  .updateAny('startup')
  .updateAny('interest')
  .updateAny('comment')
  .deleteAny('pitch')
  .deleteAny('startup')
  .deleteAny('interest')
  .deleteAny('comment');
