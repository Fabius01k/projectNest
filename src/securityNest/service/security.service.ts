import { Injectable } from '@nestjs/common';
import { SecurityRepository } from '../repository/security.repository';
import { UserRepository } from '../../userNest/repository/user.repository';

@Injectable()
export class SecurityService {
  constructor(
    protected securityRepository: SecurityRepository,
    protected userRepository: UserRepository,
  ) {}
}
