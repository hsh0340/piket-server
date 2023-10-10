import { fakerKO as faker } from '@faker-js/faker';
import { fakerEN as fakerEN } from '@faker-js/faker';

const getRandomLoginType = () => {
  // 0: 이메일, 1: 카카오, 2: 구글, 3: 네이버
  const loginTypeEnumValues = [0, 1, 2, 3];
  const randomIdx = Math.floor(Math.random() * loginTypeEnumValues.length);
  return loginTypeEnumValues[randomIdx];
};

const getRandomRoleType = () => {
  // 0: 가입만 한 상태, 1: 피케터, 2: 광고주, 3: 비회원, 4: 어드민
  const roleTypeEnumValues = [0, 1, 2, 3, 4];
  const randomIdx = Math.floor(Math.random() * roleTypeEnumValues.length);
  return roleTypeEnumValues[randomIdx];
};

export const userSeed = async (prisma) => {
  // await prisma.user.createMany({
  //   data: [
  //     {
  //       email: faker.internet.email(),
  //       loginType: getRandomLoginType(),
  //       roleType: getRandomRoleType(),
  //     },
  //   ],
  // });
  for (let i = 0; i < 500; i++) {
    await prisma.$transaction(async (tx) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const user = await tx.user.create({
        data: {
          email: fakerEN.internet.email({ allowSpecialCharacters: false }),
          loginType: getRandomLoginType(),
          roleType: getRandomRoleType(),
        },
      });

      await tx.userAuthentication.create({
        data: {
          userNo: user.no,
          password: faker.internet.password(),
          name: firstName + lastName,
          cellPhone: faker.phone.number(),
          sex: Math.floor(Math.random() * 2),
          tosAgree: 1,
          personalInfoAgree: 1,
          ageLimitAgree: 1,
          mailAgree: Math.floor(Math.random() * 2),
          notificationAgree: Math.floor(Math.random() * 2),
        },
      });
    });
  }
};
