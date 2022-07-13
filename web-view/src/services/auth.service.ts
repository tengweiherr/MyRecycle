import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export const register = (username: string, email: string, password: string) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};
export const login = (email: string, password: string) => {
  // let navigate = useNavigate();

  // return axios
    // .fetch(API_URL + "login", {
    //   email,
    //   password,
    // })
    const payload = {
      email,
      password,
  };
  fetch(API_URL + 'login', {
      method: 'POST',
      headers: {
          'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
  })
  .then(async res => { 
    try {
        const jsonRes = await res.json();
        if (res.status !== 200) {
          // navigate("/profile");
          window.location.reload();
        } else {
               
        }
    } catch (err) {
        console.log(err);
    };
})
.catch(err => {
    console.log(err);
});

    // .then((response) => {
    //   if (response.data.accessToken) {
    //     localStorage.setItem("user", JSON.stringify(response.data));
    //   }
    //   return response.data;
    // });
};
export const logout = () => {
  localStorage.removeItem("user");
};
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};