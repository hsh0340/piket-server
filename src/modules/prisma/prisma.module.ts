import { Module } from '@nestjs/common';
import { PrismaService } from '@src/modules/prisma/prisma.service';

@Module({
  providers: [PrismaService],
})
export class PrismaModule {}
