import 'reflect-metadata';
import '@/infrastructure/di/container';
import { DELETE as deleteHandler } from '@/presentation/routes/links/delete';

export const DELETE = deleteHandler;
