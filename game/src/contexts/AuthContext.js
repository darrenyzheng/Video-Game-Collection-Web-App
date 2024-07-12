import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState();

    const toggleLoggedIn = (boolean) => {
        setIsLoggedIn(boolean);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, toggleLoggedIn }} >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider }