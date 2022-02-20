import axios from 'axios';

// const API_URL = '/api/v1/users';
const API_URL = 'http://localhost:5000/api/v1';
//RegisterUser
const registerUser = async (userData) => {
  console.log('RegisterUser', userData);
  const response = await axios.post(`${API_URL}/users/signup`, userData);
  console.log('Api response', response.data);
  if (response) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const loginUser = async (userData) => {
  console.log('loginUser', userData);
  const response = await axios.post(`${API_URL}/users/login`, userData);
  console.log('Api response', response.data);
  if (response) {
    localStorage.setItem('userLogin', JSON.stringify(response.data));
  }
  return response.data;
};

const logoutUser = () => localStorage.removeItem('user');

const authService = {
  registerUser,
  loginUser,
  logoutUser,
};

export default authService;
