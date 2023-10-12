import { Inject, Injectable } from '@nestjs/common';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';
import { EmailLoginRequestDto } from '@src/modules/user/dto/email-login-request.dto';
import { AuthService } from '@src/modules/auth/services/auth.service';
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

    await this.phoneDuplicateCheck({ cellPhone });
    await this.emailDuplicateCheck({ email });

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
      throw new UserNotCreatedException();
    }
  }

  /**
   * 핸드폰 번호를 기준으로 이미 존재하는 유저인지 확인하는 메서드
   * @param cellPhoneDto 핸드폰 번호 DTO
   * @return void
   * @exception 핸드폰 번호가 이미 존재할 경우 PhoneExistsException 을 반환합니다.
   */
  async phoneDuplicateCheck(cellPhoneDto: CellPhoneDto): Promise<void> {
    const { cellPhone } = cellPhoneDto;

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

    return;
  }

  /**
   * 이미 존재하는 이메일인지 확인하는 메서드
   * @param emailDto 이메일 DTO
   * @return void
   * @exception 이메일이 이미 존재할 경우 EmailExistsException 을 반환합니다.
   */
  async emailDuplicateCheck(emailDto: EmailDto): Promise<void> {
    const existingUser = await this.getUserByEmail(emailDto);

    if (existingUser) {
      throw new EmailExistException();
    }

    return;
  }

  /**
   * 이메일 로그인 메서드
   * @param emailLoginRequestDto 이메일 로그인 DTO
   * @return 로그인 성공한 유저의 정보와 jwt 토큰을 반환합니다.
   * @exception 이메일에 해당하는 유저가 존재하지 않을 때 UserNotFoundException 을 반환합니다.
   * @exception 이메일 기준으로 조회한 유저의 비밀번호와 로그인 시 입력한 비밀번호가 일치하지 않으면 PasswordMismatchException 을 반환합니다.
   */
  async emailLogin(emailLoginRequestDto: EmailLoginRequestDto): Promise<{
    accessToken: string;
    refreshToken: string;
    userNo: number;
    userRoleType: number;
    userName: string;
  }> {
    const { email, password } = emailLoginRequestDto;

    const existingUser = await this.getUserByEmail({ email });

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    /*
     * 이메일 기준으로 조회한 유저의 비밀번호와 로그인 시 입력한 비밀번호가 일치하는지 확인합니다.
     */
    const existingUserAuth =
      await this.prismaService.userAuthentication.findFirst({
        where: {
          userNo: existingUser.no,
          password,
        },
      });

    if (!existingUserAuth) {
      throw new PasswordMismatchException();
    }

    /**
     * jwt 토큰을 발급합니다.
     */
    const payload = existingUser.no;
    const accessToken = this.authService.issueAccessToken(payload);
    const refreshToken = await this.authService.issueRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      userNo: existingUser.no,
      userRoleType: existingUser.roleType,
      userName: existingUserAuth.name,
    };
  }

  /**
   * 이메일 찾기 메서드
   * @param findEmailRequestDto 이메일 찾기 DTO
   * @return 유저 고유 번호와 이메일을 반환합니다.
   * @exception 입력한 이름과 전화번호에 해당하는 유저가 존재하지 않으면 UserNotFoundException 을 반환합니다.
   */
  async findEmail(findEmailRequestDto: FindEmailRequestDto): Promise<{
    userNo: number;
    email: string;
  }> {
    /*
     * 입력한 이름과 전화번호에 해당하는 유저가 존재하는지 확인합니다.
     */
    const existingUserAuth =
      await this.prismaService.userAuthentication.findFirst({
        where: findEmailRequestDto,
      });

    if (!existingUserAuth) {
      throw new UserNotFoundException();
    }

    /*
     * 유저의 이메일을 조회합니다.
     */
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        no: existingUserAuth.userNo,
      },
    });

    return {
      userNo: existingUser.no,
      email: existingUser.email,
    };
  }

  /**
   * 비밀번호 찾기 메서드
   * @param emailDto 이메일 DTO
   * @return 유저의 고유번호, 핸드폰 번호, 이메일을 반환합니다.
   * @exception 이메일에 해당하는 유저가 존재하지 않는 경우 UserNotFoundException 을 반환합니다.
   */
  async findPassword(
    emailDto: EmailDto,
  ): Promise<{ userNo: number; cellPhone: string; email: string }> {
    const existingUser = await this.getUserByEmail(emailDto);

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    const existingUserAuth =
      await this.prismaService.userAuthentication.findFirst({
        where: {
          userNo: existingUser.no,
        },
      });

    return {
      userNo: existingUser.no,
      cellPhone: existingUserAuth.cellPhone,
      email: existingUser.email,
    };
  }

  /**
   * 이메일 기준으로 유저를 조회하는 메서드
   * @param emailDto 이메일 DTO
   * @return 유저 정보를 리턴합니다.
   */
  getUserByEmail(emailDto: EmailDto): Promise<UserEntity | null> {
    return this.prismaService.user.findFirst({
      where: emailDto,
    });
  }

  /**
   * 임시 비밀번호 메일 전송 메서드
   * @param emailDto
   * @return void
   * @exception 이메일에 해당하는 유저가 존재하지 않을 경우 UserNotFoundException 을 반환합니다.
   * @exception 비밀번호 업데이트에 실패한 경우 PasswordNotUpdatedException 을 반환합니다.
   * @exception 메일 전송에 실패했을 경우 MailNotSentException 을 반환합니다.
   */
  async sendTempPasswordEmail(emailDto: EmailDto) {
    const user = await this.getUserByEmail(emailDto);

    if (!user) {
      throw new UserNotFoundException();
    }

    const tempPassword = this.generateRandomPassword();

    await this.updatePassword(user.no, tempPassword);

    try {
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
    return;
  }

  /**
   * 무작위 8자 비밀번호를 생성하는 메서드
   * @return 영문, 특수문자가 포함된 길이가 8인 무작위 문자열을 반환합니다.
   */
  generateRandomPassword(): string {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numericChars = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    /*
     * 각 카테고리에서 무작위 문자를 선택합니다.
     */
    const randomLowercaseChar = this.getRandomChar(lowercaseChars);
    const randomUppercaseChar = this.getRandomChar(uppercaseChars);
    const randomNumericChar = this.getRandomChar(numericChars);
    const randomSpecialChar = this.getRandomChar(specialChars);

    /*
     * 나머지 글자를 생성합니다.
     */
    const remainingChars = this.getRandomChars(
      lowercaseChars + uppercaseChars + numericChars + specialChars,
      4,
    );

    /*
     * 모든 문자를 결합합니다.
     */
    const passwordChars =
      randomLowercaseChar +
      randomUppercaseChar +
      randomNumericChar +
      randomSpecialChar +
      remainingChars;

    /*
     * 문자를 무작위로 섞습니다.
     */
    const passwordArray = passwordChars.split('');
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [
        passwordArray[j],
        passwordArray[i],
      ];
    }

    /*
     * 배열을 문자열로 변환합니다.
     */
    return passwordArray.join('');
  }

  /**
   * 문자열 내에서 무작위 문자를 선택하는 메서드
   * @param characters 무작위 문자를 선택하기 위한 문자열
   * @return 무작위 문자
   */
  getRandomChar(characters: string) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  }

  /**
   * 문자열 내에서 무작위 문자를 count 만큼 선택하는 메서드
   * @param characters 무작위 문자를 선택하기 위한 문자열
   * @param count 반환할 무작위 문자열의 길이
   * @return 길이가 count 인 무작위 문자열
   */
  getRandomChars(characters: string, count: number) {
    let result = '';
    for (let i = 0; i < count; i++) {
      result += this.getRandomChar(characters);
    }
    return result;
  }

  /**
   * 비밀번호 업데이트 메서드
   * @param userNo 유저 고유 번호
   * @param password 새로운 비밀번호
   * @return void
   * @exception 비밀번호 업데이트에 실패한 경우 PasswordNotUpdatedException 을 반환합니다.
   */
  async updatePassword(userNo: number, password: string): Promise<void> {
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

  /**
   * 임시로 업데이트 된 비밀번호를 업데이트 하는 메서드
   * @param userNo 유저 고유번호
   * @param tempPassword 임시로 업데이트 된 비밀번호
   * @param newPassword 바꾸려는 비밀번호
   * @return void
   * @exception 파라미터로 받은 userNo가 존재하지 않는 경우 UserNoNotFoundException 을 반환합니다.
   * @exception DB에 저장되어있는 비밀번호와 유저가 입력한 비밀번호가 다른 경우 TempPasswordIncorrectException 을 반환합니다.
   * @exception 비밀번호 업데이트에 실패한 경우 PasswordNotUpdatedException 을 반환합니다.
   */
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

    return;
  }
}
