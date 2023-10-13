import { UserService } from '@src/modules/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { AuthService } from '@src/modules/auth/services/auth.service';
import { MailerService } from '@nestjs-modules/mailer';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { mockAuthService, mockMailerService } from '@test/mock/mock-services';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserEntity } from '@src/entity/user.entity';
import { EmailDto } from '@src/modules/user/dto/email.dto';
import { CellPhoneDto } from '@src/modules/user/dto/cell-phone.dto';
import { UserAuthenticationEntity } from '@src/entity/user-authentication.entity';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getUserByEmail', () => {
    let user: UserEntity;
    let emailDto: EmailDto;

    beforeEach(() => {
      user = new UserEntity();
      emailDto = new EmailDto();
    });

    it('유저 정보를 리턴해야합니다.', async () => {
      /*
       * findFirst 메서드를 mocking 하고, 이 메서드가 user 객체를 반환하도록 설정
       */
      mockPrismaService.user.findFirst.mockResolvedValue(user);

      const result = await userService.getUserByEmail(emailDto); // UserEntity {}

      /*
       * findFirst 메서드가 올바른 where 조건으로 호출되었는지 확인
       */
      expect(mockPrismaService.user.findFirst).toBeCalledWith({
        where: emailDto,
      });

      /**
       * 반환된 결과가 user 객체와 일치하는지 확인
       */
      expect(result).toStrictEqual(user);
    });

    it('유저가 존재하지 않는 경우 null 을 리턴해야합니다.', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(userService.getUserByEmail(emailDto)).resolves.toBeNull();
    });
  });

  describe('phoneDuplicateCheck', () => {
    let cellPhoneDto: CellPhoneDto;
    let userAuth: UserAuthenticationEntity;

    beforeEach(() => {
      cellPhoneDto = new CellPhoneDto();
      userAuth = new UserAuthenticationEntity();
    });

    it('유저가 존재하지 않는 경우 return 하지 않아야합니다.', async () => {
      mockPrismaService.userAuthentication.findUnique.mockResolvedValue(null);

      await expect(
        userService.phoneDuplicateCheck(cellPhoneDto),
      ).resolves.toBeUndefined();
    });

    it('유저가 존재하는 경우 예외를 던져야 합니다.', async () => {
      mockPrismaService.userAuthentication.findUnique.mockResolvedValue(
        userAuth,
      );

      await expect(
        userService.phoneDuplicateCheck(cellPhoneDto),
      ).rejects.toThrowError();
    });
  });
});
