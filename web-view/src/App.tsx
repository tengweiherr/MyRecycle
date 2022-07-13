import React from "react";
import { useState, useEffect, useReducer } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useRoutes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import './scss/App.scss';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import BoardOfficer from "./pages/BoardOfficer";
import BoardHead from "./pages/BoardHead";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Collectors from "./pages/Collectors";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Rewards from "./pages/Rewards";
import Materials from "./pages/Materials";
import MRPoints from "./pages/MRPoints";
import Guide from "./pages/Guide";
import Game from "./pages/Game";
import MRPointsKeyIn from "./pages/MRPointsKeyIn";
import spinner from "./assets/images/Infinity-1s-200px.gif";

import { AuthContext } from "./common/context";
import { Image } from "react-bootstrap";
import Users from "./pages/User";

const App = () => {

  // const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  // const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  // const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

//----------------
enum UserActionType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  RETRIEVE_TOKEN = "RETRIEVE_TOKEN"
}

type UserAction = {
  type: UserActionType,
  token?: string | null,
  email?: string | null,
  name?: string | null,
  role?: string | null,
}

type loginStateType = {
  isLoading : boolean,
  userEmail: string | null,
  userToken: string | null,
  userName: string | null,
  userRole: string | null,
}

const initialLoginState:loginStateType = {
  isLoading : true,
  userEmail: null,
  userToken : null,
  userName: null,
  userRole: null,
};

  //reducer function
  function loginReducer(prevState:loginStateType, action:UserAction):loginStateType{
    const {type, token, email} = action;
    switch (type) {
      case UserActionType.RETRIEVE_TOKEN:
        return {
          ...prevState,
          userEmail: action.email as string,
          userToken: action.token as string,
          userName: action.name as string,
          userRole: action.role as string,
          isLoading: false,
        };
      case UserActionType.LOGIN:
        return {
          ...prevState,
          userEmail: action.email as string,
          userToken: action.token as string,
          userName: action.name as string,
          userRole: action.role as string,
          isLoading: false,
        };
      case UserActionType.LOGOUT:
        return {
          ...prevState,
          userEmail: null,
          userToken: null,
          userName: null,
          userRole: null,
          isLoading: false,
        };
    
      default:
        return prevState;
    }
  }


  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  //declare context
  const authContext = React.useMemo(() => ({
      signIn: async (usertoken:string, useremail:string, username:string, userrole:string) => {
        try {
          await localStorage.setItem('userToken', usertoken);
          await localStorage.setItem('userEmail', useremail);
          await localStorage.setItem('userName', username);
          await localStorage.setItem('userRole', userrole);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: UserActionType.LOGIN, token: usertoken, email: useremail, name:username, role: userrole});
      },
      signOut: async () => {
        try {
          await localStorage.removeItem('userToken');
          await localStorage.removeItem('userEmail');
          await localStorage.removeItem('userName');
          await localStorage.removeItem('userRole');
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: UserActionType.LOGOUT });
      },
      // role: localStorage.getItem('userRole')
  }),[]);

  // const { signOut, nameToPass, emailToPass } = React.useContext(AuthContext);

  useEffect(() => {
    setTimeout(async() => {
      let usertoken;
      let useremail;
      let username;
      let userrole;
      usertoken = null;
      useremail = null;
      username = null;
      userrole = null;
      try {
        usertoken = await localStorage.getItem('userToken');
        useremail = await localStorage.getItem('userEmail');
        username = await localStorage.getItem('userName');
        userrole = await localStorage.getItem('userRole');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: UserActionType.RETRIEVE_TOKEN, token: usertoken, email: useremail, name: username, role: userrole});
    }, 1000); 
  }, [])

  if (loginState.isLoading) {
    return(
      <div className="d-flex justify-content-center align-items-center spinner-div">
          <img className="spinner" src={spinner}/>
      </div>
    );
  } else {
    
  }

//----------------

  // useEffect(() => {
  //   const user = AuthService.getCurrentUser();

  //   if (user) {
  //     setCurrentUser(user);
  //     setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
  //     setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
  //   }

  //   EventBus.on("logout", logOut);

  //   return () => {
  //     EventBus.remove("logout", logOut);
  //   };
  // }, []);

  // const logOut = () => {
  //   AuthService.logout();
  //   setShowModeratorBoard(false);
  //   setShowAdminBoard(false);
  //   setCurrentUser(undefined);
  // };

  // const mainRoutes = {
  //   path: '/',
  //   element: <MainLayout />,
  //   children: [
  //     {path: '*', element: <Navigate to='/404' />},
  //     {path: '/', element: <MainView />},
  //     {path: '404', element: <PageNotFoundView />},
  //     {path: 'account', element: <Navigate to='/account/list' />},
  //   ],
  // };

  // const accountRoutes = {
  //   path: 'account',
  //   element: <AccountLayout />,
  //   children: [
  //     {path: '*', element: <Navigate to='/404' />},
  //     {path: ':id', element: <AccountDetailView />},
  //     {path: 'add', element: <AccountAddView />},
  //     {path: 'list', element: <AccountListView />},
  //   ],
  // };

  // const routing = useRoutes([mainRoutes, accountRoutes]);

  return (
    <AuthContext.Provider value={authContext}>
      { loginState.userToken !== null ? (
        <>
          {loginState.userRole === "collector" ? 
          <Routes>
            <Route path="/" element={<MainLayout/>}>
              <Route index element={<MRPointsKeyIn/>} />
              <Route path="login" element={<Login/>} />
              <Route path="mrpointskeyin" element={<MRPointsKeyIn/>} />
              <Route path="mrpointskeyin/:user_id" element={<MRPointsKeyIn/>} />
            </Route>
          </Routes>
          : <></>}
          {loginState.userRole !== "admin" ? 
          <Routes>
            <Route path="/" element={<MainLayout/>}>
              <Route index element={<Dashboard/>} />
              <Route path="login" element={<Login/>} />
              <Route path="collectors" element={<Collectors/>} />
              <Route path="products" element={<Products/>} />
              <Route path="reports" element={<Reports/>} />
              {/* <Route path="rewards" element={<Rewards/>} />
              <Route path="materials" element={<Materials/>} /> */}
            </Route>
         </Routes>
          : 
          <>
          <Routes>
            <Route path="/" element={<MainLayout/>}>
              <Route index element={<Dashboard/>} />
              <Route path="login" element={<Login/>} />
              <Route path="collectors" element={<Collectors/>} />
              <Route path="products" element={<Products/>} />
              <Route path="reports" element={<Reports/>} />
              <Route path="users" element={<Users/>} />
              <Route path="rewards" element={<Rewards/>} />
              <Route path="materials" element={<Materials/>} />
              <Route path="mrpoints" element={<MRPoints/>} />
              <Route path="guides" element={<Guide/>} />
              <Route path="game" element={<Game/>}/>
            </Route>
         </Routes>
          </>}

        </>

      ) :
      <Login/>
      }

    </AuthContext.Provider>

  );
}

export default App;
