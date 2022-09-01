import request from '../utils/request';
import API from '../constants/api';
import { ApplicationJson } from 'constants/api/content_type';

interface ILoginParams {
  account: string;
  password?: string;
}

export const getProjectList = async<T> () => {
  const url = API.getProjectListURI;

  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const login = async<T> (data: ILoginParams) => {
  const url = `${API.loginURI}`;
  
  return request<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': localStorage.getItem('i18n')?.replaceAll('"', '') || 'en-US',
    },
    body: JSON.stringify(data),
  });
};

