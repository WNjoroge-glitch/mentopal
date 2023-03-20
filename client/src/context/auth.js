import React,{ createContext, useState,useEffect } from "react";
import axios from '../api/axios'

const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
    const [auth,setAuth] = useState({})
    const [login,setLogin] = useState(false)
    const [user,setUser] = useState()

    useEffect(()=>{
        (async()=>{
            const loggedInUser = await axios.get('/user')
            setUser(loggedInUser)


        })()
    })


    return (
        <AuthContext.Provider value={{ auth, setAuth,login,setLogin,user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => React.useContext(AuthContext)