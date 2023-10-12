import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import prisma from '../../client';

jest.mock('../../client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(mockPrismaService);
});

export const mockPrismaService =
  prisma as unknown as DeepMockProxy<PrismaClient>;
