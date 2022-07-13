import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;

export const getPublicContent = () => {
  return axios.get(API_URL + "all");
};
export const getOfficerBoard = () => {
  return axios.get(API_URL + "officer", { headers: authHeader() });
};
export const getHeadBoard = () => {
  return axios.get(API_URL + "head", { headers: authHeader() });
};
