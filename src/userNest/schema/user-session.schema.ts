// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';

// export type UserSessionDocument = HydratedDocument<UserSession>;
//
// @Schema()
// export class UserSession {
//   @Prop({ type: String, required: true })
//   sessionId: string;
//   @Prop({ type: String, required: true })
//   ip: string;
//   @Prop({ type: String, required: true })
//   title: string;
//   @Prop({ type: String, required: true })
//   deviceId: string;
//   @Prop({ type: String, required: true })
//   lastActiveDate: string;
//   @Prop({ type: String, required: true })
//   refreshToken: string;
//   @Prop({ type: Date, required: true })
//   tokenCreationDate: Date;
//   @Prop({ type: Date, required: true })
//   tokenExpirationDate: Date;
//   constructor(
//     sessionId: string,
//
//     ip: string,
//
//     title: string,
//
//     deviceId: string,
//
//     lastActiveDate: string,
//
//     refreshToken: string,
//
//     tokenCreationDate: Date,
//
//     tokenExpirationDate: Date,
//   ) {
//     this.sessionId = sessionId;
//     this.ip = ip;
//     this.title = title;
//     this.deviceId = deviceId;
//     this.lastActiveDate = lastActiveDate;
//     this.refreshToken = refreshToken;
//     this.tokenCreationDate = tokenCreationDate;
//     this.tokenExpirationDate = tokenExpirationDate;
//   }
// }
export type UserSessionView = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};
export class UserSessionSql {
  sessionId: string;
  ip: string;
  title: string;
  deviceId: string;
  lastActiveDate: string;
  refreshToken: string;
  tokenCreationDate: Date;
  tokenExpirationDate: Date;

  constructor(
    sessionId: string,
    ip: string,
    title: string,
    deviceId: string,
    lastActiveDate: string,
    refreshToken: string,
    tokenCreationDate: Date,
    tokenExpirationDate: Date,
  ) {
    this.sessionId = sessionId;
    this.ip = ip;
    this.title = title;
    this.deviceId = deviceId;
    this.lastActiveDate = lastActiveDate;
    this.refreshToken = refreshToken;
    this.tokenCreationDate = tokenCreationDate;
    this.tokenExpirationDate = tokenExpirationDate;
  }
}

// export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
