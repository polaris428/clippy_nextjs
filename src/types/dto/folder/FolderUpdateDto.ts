export type FolderUpdateDto = {
  name?: string;
  isShared?: boolean;
  isInvite?: boolean;
};
export const FolderUpdateDtoKeys: (keyof FolderUpdateDto)[] = ['name', 'isShared', 'isInvite'];
