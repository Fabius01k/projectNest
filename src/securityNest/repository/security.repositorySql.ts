import { Injectable } from '@nestjs/common';

import {
  UserSessionSql,
  UserSessionView,
} from '../../userNest/schema/user-session.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueryResult } from 'pg';

const mapSessionToDto = (session: UserSessionSql): UserSessionView => {
  return {
    ip: session.ip,
    title: session.title,
    lastActiveDate: session.lastActiveDate,
    deviceId: session.deviceId,
  };
};
@Injectable()
export class SecurityRepositorySql {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async findUserSessionsInDbSql(sessionId: string): Promise<UserSessionView[]> {
    const session: QueryResult<UserSessionSql> = await this.dataSource
      .query<UserSessionSql>(`
    SELECT *      
    FROM public."UserSession"      
    WHERE
    "sessionId" = '${sessionId}'
    `);

    return session.map(mapSessionToDto);
  }
  async deleteOtherSessionsInDbSql(
    sessionId: string,
    deviceId: string,
  ): Promise<boolean> {
    const [_, sessionsDeleted] = await this.dataSource.query(`
     DELETE
    FROM public."UserSession"
    WHERE "sessionId" <> '${sessionId}'
      AND "deviceId" = '${deviceId}'
  `);
    return sessionsDeleted === 1;
  }
  async findSessionsForDeleteSql(deviceId: string) {
    const session: QueryResult<UserSessionSql | null> = await this.dataSource
      .query<UserSessionSql>(`
      SELECT *
      FROM public."UserSession"
      WHERE "deviceId" = '${deviceId}'
    `);
    return session;
  }
  async deleteSessionInDbSql(deviceId: string): Promise<boolean> {
    const [_, deletedSession] = await this.dataSource.query(`
    DELETE
    FROM public."UserSession"
    WHERE "deviceId" = '${deviceId}'    
    `);
    return deletedSession === 1;
  }
  // async deleteSessionByDeviceIdInDbSql(deviceId: string): Promise<boolean> {
  //   const deletedSession = await this.userSessionModel.deleteOne({
  //     deviceId: deviceId,
  //   });
  //
  //   return deletedSession.deletedCount === 1;
  // }
}
