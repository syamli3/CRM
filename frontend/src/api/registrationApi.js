import axios from "axios";

export const userRegistration = (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user`,
        formData
      );
      resolve(response.data);
    } catch (error) {
      if (error.response) {
        reject(error.response.data);
      }
      reject(error);
    }
  });
};
