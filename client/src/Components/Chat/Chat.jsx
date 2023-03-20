import React,{useState,useEffect,useRef} from 'react';
import { io } from 'socket.io-client';
import axios from '../../api/axios';
import { useParams,useLocation, Link } from 'react-router-dom';
import {IoMdSend} from 'react-icons/io';
import {ChatMessages} from './ChatMessages';
import { useAuth } from '../../context/auth';
import { Input,InputField,MessageHeader,MessagesDiv,ChatContainer } from './chat.style';
import {BsEmojiSmile} from 'react-icons/bs';
import Picker from 'emoji-picker-react';
import {BsFillCameraVideoFill} from 'react-icons/bs';
import {StyledLink} from '../../style';



export const Chat = () =>{
    let { id } = useParams()
    const {user} = useAuth()
    const inputRef = useRef(null)
    const location = useLocation()
    
    const userName = location.state.name
    const [chosenEmoji,setChosenEmoji] = useState(null)
    const [picker,setPicker] = useState(false)

    const [subscribed,setSubscriptionStatus] = useState(false)
    const [msg,setMsg] = useState('')
    const [messageSent,setMessageSent] = useState('')
    const [name,setNames] = useState('before message sent')
    const [messages,setMessages] = useState([])
    const [username,setUserName] = useState('')
    const [modal,setModal] = useState(false)
    const ENDPOINT = 'http://localhost:5000'
    var socket
   
    useEffect (()=>{
       
        socket = io('http://localhost:5000',{
            withCredentials:true
        })   
       
        socket.on('message',data=>{
            
            
            setMessages([...messages,data])
            setMsg(data)
        })
        socket.emit('online',user.data.user_id)
    },[])

    
    const onEmojiClick = (event, emojiObject) => {
    // setChosenEmoji(emojiObject);
    const cursor = inputRef.current.selectionStart
    const text = messageSent.slice(0, cursor) + emojiObject.emoji + messageSent.slice(cursor);
    setMessageSent(text);
    const newCursor = cursor+emojiObject.emoji.length
    setTimeout(() => inputRef.current.setSelectionRange(newCursor,newCursor), 10)
      };

    

    useEffect(()=>{
       setUserName(userName)
    },[])

    useEffect(()=>{
       (async()=>{
        const subscription = await axios.get('/mpesa/subscription')
        console.log(subscription.data.subscriptionplan)
       
        if(subscription.data.subscriptionplan !== undefined){
            setSubscriptionStatus(true)
        }
       })()

    },[])

    const startCall = () =>{
        setModal(!modal)
    }
    
    const sendMessage = async() =>{

        try {
           setMessageSent('')         
            setMessages([...messages,{message:messageSent,receiver:id,sender:user.data.user_id}])          
            const sentMessage = await axios.post('/msg',{
                message:messageSent,
                receiver:id    
            })
            socket.emit('new message',messageSent)
        } catch (error) {
            console.log(error.message)
        }
        
    }

    const showSubscriptionModal = () =>{
        alert('You do not have an active subscription')

    }

    
    useEffect(()=>{
       
        (async()=>{
            try {
                const allMessages = await axios.get(`/chat/${id}`)
              
                
                setMessages(allMessages.data)
                // console.log(messages)
            } catch (error) {
                console.log(error.message)
                
            }
        })()
    },[id])
    return (
        <ChatContainer>
            <MessageHeader>
 <h1>{username}</h1>

{
    subscribed ? <StyledLink to={`/chat/video/${crypto.randomUUID()}`}> <BsFillCameraVideoFill size='25px'/></StyledLink>
    :
     <BsFillCameraVideoFill onClick={showSubscriptionModal} size='25px'/>
}
       
 
            </MessageHeader>

            
           
          
           
            
           
            {/* <Video socket={socket} userIdToCall={id}/> */}
            <MessagesDiv>
                <ChatMessages messages={messages}/>

            </MessagesDiv>
          <Input>
          <BsEmojiSmile onClick={()=>setPicker(!picker)}/>
           <InputField type='text' ref={inputRef} value={messageSent} placeholder='Write Message' onChange={(e)=>setMessageSent(e.target.value)}/>
          
           {
            picker &&  <Picker onEmojiClick={onEmojiClick} />
           }
          
           
            <IoMdSend onClick={sendMessage}/>
            </Input>


        </ChatContainer>
    )
}
