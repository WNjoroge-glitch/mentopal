import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from "react-router-dom";
import { PrivateRoute } from "../Components/PrivateRoute";

import { SignIn } from "../Pages/signin";
import SignUp from "../Pages/signup";
import { Home } from "../Pages/Home/home";
import { Chat } from '../Components/Chat/Chat';
import { UserChats } from '../Components/Chat/UserChats';
//import crypto from 'crypto-browersify';
import { Video } from '../Components/Chat/Video';
import { VideoRoom } from '../Components/Chat/VideoRoom';


export const Routes = () =>{
    return (
        <Router>
            <Switch>
                <PrivateRoute exact path ='/'>
                    <Home/>
                </PrivateRoute>
                <PrivateRoute exact path ='/signup'>
                    <SignUp/>
                </PrivateRoute>
                <Route exact path ='/signin'>
                    <SignIn/>
                </Route>
                {/* <Route exact path='/video'>
                    <Redirect to={`/video-chat/${crypto.randomBytes(16).toString('hex')}`}/>
                </Route> */}
                <Route exact path='/chat/video/:id'>
                    <Video/>
                </Route> 
                {/* <Route exact path="/video">
                      <Video/>
                </Route> */}
                <Route exact path="/chat">
                    <UserChats/>
                </Route>

                <Route exact path='/chat/:id'>
                    <Chat/>
                </Route>
                
                
            </Switch>
        </Router>
    )
}
