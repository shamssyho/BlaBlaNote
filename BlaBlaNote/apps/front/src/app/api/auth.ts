import axios from './axios';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const login = (email: string, password: string) => {
  return axios.post('/auth/login', {
    email,
    password,
  });
};

export const registre = (user: User) => {
  const response = axios.post('/auth/register', {
    user,
  });

  return response;
};
