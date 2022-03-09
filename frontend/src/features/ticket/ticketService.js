import axios from 'axios';

// const API_URL = '/api/v1/users';
const API_URL = 'http://localhost:5000/api/v1';

//create ticket
const createTicket = async (ticketdata, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/tickets`, ticketdata, config);
  return response.data;
};
//get tickets
const getTickets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/tickets`, config);
  return response.data;
};
//get tickets
const getTicket = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/tickets/${id}`, config);
  return response.data;
};
const tikcetService = {
  createTicket,
  getTickets,
  getTicket,
};
export default tikcetService;
