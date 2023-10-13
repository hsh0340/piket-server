export const testAccountSeed = async (prisma) => {
  // 유저타입 미정
  await prisma.user.create({
    data: {
      email: 'test_undefined@test.com',
      loginType: 0,
      roleType: 0,
      userAuthentication: {
        create: {
          cellPhone: '000000',
          password: 'test',
          name: '테스트계정-유저타입미정',
          sex: 1,
          tosAgree: 1,
          personalInfoAgree: 1,
          ageLimitAgree: 1,
          mailAgree: 1,
          notificationAgree: 1,
        },
      },
    },
  });

  // 피케터
  await prisma.user.create({
    data: {
      email: 'test_piketer@test.com',
      loginType: 0,
      roleType: 1,
      userAuthentication: {
        create: {
          cellPhone: '000001',
          password: 'test',
          name: '테스트계정-피케터',
          sex: 1,
          tosAgree: 1,
          personalInfoAgree: 1,
          ageLimitAgree: 1,
          mailAgree: 1,
          notificationAgree: 1,
        },
      },
    },
  });

  // 광고주1
  await prisma.user.create({
    data: {
      email: 'test_advertiser@test.com',
      loginType: 0,
      roleType: 2,
      userAuthentication: {
        create: {
          cellPhone: '000002',
          password: 'test',
          name: '테스트계정-광고주1',
          sex: 1,
          tosAgree: 1,
          personalInfoAgree: 1,
          ageLimitAgree: 1,
          mailAgree: 1,
          notificationAgree: 1,
        },
      },
    },
  });

  // 광고주2
  await prisma.user.create({
    data: {
      email: 'test_advertiser02@test.com',
      loginType: 0,
      roleType: 2,
      userAuthentication: {
        create: {
          cellPhone: '000003',
          password: 'test',
          name: '테스트계정-광고주2',
          sex: 1,
          tosAgree: 1,
          personalInfoAgree: 1,
          ageLimitAgree: 1,
          mailAgree: 1,
          notificationAgree: 1,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: 'test_admin@test.com',
      loginType: 0,
      roleType: 4,
      userAuthentication: {
        create: {
          cellPhone: '000004',
          password: 'test',
          name: '테스트계정-어드민',
          sex: 1,
          tosAgree: 1,
          personalInfoAgree: 1,
          ageLimitAgree: 1,
          mailAgree: 1,
          notificationAgree: 1,
        },
      },
    },
  });
};
