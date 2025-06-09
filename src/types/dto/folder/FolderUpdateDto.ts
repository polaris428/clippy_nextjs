export type FolderUpdateDto = {
  name?: string;
  isShared?: boolean;
  isInvite?: boolean;
  isTemp?: boolean;
};

export const FolderUpdateDtoKeys: (keyof FolderUpdateDto)[] = [
  'name',
  'isShared',
  'isInvite',
  'isTemp'
];
