import React,{useState,useEffect} from 'react';
import axios from '../../api/axios';
import {Link} from 'react-router-dom';
import {useAuth} from '../../context/auth'

export const Contact = () =>{
    const {user} = useAuth()
    
    const [contacts,setContacts] = useState([])


    useEffect(()=>{
        
        (async()=>{
           
            const getTherapists = await axios.get('/user/therapists')
            const getBasicUsers = await axios.get('/user/basic')
            if(user.data.role === 'counsellor'){
                
                setContacts(getBasicUsers.data)

            } 
            if(user.data.role === 'user'){
                setContacts(getTherapists.data)
            }
            
           
            
           

        })()
    })
    return (
        <div>
            <h1>Contacts</h1>
            {
                contacts.map((contact,index)=>(
                    <div key={index}>

                        <Link to={{
                            pathname:`/chat/${contact.user_id}`,
                            state:{name:contact.username}
                            }}>{contact.username}</Link>
                        
                    </div>
                ))
            }
        </div>
    )
}