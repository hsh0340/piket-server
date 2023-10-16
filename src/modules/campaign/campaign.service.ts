import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/prisma/prisma.service';

@Injectable()
export class CampaignService {
  constructor(private readonly prismaService: PrismaService) {}
}
