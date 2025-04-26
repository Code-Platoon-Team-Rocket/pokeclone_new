import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '127.0.0.1:8000';

export const userApi = axios.create({
	baseURL: `http://${API_URL}/api/v1/user/`,
});

export const wildApi = axios.create({
	baseURL: `http://${API_URL}/api/v1/pokemon/wild/`,
});

export const pokeApi = axios.create({
	baseURL: `http://${API_URL}/api/v1/pokemon/`,
});

export const teamApi = axios.create({
	baseURL: `http://${API_URL}/api/v1/team/`,
});

export const pokedexApi = axios.create({
	baseURL: `http://${API_URL}/api/v1/pokemon/pokedex/`,
});
