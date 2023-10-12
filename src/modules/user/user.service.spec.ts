import { UserService } from '@src/modules/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { AuthService } from '@src/modules/auth/services/auth.service';
import { MailerService } from '@nestjs-modules/mailer';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { mockAuthService, mockMailerService } from '@test/mock/mock-services';
import { CACHE_MANAGER } from "@nestjs/cache-manager";

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
});
