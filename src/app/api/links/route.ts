import 'reflect-metadata';
import '@/infrastructure/di/container';
import { POST as createHandler } from '@/presentation/routes/links/create';

export const POST = createHandler;
