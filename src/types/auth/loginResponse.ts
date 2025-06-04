import { User } from './user';
import { Folder } from '../folder/folder';

export interface LoginResponse {
  user: User;
  folders: Folder[];
  sharedFolders: Folder[];
}
