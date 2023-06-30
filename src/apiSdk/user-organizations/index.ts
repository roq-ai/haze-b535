import axios from 'axios';
import queryString from 'query-string';
import { UserOrganizationInterface, UserOrganizationGetQueryInterface } from 'interfaces/user-organization';
import { GetQueryInterface } from '../../interfaces';

export const getUserOrganizations = async (query?: UserOrganizationGetQueryInterface) => {
  const response = await axios.get(`/api/user-organizations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createUserOrganization = async (userOrganization: UserOrganizationInterface) => {
  const response = await axios.post('/api/user-organizations', userOrganization);
  return response.data;
};

export const updateUserOrganizationById = async (id: string, userOrganization: UserOrganizationInterface) => {
  const response = await axios.put(`/api/user-organizations/${id}`, userOrganization);
  return response.data;
};

export const getUserOrganizationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-organizations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUserOrganizationById = async (id: string) => {
  const response = await axios.delete(`/api/user-organizations/${id}`);
  return response.data;
};
