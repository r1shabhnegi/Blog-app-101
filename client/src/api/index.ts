import axios from 'axios';

export const serverStatus = async () => {
  const response = await axios.get('http://127.0.0.1:8787');
  return response;
};
