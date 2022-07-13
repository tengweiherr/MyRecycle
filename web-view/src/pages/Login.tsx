import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../common/context";

const Login = () => {

  const API_URL = process.env.REACT_APP_API_URL;

  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const { signIn } = React.useContext(AuthContext);

  const onLoggedIn = (token:string, email:string, name:string, role:string ) => {
    fetch( API_URL + 'private', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
    })
    .then(async res => { 
        try {
            const jsonRes = await res.json();
            if (res.status === 200) {
                setMessage(jsonRes.message);
                console.log(jsonRes);
                signIn(token, email, name, role);
            }
        } catch (err) {
            console.log(err);
        };
    })
    .catch(err => {
        console.log(err);
    });
  }


const getMessage = () => {
  const status = isError ? `Error: ` : `Success: `;
  return status + message;
}

  const initialValues: {
    email: string;
    password: string;
    role: string
  } = {
    email: "",
    password: "",
    role: "admin,officer,head"
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });
  
  const handleLogin = (formValue: { email: string; password: string; role: string }) => {

    const { email, password, role } = formValue;
    setMessage("");

    const payload = {
      email,
      password,
      role,
    };

    payload.role = "admin,officer,head,collector";
    
      fetch(API_URL + 'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      .then(async res => { 
        try {
            const jsonRes = await res.json();
            if (res.status !== 200) {
                setIsError(true);
                // setLoading(false);
                setMessage(jsonRes.message);
                // navigate("/officer");
                // window.location.reload();
            } else {
                onLoggedIn(jsonRes.token, jsonRes.email, jsonRes.name, jsonRes.role);
                setIsError(false);
                setMessage(jsonRes.message);                 
            }
        } catch (err) {
            console.log(err);
        };
    })
    .catch(err => {
        console.log(err);
    });

  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src={require("../../src/assets/images/logo.png")}
          alt="profile-img"
          className="profile-img-card"
          style={{height:120, width:120, borderRadius:0}}
        />
        <h3 className="text-center pb-3">Admin Panel</h3>
        {/* <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        /> */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field name="email" type="text" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="alert alert-danger"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>
            <div className="form-group my-3 d-flex justify-content-center">
              <button type="submit" className="btn btn-primary btn-block w-100">
                <span>Login</span>
              </button>
            </div>

            { message ? (
              <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message ? getMessage() : null}
              </div>
            </div>
            ) : 
              ""
            }

          </Form>
        </Formik>
      </div>
    </div>
  );
};
export default Login;