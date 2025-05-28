import { Link } from '../links/link';
export interface Folder {
  id: string;
  name: string;
  ownerId: string;
  isShared: boolean;
  createdAt: Date;
  shareKey?: string | null;
  links: Link[];
  inviteCode?: string | null;
  isInvite: boolean;
}
