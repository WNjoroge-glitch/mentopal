import React from 'react'
import { useEffect } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { useAuth } from '../../context/auth';
import { Image,ImageContainer } from '../Posts/post.style';
import { Avatar } from '../../style';
import { ChatContainer } from './chat.style';


export const ChatMessages = ({ messages }) => {
    const {user} = useAuth()
    

    

    const isSameSender = (messages, m, i, userId) => {
     
      
           return (
          i < messages.length - 1 &&
          (messages[i + 1].sender !== m.sender ||
            messages[i + 1].sender === undefined) &&
          messages[i].sender !== userId
        );
      };
      
      const isLastMessage = (messages, i, userId) => {
    
        return (
          i === messages.length - 1 &&
          messages[messages.length - 1].sender !== userId &&
          messages[messages.length - 1].sender
        );
      };

      const isSameUser = (messages,m,i) =>{
        return i > 0 && messages[i - 1].sender === m.sender;
      }

      const isSameSenderMargin = (messages,m,i,userId) =>{
        if (
          i < messages.length - 1 &&
          messages[i + 1].sender === m.sender &&
          messages[i].sender !== userId
        )
          return 5;
        else if (
          (i < messages.length - 1 &&
            messages[i + 1].sender !== m.sender &&
            messages[i].sender !== userId) ||
          (i === messages.length - 1 && messages[i].sender !== userId)
        )
          return 0;
        else return "auto";
      }
  return (
    
    
    <div style={{width:'100%'}}>
      
    {
        messages && messages.map((message,index)=>(
            <div key={index} style={{display:'flex',
            flexDirection:'column',
            alignItems:`${
              message.sender === user.data.user_id ? "flex-end" : "flex-start"
              
            }`

            }}>
              <div style={{display:'flex'}}>
             
            
              {(isSameSender(messages,message,index,user.data.user_id)
                || isLastMessage(messages,index,user.data.user_id))
              && (
                <Avatar>    
                       
<Image src={`/${message.profilepicture}`}/>
               
                </Avatar>
           
               )
             
              

                }
 <span style={{
              backgroundColor:`${
               message.sender === user.data.user_id ? "#FFFFFF" : "#3B5998"
               
             }`,
            
            
             marginLeft: isSameSenderMargin(messages, message, index, user._id),
                marginTop: isSameUser(messages, message, index, user.data.user_id) ? 5 : 10,
                borderRadius: "10px",
                padding: "5px 15px",
                maxWidth: "75%",
                

            }}
             >{message.message}</span>
             </div>
             </div>
            
             
           


        ))
    }
</div>
    
  )
}


