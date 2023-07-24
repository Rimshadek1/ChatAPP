import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [username, setLoggedInUsername] = useState(null);
    const [id, setid] = useState(null);
    useEffect(() => {
        axios.get('/profile', {}).then(response => {
            setid(response.data.userId);
            setLoggedInUsername(response.data.username);
        })
    }, [])
    return (

        <UserContext.Provider value={{ username, setLoggedInUsername, id, setid }}>
            {children}
        </UserContext.Provider>
    );
}

UserContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
