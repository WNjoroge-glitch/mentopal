import React from 'react';
import useRefreshToken from '../../hooks/useRefreshToken';
import { useAuth } from '../../context/auth';
import { Post } from '../../Components/Posts/post';
import { SideBar } from '../../Components/SideBar/sidebar';
import { Container } from './home.style';


export const Home = () =>{
    const {login} = useAuth()
    const refresh = useRefreshToken()
   

   
    return (
        <Container>         
            
           <Post/>
           <SideBar/>
                   
        </Container>
    )
}