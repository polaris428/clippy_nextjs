import 'reflect-metadata';
import '@/infrastructure/di/container';
import { POST as joinHandler } from '@/presentation/routes/folders/join/join';

export const POST = joinHandler;
