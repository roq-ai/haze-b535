import axios from 'axios';
import queryString from 'query-string';
import { CommandInterface, CommandGetQueryInterface } from 'interfaces/command';
import { GetQueryInterface } from '../../interfaces';

export const getCommands = async (query?: CommandGetQueryInterface) => {
  const response = await axios.get(`/api/commands${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCommand = async (command: CommandInterface) => {
  const response = await axios.post('/api/commands', command);
  return response.data;
};

export const updateCommandById = async (id: string, command: CommandInterface) => {
  const response = await axios.put(`/api/commands/${id}`, command);
  return response.data;
};

export const getCommandById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/commands/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCommandById = async (id: string) => {
  const response = await axios.delete(`/api/commands/${id}`);
  return response.data;
};
