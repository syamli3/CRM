import axios from "axios";

const loginApi = (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login`,
        formData
      );
      if (response) {
        sessionStorage.setItem("accessToken", response.data.accessJWT);
        localStorage.setItem(
          "crm-system",
          JSON.stringify({ refreshJWT: response.data.refreshJWT })
        );
        return resolve(response);
      }
      reject(new Error("Some Problem Occured in the server"));
    } catch (error) {
      reject(error);
    }
  });
};

const logoutApi = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/user/logout`,
        {
          headers: {
            authorization: sessionStorage.getItem("accessToken"),
          },
        }
      );
      if (response) {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("crm-system");
        resolve(true);
      }
      reject(false);
    } catch (error) {
      if (error.response.data.message === "User is not logged in")
        resolve(true);
      reject(false);
    }
  });
};

const authorizeAccessToken = async () => {
  const accessJWT = sessionStorage.getItem("accessToken");
  if (accessJWT) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/authorize`,
        {
          headers: {
            authorization: accessJWT,
          },
        }
      );
      if (response) {
        const message = await response.data.message;
        if (message === "Authorized") {
          return true;
        }
      }
    } catch (error) {
      return false;
    }
  }
  return false;
};

const refreshAccessToken = async () => {
  const crmSystem = localStorage.getItem("crm-system");
  const { refreshJWT } = crmSystem ? JSON.parse(crmSystem) : {};
  if (refreshJWT) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/token`, {
        headers: {
          authorization: refreshJWT,
        },
      });
      if (response) {
        const accessJWT = response.data.accessJWT;
        sessionStorage.setItem("accessToken", accessJWT);
        return true;
      }
    } catch (error) {
      if (error.response.data.message === "Forbidden")
        localStorage.removeItem("crm-system");
      return false;
    }
  }
  return false;
};

export { loginApi, logoutApi, authorizeAccessToken, refreshAccessToken };
