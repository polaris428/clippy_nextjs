import { User } from './user';
import { Folder } from '../folder/folder';
import { SharedFolder } from '../folder/sharedFolder';
export interface LoginResponse {
  user: User;
  folders: Folder[];
  sharedFolders: SharedFolder[];
}
