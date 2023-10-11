import { randomBytes } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';

import { EmailLoginRequestDto } from '@src/modules/user/dto/email-login-request.dto';
import { AuthService } from '@src/modules/auth/services/auth.service';
import { SuccessResponse } from '@src/common/interfaces/response.interface';
import {
  EmailExistException,
  MailNotSentException,
  PasswordMismatchException,
  PasswordNotUpdatedException,
  PhoneExistException,
  TempPasswordIncorrectException,
  UserNoNotFoundException,
  UserNotCreatedException,
  UserNotFoundException,
} from '@src/common/exceptions/request.exception';
import { FindEmailRequestDto } from '@src/modules/user/dto/find-email-request.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailerService } from '@nestjs-modules/mailer';
import { CellPhoneDto } from '@src/modules/user/dto/cell-phone.dto';
import { EmailDto } from '@src/modules/user/dto/email.dto';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { UserEntity } from '@src/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * 이메일 회원가입 메서드
   * @param emailJoinRequestDto 이메일 회원가입 DTO
   * @return 생성된 유저의 고유번호를 반환합니다.
   * @exception 핸드폰 번호가 이미 존재할 경우 PhoneExistException 을 반환합니다.
   * @exception 이메일이 이미 존재할 경우 EmailExistException 을 반환합니다.
   * @exception 유저 생성에 실패할 경우 UserNotCreatedException 을 반환합니다.
   */
  async emailJoin(emailJoinRequestDto: EmailJoinRequestDto): Promise<number> {
    const { cellPhone, email, ...rest } = emailJoinRequestDto;
    let newUser: UserEntity; // db에 insert 된 유저를 리턴하기 위해 선언

    /*
     * 핸드폰 번호를 기준으로 이미 존재하는 유저인지 확인합니다.
     */
    const existingUser = await this.prismaService.userAuthentication.findUnique(
      {
        where: {
          cellPhone,
        },
      },
    );

    if (existingUser) {
      throw new PhoneExistException();
    }

    /*
     * 이미 존재하는 이메일인지 확인합니다.
     */
    await this.emailCheck({ email });

    try {
      await this.prismaService.$transaction(async (tx) => {
        newUser = await tx.user.create({
          data: {
            email,
            loginType: 0,
            roleType: 0,
          },
        });

        await tx.userAuthentication.create({
          data: {
            userNo: newUser.no,
            cellPhone,
            ...rest,
          },
        });
      });
      return newUser.no;
    } catch (err) {
      console.log(err);
      throw new UserNotCreatedException();
    }
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
        userRoleType: user.roleType,
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

  async sendTempPasswordEmail(emailDto: EmailDto) {
    // 1. 무작위 8자 임시 비밀번호 생성
    const tempPassword = this.generateRandomPassword();
    // 2. 비밀번호 업데이트
    const user = await this.getUserByEmail(emailDto.email);
    if (!user) {
      throw new UserNotFoundException();
    }

    await this.updatePassword(user.no, tempPassword);

    try {
      // 3. 임시비밀번호, 비밀번호 재설정 페이지로 이동하는 링크가 담긴 메일 발송
      await this.mailerService.sendMail({
        from: 'hsh0340@naver.com',
        to: user.email,
        subject: '[피켓] 비밀번호가 재설정되었습니다.',
        template: 'public/hi.html',
        html: `
        <h1>임시비밀번호</h1>
        ${tempPassword}<br> <button>비밀번호 복사</button><br>
        비밀번호 재설정을 위해서는 아래의 URL을 클릭하여 주세요. http://piket-fe.s3-website.ap-northeast-2.amazonaws.com/find_pw/${user.no}
        
      `,
      });
    } catch (err) {
      throw new MailNotSentException();
    }

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

  generateRandomPassword() {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numericChars = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    // 각 카테고리에서 무작위 문자 선택
    const randomLowercaseChar = this.getRandomChar(lowercaseChars);
    const randomUppercaseChar = this.getRandomChar(uppercaseChars);
    const randomNumericChar = this.getRandomChar(numericChars);
    const randomSpecialChar = this.getRandomChar(specialChars);

    // 나머지 글자 생성
    const remainingChars = this.getRandomChars(
      lowercaseChars + uppercaseChars + numericChars + specialChars,
      4,
    );

    // 모든 문자 결합
    const passwordChars =
      randomLowercaseChar +
      randomUppercaseChar +
      randomNumericChar +
      randomSpecialChar +
      remainingChars;

    // 문자 무작위로 섞기
    const passwordArray = passwordChars.split('');
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [
        passwordArray[j],
        passwordArray[i],
      ];
    }

    // 배열을 문자열로 변환
    const randomPassword = passwordArray.join('');

    return randomPassword;
  }

  getRandomChar(characters) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  }

  getRandomChars(characters, count) {
    let result = '';
    for (let i = 0; i < count; i++) {
      result += this.getRandomChar(characters);
    }
    return result;
  }

  async updatePassword(userNo: number, password: string) {
    const passwordUpdateQuery =
      await this.prismaService.userAuthentication.updateMany({
        where: {
          userNo,
        },
        data: {
          password,
        },
      });

    if (passwordUpdateQuery.count === 0) {
      throw new PasswordNotUpdatedException();
    }
  }

  async resetPassword(userNo: number, tempPassword, newPassword: string) {
    const userAuth = await this.prismaService.userAuthentication.findFirst({
      where: {
        userNo,
      },
    });

    if (!userAuth) {
      throw new UserNoNotFoundException();
    }

    if (userAuth.password !== tempPassword) {
      throw new TempPasswordIncorrectException();
    }

    await this.updatePassword(userNo, newPassword);

    const response: SuccessResponse<string> = {
      isSuccess: true,
      code: '1000',
      message: '요청에 성공하였습니다.',
      result: '비밀번호 변경에 성공하였습니다.',
    };

    return response;
  }
}
