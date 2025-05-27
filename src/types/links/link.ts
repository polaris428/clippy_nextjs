export interface Link {
  id: string;
  title: string;
  url: string;
  thumbnail: string | null;
  favicon: string | null;
  description: string | null;
  folderId: string;
  isPin: boolean;
  createdAt: Date;
}
