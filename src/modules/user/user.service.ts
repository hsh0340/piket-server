import { randomBytes } from 'crypto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';

import { EmailLoginRequestDto } from '@src/modules/user/dto/email-login-request.dto';
import { AuthService } from '@src/modules/auth/services/auth.service';
import { SuccessResponse } from '@src/common/interfaces/response.interface';
import {
  EmailExistException,
  PasswordMismatchException,
  PhoneExistException,
  UserNotFoundException,
} from '@src/common/exceptions/request.exception';
import { FindEmailRequestDto } from '@src/modules/user/dto/find-email-request.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailerService } from '@nestjs-modules/mailer';
import { CellPhoneDto } from '@src/modules/user/dto/cell-phone.dto';
import { EmailDto } from '@src/modules/user/dto/email.dto';
import { PrismaService } from '@src/modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  async emailJoin(emailJoinRequestDto: EmailJoinRequestDto) {
    const {
      cellPhone,
      password,
      email,
      name,
      sex,
      tosAgree,
      personalInfoAgree,
      ageLimitAgree,
      mailAgree,
      notificationAgree,
    } = emailJoinRequestDto;

    const user = await this.prismaService.userAuthentication.findFirst({
      where: {
        cellPhone,
      },
    });

    if (user) {
      throw new PhoneExistException();
    }

    await this.emailCheck({ email });

    const query = await this.prismaService.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          loginType: 0,
          role: 0,
        },
      });

      const userAuth = await tx.userAuthentication.create({
        data: {
          userNo: user.no,
          password,
          name,
          cellPhone,
          sex,
          tosAgree,
          personalInfoAgree,
          ageLimitAgree,
          mailAgree,
          notificationAgree,
        },
      });

      const response: SuccessResponse<{ userNo: number }> = {
        isSuccess: true,
        code: '1000',
        message: '요청에 성공하였습니다.',
        result: { userNo: user.no },
      };

      return response;
    });
    return query;
  }

  async phoneCheck(cellPhoneDto: CellPhoneDto) {
    const { cellPhone } = cellPhoneDto;
    const isPhoneExist = await this.prismaService.userAuthentication.findFirst({
      where: {
        cellPhone,
      },
    });

    if (isPhoneExist) {
      throw new PhoneExistException();
    }

    const response: SuccessResponse<string> = {
      isSuccess: true,
      code: '1000',
      message: '요청에 성공하였습니다.',
      result: '사용 가능한 전화번호입니다.',
    };

    return response;
  }

  async emailCheck(emailDto: EmailDto) {
    const { email } = emailDto;
    const user = await this.getUserByEmail(email);

    if (user) {
      throw new EmailExistException();
    }

    const response: SuccessResponse<string> = {
      isSuccess: true,
      code: '1000',
      message: '요청에 성공하였습니다.',
      result: '사용 가능한 이메일입니다.',
    };

    return response;
  }

  async emailLogin(emailLoginRequestDto: EmailLoginRequestDto) {
    const { email, password } = emailLoginRequestDto;
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }
    const savedAuth = await this.prismaService.userAuthentication.findFirst({
      where: {
        userNo: user.no,
        password,
      },
    });

    if (!savedAuth) {
      throw new PasswordMismatchException();
    }

    const payload = user.no;
    const accessToken = this.authService.issueAccessToken(payload);
    const refreshToken = await this.authService.issueRefreshToken(payload);

    const response: SuccessResponse<any> = {
      isSuccess: true,
      code: '1000',
      message: '요청에 성공하였습니다.',
      result: {
        accessToken,
        refreshToken,
        userNo: user.no,
        userName: savedAuth.name,
      },
    };

    return response;
  }

  async findEmail(findEmailRequestDto: FindEmailRequestDto) {
    const { name, cellPhone } = findEmailRequestDto;
    const user = await this.prismaService.userAuthentication.findFirst({
      where: {
        name,
        cellPhone,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const userEmail = await this.prismaService.user.findFirst({
      where: {
        no: user.userNo,
      },
    });

    const response: SuccessResponse<{ userNo: number; email: string }> = {
      isSuccess: true,
      code: '1000',
      message: '요청에 성공하였습니다.',
      result: {
        userNo: user.userNo,
        email: userEmail.email,
      },
    };

    return response;
  }

  async findPassword(emailDto: EmailDto) {
    const { email } = emailDto;
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }
    const userAuth = await this.prismaService.userAuthentication.findFirst({
      where: {
        userNo: user.no,
      },
    });

    const response: SuccessResponse<{
      userNo: number;
      cellPhone: string;
      email: string;
    }> = {
      isSuccess: true,
      code: '1000',
      message: '요청에 성공하였습니다.',
      result: {
        userNo: user.no,
        cellPhone: userAuth.cellPhone,
        email: user.email,
      },
    };

    return response;
  }

  async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }

  /**\
   * @deprecated
   * 비밀번호 재설정 방식이 바뀌면서 삭제 될 예정
   */
  async sendPasswordResetEmail(emailDto: EmailDto) {
    const { email } = emailDto;
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    // 1. 무작위 토큰 생성
    const passwordResetToken = randomBytes(15).toString('base64url');

    // 2. 레디스에 회원 고유번호와 무작위 토큰 저장
    await this.cacheManager.set(user.no, passwordResetToken, {
      ttl: 60 * 60 * 30,
    });

    // 3. 메일 발송
    await this.mailerService.sendMail({
      from: 'hsh0340@naver.com',
      to: user.email,
      subject: '비밀번호 초기화 이메일입니다.',
      html: `비밀번호 초기화를 위해서는 아래의 URL을 클릭하여 주세요. http://example/reset-password/${passwordResetToken}`,
    });

    const response: SuccessResponse<string> = {
      isSuccess: true,
      code: '1000',
      message: '요청에 성공하였습니다.',
      result: '이메일 발송에 성공하였습니다.',
    };

    return response;
  }

  async sendTemporaryPassword(emailDto: EmailDto) {
    // 1. 무작위 8자 임시 비밀번호 생성
    const temporaryPassword = randomBytes(8).toString('base64url');

    // 2. 비밀번호 업데이트
    const user = await this.getUserByEmail(emailDto.email);
    const userAuth = await this.prismaService.userAuthentication.findFirst({
      where: {
        userNo: user.no,
      },
    });

    await this.prismaService.userAuthentication.update({
      where: {
        cellPhone: userAuth.cellPhone,
      },
      data: {
        password: temporaryPassword,
      },
    });

    // 3. 임시비밀번호, 비밀번호 재설정 페이지로 이동하는 링크가 담긴 메일 발송
    await this.mailerService.sendMail({
      from: 'hsh0340@naver.com',
      to: user.email,
      subject: '[피켓] 비밀번호가 재설정되었습니다.',
      template: 'public/hi.html',
      html: `
        <h1>임시비밀번호</h1>
        : ${temporaryPassword} 
        비밀번호 초기화를 위해서는 아래의 URL을 클릭하여 주세요. http://example/reset-password/${user.no}
      `,
    });

    const response: SuccessResponse<string> = {
      isSuccess: true,
      code: '1000',
      message: '요청에 성공하였습니다.',
      result: '이메일 발송에 성공하였습니다.',
    };

    return response;
  }

  verifyPasswordToken(token: string) {
    // 토큰 유효시간 검증
  }

  async resetPassword(userNo: number, tempPassword, newPassword: string) {
    const userAuth = await this.prismaService.userAuthentication.findFirst({
      where: {
        userNo,
      },
    });

    console.log(userAuth.password);
    console.log(tempPassword);

    if (userAuth.password !== tempPassword) {
      throw new BadRequestException('임시 비밀번호가 틀렸습니다.');
    }

    await this.prismaService.userAuthentication.updateMany({
      where: {
        userNo,
      },
      data: {
        password: newPassword,
      },
    });

    const response: SuccessResponse<string> = {
      isSuccess: true,
      code: '1000',
      message: '요청에 성공하였습니다.',
      result: '비밀번호 변경에 성공하였습니다.',
    };

    return response;
  }
}
