import { Link } from '../link/Link';
export interface Folder {
  id: string;
  name: string;
  ownerId: string;
  isShared: boolean;
  createdAt: Date;
  links: Link[];
}
