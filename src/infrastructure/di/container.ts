import { container } from 'tsyringe';
import { IUserRepository } from '@/domain/user/IUserRepository';
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';

import { IFolderRepository } from '@/domain/folder/IFolderRepository';
import { PrismaFolderRepository } from '@/infrastructure/repositories/PrismaFolderRepository';

container.register<IUserRepository>('IUserRepository', {
  useClass: PrismaUserRepository,
});

container.register<IFolderRepository>('IFolderRepository', {
  useClass: PrismaFolderRepository,
});
