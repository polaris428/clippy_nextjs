import 'reflect-metadata';
import '@/infrastructure/di/container';

import { PATCH as patchHandler } from '@/presentation/routes/shares/update';

export const PATCH = patchHandler;
