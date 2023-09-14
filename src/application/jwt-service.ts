import * as jwt from 'jsonwebtoken';
import { settings } from './settings';
import { ObjectId } from 'mongodb';

// export const jwtService = {
// createAccessJWT(userId: string) {
//     const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '10s'})
//     return token
// },
//
// createRefreshJWT(userId: string) {
//     const token1 = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '20s'})
//     return token1
// },

//   createAccessJWT(userId: string) {
//     const token = jwt.sign({ userId }, settings.JWT_SECRET, {
//       expiresIn: '7m',
//     });
//     return token;
//   },
//
//   createRefreshJWT(userId: string, refreshTokenPayload: any) {
//     const token1 = jwt.sign(
//       { userId, ...refreshTokenPayload },
//       settings.JWT_SECRET,
//       { expiresIn: '20s' },
//     );
//     return token1;
//   },
//
//   getUserIdByToken(token: string) {
//     try {
//       const result: any = jwt.verify(token, settings.JWT_SECRET);
//       return result.userId;
//     } catch (error) {
//       return null;
//     }
//   },
//
//   getDeviceIdByToken(token: string) {
//     try {
//       const result: any = jwt.verify(token, settings.JWT_SECRET);
//       return result.deviceId;
//     } catch (error) {
//       return null;
//     }
//   },
//
//   getTokenCreationDate(token: string) {
//     try {
//       const result: any = jwt.verify(token, settings.JWT_SECRET);
//       const tokenCreationDate = new Date(result.iat * 1000);
//       return tokenCreationDate;
//     } catch (error) {
//       return null;
//     }
//   },
// };
