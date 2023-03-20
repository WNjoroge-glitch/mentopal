import React,{useEffect,useState} from 'react';
import axios from '../../api/axios';
import { Image } from '../Posts/post.style';
import { Avatar } from '../../style';
import { ChatContainer } from './chat.style';
import { StyledLink } from '../../style';
// import {Link} from 'react-router-dom'

import { PostContainer } from '../Posts/post.style';
export const UserChats = () =>{
    const [chats,setChats] = useState([])

    useEffect(()=>{
        (async()=>{
            try {
                const getChats = await axios.get('/chat')
                
                setChats(getChats.data)
            } catch (error) {
                console.log(error)
            }
        })()

    },[])

    return (

        <ChatContainer>
            <h1>Chats</h1>
            {
                chats && chats.map((c,index)=>(
                   <div key={index}>
                   <StyledLink to={{
                            pathname:`/chat/${c.user_id}`,
                            state:{name:c.username}
                            }}>
                    <PostContainer style={{display:'flex'}}>
                        <Avatar><Image src={`/${c.profilepicture}`}/></Avatar>
                    
                    <div>
                        
                        <p>{c.username}</p>
                    <p>{c.latestmessage}</p>
                        
                   
                    </div>
                  
                    </PostContainer>
                    </StyledLink>
                  
                    </div>
                ))
            }
        </ChatContainer>
    )
}
