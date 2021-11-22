import { client } from "../../api/client";

const { NODE_ENV, REACT_APP_API_BASE_URL } = process.env;

const API_URL = `${
  NODE_ENV === "development" ? REACT_APP_API_BASE_URL : ""
}/api/favorites`;
async function list(signal) {
  try {
    const favorites = await client.get(API_URL, { signal });
    return favorites.map((favorite) => ({ ...favorite }));
  } catch (error) {
    return Promise.reject(error);
  }
}

function read({ id, signal }) {
  try {
    return client.get(`${API_URL}/${id}`, { signal });
  } catch (error) {
    return Promise.reject(error);
  }
}

function create({ id: originalAssetId, signal, ...favorite }) {
  try {
    return client.post(API_URL, { originalAssetId, ...favorite }, { signal });
  } catch (error) {
    return Promise.reject(error);
  }
}

function update({ id, signal, ...favorite }) {
  try {
    return client.put(`${API_URL}/${id}`, favorite, { signal });
  } catch (error) {
    return Promise.reject(error);
  }
}

function remove({ id, signal }) {
  try {
    return client.delete(`${API_URL}/${id}`, { signal });
  } catch (error) {
    return Promise.reject(error);
  }
}

export { create, list, read, remove, update };
