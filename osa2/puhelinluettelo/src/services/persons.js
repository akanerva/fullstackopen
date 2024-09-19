import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const req = axios.get(baseUrl);

  return req.then((res) => res.data);
};

const create = (newObject) => {
  console.log("persons.create newObject: ", newObject);
  const req = axios.post(baseUrl, newObject);
  return req.then((res) => res.data);
};

const update = (id, newObject) => {
  console.log("persons.update id: ", id);
  console.log("persons.update newObject: ", newObject);

  return axios.put(`${baseUrl}/${id}`, newObject);
};

const deleteById = (id) => {
  console.log("persons.deleteById id: ", id);
  const req = axios.delete(`${baseUrl}/${id}`);
  return req.then((res) => res.data);
};

export default {
  getAll,
  create,
  update,
  deleteById,
};
