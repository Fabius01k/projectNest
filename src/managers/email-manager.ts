import { emailAdapter } from '../adapters/email-adatper';
import { UserRepository } from '../userNest/repository/user.repository';
import { User } from '../userNest/schema/user.schema';

export class EmailManager {
  constructor(protected userRepository: UserRepository) {}

  async sendEmailConfirmationMessage(newUserToRegistration: User) {
    const userConfirmationCode =
      newUserToRegistration.emailConfirmation.confirmationCode;

    const email = newUserToRegistration.accountData.userName.email;
    const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href=https://project-nu-silk.vercel.app/registration-confirmation?code=${userConfirmationCode}>complete registration</a>
        </p>`;

    const subject = 'Код подтверждения регистрации';

    await emailAdapter.sendEmail(email, subject, message);
  }

  async resendEmailConfirmationMessage(email: string, code: string) {
    const userConfirmationCode = code;

    const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://project-nu-silk.vercel.app/registration-confirmation?code=${userConfirmationCode}'>complete registration</a>
        </p>`;
    const subject = 'Новый код подтверждения регистрации';

    await emailAdapter.sendEmail(email, subject, message);
  }

  async resendPasswordCodeMessage(email: string, code: string) {
    const refreshPasswordCode = code;

    const message = `<h1>Password recovery</h1>
        <p>To finish registration please follow the link below:
            <a href='https://project-nu-silk.vercel.app/password-recovery?recoveryCode=${refreshPasswordCode}'>recovery password</a>
        </p>`;
    const subject = 'Код восстановления пароля';

    await emailAdapter.sendEmail(email, subject, message);
  }
}
