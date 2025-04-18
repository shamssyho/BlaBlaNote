import axios from './axios';

export const get_notes = () => {
  const notes = axios.get('/note');
  return notes;
};
