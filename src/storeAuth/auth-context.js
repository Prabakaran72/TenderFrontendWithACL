import React, { useState } from "react";


const AuthContext = React.createContext({
  token: "",
  roles:[],
  permissions:[],
  isLoggedIn: false,
  login: (token, username, role, permission) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token')
  const [token, setToken] = useState(initialToken); 
  const [role, setRole] = useState([]); 
  const [permission, setPermission] = useState([]); 

  const userIsLoggedIn = !!token;
  

  const loginHandler = (token, username, role, permission) => {
    setToken(token);
    setRole(role);
    setPermission(permission);
    localStorage.setItem('token', token)
    localStorage.setItem('userName', username)
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  };

  const contextValue = {
    token     : token,
    isLoggedIn: userIsLoggedIn,
    role      : role,
    permission: permission,
    login     : loginHandler,
    logout    : logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;