import React from 'react';

import { Sidebar } from '../../Pages/Home/home.style';
import {AiFillHome} from 'react-icons/ai';
import {AiOutlineSearch} from 'react-icons/ai';
import {IoIosNotificationsOutline,IoIosAdd} from 'react-icons/io';
import {BiMessageAltDetail} from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Icon = {
    cursor:'pointer'
}
export const SideBar = () =>{
    

 
    return (
        <Sidebar>
            <AiFillHome style={Icon} size="30px"/>
            <Link to="/chat"><BiMessageAltDetail style={Icon} size="30px"/></Link>
            {/* <BiMessageAltDetail style={Icon} size="30px" onClick={toggleContacts}>Messages</BiMessageAltDetail> */}
            <IoIosAdd style={Icon} size="30px"/>
            <AiOutlineSearch style={Icon} size="30px"/>
            <IoIosNotificationsOutline style={Icon} size="30px"/>
            
         
        </Sidebar>
    )
}