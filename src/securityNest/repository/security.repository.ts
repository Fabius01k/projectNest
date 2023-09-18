import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserSession,
  UserSessionDocument,
  UserSessionView,
} from '../../userNest/schema/user-session.schema';
import { Model } from 'mongoose';

const mapSessionToDto = (session: UserSession): UserSessionView => {
  return {
    ip: session.ip,
    title: session.title,
    lastActiveDate: session.lastActiveDate,
    deviceId: session.deviceId,
  };
};
@Injectable()
export class SecurityRepository {
  constructor(
    @InjectModel(UserSession.name)
    protected userSessionModel: Model<UserSessionDocument>,
  ) {}
  async findUserSessionsInDb(sessionId: string): Promise<UserSessionView[]> {
    const sessions = await this.userSessionModel.find({ sessionId: sessionId });

    return sessions.map(mapSessionToDto);
  }
  async deleteOtherSessionsInDb(
    sessionId: string,
    deviceId: string,
  ): Promise<boolean> {
    const sessionsDeleted = await this.userSessionModel.deleteMany({
      sessionId,
      deviceId: { $ne: deviceId },
    });
    return sessionsDeleted.deletedCount === 1;
  }
  async findSessionsForDelete(deviceId: string): Promise<UserSession | null> {
    console.log(deviceId, 'controller');
    const session = await this.userSessionModel.findOne({
      deviceId: deviceId,
    });
    return session;
  }
  async deleteSessionByDeviceIdInDb(deviceId: string): Promise<boolean> {
    const deletedSession = await this.userSessionModel.deleteOne({
      deviceId: deviceId,
    });

    return deletedSession.deletedCount === 1;
  }
}
