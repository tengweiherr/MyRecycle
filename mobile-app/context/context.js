import React from "react";

export const AuthContext = React.createContext();

export const LoadingContext = React.createContext({
    isLoading: false,
    setIsLoading: (isLoading) => {} 
});

export const UserContext = React.createContext({
    user: {
        id:null,
        name:null,
        email:null,
        points:0
    },
    setUser: (user) => {} 
});