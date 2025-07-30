import Role from '../enums/role.enum';
import { Request } from 'express';

export type JwtUser = {
  userId: string;
  email: string;
  role: Role;
};

export type RequestWithUser = {
  user: JwtUser;
} & Request;
