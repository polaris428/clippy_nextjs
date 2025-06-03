import 'reflect-metadata';
import '@/infrastructure/di/container';
import { GET as fetchFoldersHandler } from '@/presentation/routes/folders/fetchFolders';
import { DELETE as deletHandler } from '@/presentation/routes/folders/delet';
import { POST as postHandler } from '@/presentation/routes/folders/create';

export const GET = fetchFoldersHandler;

export const POST = postHandler;

export const DELETE = deletHandler;
