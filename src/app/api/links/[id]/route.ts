import 'reflect-metadata';
import '@/infrastructure/di/container';
import { DELETE as deleteHandler } from '@/presentation/routes/links/delete';
import { PATCH as patchHandler } from '@/presentation/routes/links/useUpdateLink';
import { GET as getHandler } from '@/presentation/routes/links/get';

export const GET = getHandler;

export const DELETE = deleteHandler;

export const PATCH = patchHandler;
