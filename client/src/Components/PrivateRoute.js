import React from 'react';
import { Redirect,Route} from "react-router-dom";
import { useAuth } from "../context/auth";


export const PrivateRoute = ({children,...rest}) =>{
    const {login} = useAuth()
    return (
        <>
          <Route
              {...rest}
              render={({location}) =>{
                return login ? children
              
                
               
                : <Redirect to={{
                  pathname:'/signin',
                  state:{from:location}
                }}/>
              }            
                
              }
            />
        </>
    )
}

