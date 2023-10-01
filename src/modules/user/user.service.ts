import { randomBytes } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';
import { PrismaService } from '@src/modules/prisma/prisma.service';
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

    const isEmailExist = await this.prismaService.userAuthentication.findFirst({
      where: {
        cellPhone,
      },
    });

    if (isEmailExist) {
      throw new PhoneExistException('이미 존재하는 전화번호입니다.');
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
      throw new PhoneExistException('이미 존재하는 전화번호입니다.');
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
    const isEmailExist = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      throw new EmailExistException('이미 존재하는 이메일입니다.');
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
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UserNotFoundException('이 이메일로 가입된 사용자가 없습니다.');
    }

    const savedAuth = await this.prismaService.userAuthentication.findFirst({
      where: {
        userNo: user.no,
        password,
      },
    });

    if (!savedAuth) {
      throw new PasswordMismatchException('비밀번호가 일치하지 않습니다.');
    }

    const payload = user.no;
    const accessToken = this.authService.issueAccessToken(payload);
    return { accessToken, user: { ...user, ...savedAuth } };
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
      throw new UserNotFoundException('유저가 존재하지 않습니다.');
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

  async verifyEmail(emailDto: EmailDto) {
    const { email } = emailDto;
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UserNotFoundException('유저가 존재하지 않습니다.');
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

  async sendPasswordResetEmail(emailDto: EmailDto) {
    const { email } = emailDto;
    // 0. 이메일로 회원 정보 찾기
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UserNotFoundException('유저가 존재하지 않습니다.');
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
}
