import 'reflect-metadata';
import '@/infrastructure/di/container';

import { GET as getHandler } from '@/presentation/routes/shares/get';

export const GET = getHandler;
