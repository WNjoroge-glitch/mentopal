import React,{useState} from 'react';
import axios from '../api/axios';
import {useHistory} from 'react-router-dom'
import {useAuth} from '../context/auth'
import { AuthContainer,AuthForm,AuthInput,Content,Wave,AuthSubmit } from '../style';

const svgStyles = {
    position: 'relative',
    display: 'block',
    width: 'calc(164% + 1.3px)',
    height: '155px'
}
const shapeFill = {
    fill: '#D64933'
}



export const SignIn = () =>{
    const history = useHistory()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const {setLogin,login} = useAuth()

    axios.defaults.withCredentials = true
    
    

   
    const logInUser = async(e) =>{
        try {
            e.preventDefault()
            const userLogIn = await axios.post('http://localhost:5000/user/auth/login',{
                email:email,
                password:password
    
            })
            if(userLogIn.data.status){
                setLogin(true)
                history.push('/')
            }
        } catch (error) {
            console.log(error)
            
        }
      
    }

    return (
        <AuthContainer>
            <Content>
                
            <Wave>
                 
                <svg style={svgStyles} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path style={shapeFill} d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
        </svg>
    </Wave>
    <h1 style={{textAlign:'center'}}>Welcome Back!</h1>
            <AuthForm>
                <label>Email</label>
              <AuthInput type="text" name = "email" value={email} onChange={e => setEmail(e.target.value)}/>
                <label>Password</label>
                <AuthInput type="text" name = "password" value={password} onChange={e => setPassword(e.target.value)}/>
                <p>{login ? 'logged in' :'not logged in'}</p>
                <AuthSubmit onClick={logInUser}>Log in</AuthSubmit>
            </AuthForm>
           
            </Content>
           
            

        </AuthContainer>
    )
}