import 'reflect-metadata';
import '@/infrastructure/di/container';
import { DELETE as deleteHandler } from '@/presentation/routes/links/delete';
import { PATCH as pathHandler } from '@/presentation/routes/links/useUpdateLink';

export const DELETE = deleteHandler;

export const PATCH = pathHandler;
