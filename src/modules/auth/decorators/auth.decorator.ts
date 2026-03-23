import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';

export const Auth = () => UseGuards(JwtAuthGuard, RoleGuard);
