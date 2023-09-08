// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidationArguments,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator';
//
// import { Injectable } from '@nestjs/common';
// import { User } from '../../userNest/schema/user.schema';
// import { UserRepository } from '../../userNest/repository/user.repository';
//
// @ValidatorConstraint({ name: 'IsLoginAlreadyUse', async: true })
// @Injectable()
// export class IsLoginAlreadyUse implements ValidatorConstraintInterface {
//   constructor(protected userRepository: UserRepository) {}
//   async validate(login: string): Promise<boolean> {
//     const user: User | null =
//       await this.userRepository.getUserByLoginOrEmail(login);
//     if (user) return false;
//     return true;
//   }
//   defaultMessage(args: ValidationArguments): string {
//     const login = args.constraints[0];
//     return `Login ${login} is already in use`;
//   }
// }
// export function UniqueLoginValidator(validationOptions?: ValidationOptions) {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       name: 'uniqueLogin',
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: IsLoginAlreadyUse,
//     });
//   };
// }
// @ValidatorConstraint({ name: 'IsEmailAlreadyUse', async: true })
// @Injectable()
// export class IsEmailAlreadyUse implements ValidatorConstraintInterface {
//   constructor(protected userRepository: UserRepository) {}
//
//   async validate(email: string): Promise<boolean> {
//     const user: User | null =
//       await this.userRepository.getUserByLoginOrEmail(email);
//     if (user) return false;
//     return true;
//   }
//
//   defaultMessage(args: ValidationArguments): string {
//     const email = args.constraints[0];
//     return `Email ${email} is already in use`;
//   }
// }
// export function UniqueEmailValidator(validationOptions?: ValidationOptions) {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       name: 'uniqueEmail',
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: IsEmailAlreadyUse,
//     });
//   };
// }

// @ValidatorConstraint({ async: true })
// @Injectable()
// export class IsCodeAlreadyUsed implements ValidatorConstraintInterface {
//   constructor(protected userRepository: UserRepository) {}
//
//   async validate(code: string): Promise<boolean> {
//     const user = await this.userRepository.getUserByConfirmationCode(code);
//     if (!user) return false;
//     if (user && user.emailConfirmation.isConfirmed) return false;
//     return true;
//   }
//
//   defaultMessage(args: ValidationArguments): string {
//     const code = args.constraints[0];
//     return `Code ${code} is already used or user is already confirmed`;
//   }
// }
// export function UniqueCodeValidator(validationOptions?: ValidationOptions) {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       name: 'uniqueCode',
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: IsCodeAlreadyUsed,
//     });
//   };
// }
// @ValidatorConstraint({ async: true })
// @Injectable()
// export class IsReCodeAlreadyUsed implements ValidatorConstraintInterface {
//   constructor(protected userRepository: UserRepository) {}
//
//   async validate(email: string): Promise<boolean> {
//     const user = await this.userRepository.getUserByLoginOrEmail(email);
//     if (!user) return false;
//     if (user && user.emailConfirmation.isConfirmed) return false;
//     return true;
//   }
//
//   defaultMessage(args: ValidationArguments): string {
//     const code = args.constraints[0];
//     return `Code ${code} is already used or user is already confirmed`;
//   }
// }
// export function UniqueReCodeValidator(validationOptions?: ValidationOptions) {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       name: 'uniqueReCode',
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: IsCodeAlreadyUsed,
//     });
//   };
// }
