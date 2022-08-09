// eslint-disable-next-line check-file/filename-naming-convention
export const ApplicationJson = () => {
  return {
    'Content-Type': 'application/json',
    'Accept-Language': localStorage.getItem('i18n')?.replaceAll('"', '') || 'en-US',
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'X-OrganizeID': localStorage.getItem('organizeId') || '',
  };
};