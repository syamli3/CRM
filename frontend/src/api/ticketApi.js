import axios from "axios";

const getAllTickets = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.get(`${import.meta.env.VITE_API_URL}/ticket`, {
        headers: {
          authorization: sessionStorage.getItem("accessToken"),
        },
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const createTicket = (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.post(`${import.meta.env.VITE_API_URL}/ticket`, formData, {
        headers: {
          authorization: sessionStorage.getItem("accessToken"),
        },
      });
      if (result) resolve(result.data);
      reject(new Error("Some Problem Occured in the server"));
    } catch (error) {
      if (error.response) reject(error.response.data);
      reject(error);
    }
  });
};

const fetchSingleTicket = (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/ticket/${_id}`,
        {
          headers: {
            authorization: sessionStorage.getItem("accessToken"),
          },
        }
      );
      if (result) resolve(result.data);
      reject(new Error("Some Problem Occured in the server"));
    } catch (error) {
      if (error.response) reject(error.response.data);
      reject(error);
    }
  });
};

const replyOnTicket = (_id, msgObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.put(
        `${import.meta.env.VITE_API_URL}/ticket/${_id}`,
        msgObj,
        {
          headers: {
            authorization: sessionStorage.getItem("accessToken"),
          },
        }
      );
      if (result) resolve(result.data);
      reject(new Error("Some Problem Occured in the server"));
    } catch (error) {
      if (error.response) reject(error.response.data);
      reject(error);
    }
  });
};

const closeTicket = (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.patch(
        `${import.meta.env.VITE_API_URL}/ticket/close-ticket/${_id}`,
        {},
        {
          headers: {
            authorization: sessionStorage.getItem("accessToken"),
          },
        }
      );
      if (result) resolve(result.data);
      reject(new Error("Some Problem Occured in the server"));
    } catch (error) {
      if (error.response) reject(error.response.data);
      reject(error);
    }
  });
};

export { getAllTickets, createTicket, fetchSingleTicket, replyOnTicket, closeTicket };
