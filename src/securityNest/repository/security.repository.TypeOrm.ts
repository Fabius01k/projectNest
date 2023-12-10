import { Injectable } from '@nestjs/common';

import {
  UserSessionSql,
  UserSessionView,
} from '../../userNest/schema/user-session.schema';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { QueryResult } from 'pg';
import { UserTrm } from '../../entities/user.entity';
import { UsersSessionTrm } from '../../entities/usersSession.entity';

const mapSessionToDto = (session: UsersSessionTrm): UserSessionView => {
  return {
    ip: session.ip,
    title: session.title,
    lastActiveDate: session.lastActiveDate,
    deviceId: session.deviceId,
  };
};
@Injectable()
export class SecurityRepositoryTypeOrm {
  constructor(
    @InjectRepository(UsersSessionTrm)
    protected sessionRepository: Repository<UsersSessionTrm>,
  ) {}

  async findUserSessionsInDbTrm(userId: string): Promise<UserSessionView[]> {
    const queryBuilder = this.sessionRepository
      .createQueryBuilder('UsersSessionTrm')
      .where('UsersSessionTrm.userId = :userId', { userId });

    const sessions = await queryBuilder.getMany();
    return sessions.map(mapSessionToDto);
  }
  async deleteOtherSessionsInDbTrm(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const deletedOtherSessions = await this.sessionRepository.delete({
      userId: userId,
      deviceId: Not(deviceId),
    });

    return (
      deletedOtherSessions.affected !== null &&
      deletedOtherSessions.affected !== undefined &&
      deletedOtherSessions.affected > 0
    );
  }
  async deleteAllSessionsInDbTrm(id: string): Promise<boolean> {
    const deletedAllSessions = await this.sessionRepository.delete({
      userId: id,
    });

    return (
      deletedAllSessions.affected !== null &&
      deletedAllSessions.affected !== undefined &&
      deletedAllSessions.affected > 0
    );
  }
  async findSessionsForDeleteTrm(
    deviceId: string,
  ): Promise<UsersSessionTrm | null> {
    const userSession = await this.sessionRepository
      .createQueryBuilder('UsersSessionTrm')
      .where('UsersSessionTrm.deviceId = :deviceId', { deviceId })
      .getOne();
    console.log(userSession, 'repo');
    if (userSession) {
      return userSession;
    } else {
      return null;
    }
  }
  async deleteSessionInDbTrm(deviceId: string): Promise<boolean> {
    const deletedSession = await this.sessionRepository.delete({
      deviceId: deviceId,
    });
    return (
      deletedSession.affected !== null &&
      deletedSession.affected !== undefined &&
      deletedSession.affected > 0
    );
  }
  // async deleteSessionByDeviceIdInDbSql(deviceId: string): Promise<boolean> {
  //   const deletedSession = await this.userSessionModel.deleteOne({
  //     deviceId: deviceId,
  //   });
  //
  //   return deletedSession.deletedCount === 1;
  // }
}
