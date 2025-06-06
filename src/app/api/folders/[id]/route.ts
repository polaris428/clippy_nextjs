import 'reflect-metadata';
import '@/infrastructure/di/container';
import { GET as getHandler } from '@/presentation/routes/folders/get';
import { DELETE as deletHandler } from '@/presentation/routes/folders/delete';
import { PATCH as patchHandler } from '@/presentation/routes/folders/update';

export const GET = getHandler;

export const DELETE = deletHandler;

export const PATCH = patchHandler;
