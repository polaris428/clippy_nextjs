import { container } from 'tsyringe';
import { IUserRepository } from '@/domain/repositories/user/IUserRepository';
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';

import { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import { PrismaFolderRepository } from '@/infrastructure/repositories/PrismaFolderRepository';

import { ILinkRepository } from '@/domain/repositories/link/ILinkRepository';
import { PrismaLinkRepository } from '@/infrastructure/repositories/PrismaLinkRepository';
import { IShareFolderRepository } from '@/domain/repositories/share-folder/IShareFolderRepository';
import { PrismaShareFolderRepository } from '@/infrastructure/repositories/PrismaShareFolderRepository';
import { IMetadataScraperService } from '@/domain/services/IMetadataScraperService';
import { PuppeteerMetadataScraperService } from '../services/PuppeteerMetadataScraperService';

container.register<IUserRepository>('IUserRepository', {
  useClass: PrismaUserRepository,
});

container.register<IFolderRepository>('IFolderRepository', {
  useClass: PrismaFolderRepository,
});

container.register<IShareFolderRepository>('IShareFolderRepository', {
  useClass: PrismaShareFolderRepository,
});

container.register<ILinkRepository>('ILinkRepository', {
  useClass: PrismaLinkRepository,
});

container.register<IMetadataScraperService>('IMetadataScraperService', {
  useClass: PuppeteerMetadataScraperService,
});
