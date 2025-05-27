import { Folder } from './folder';
export interface SharedFolder {
  folder: Folder;
  permission: 'read' | 'write';
}
