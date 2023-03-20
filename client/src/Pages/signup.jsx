import React,{useState} from 'react';
import axios from '../api/axios';


const SignUp= () =>{
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [email,setEmail] = useState('')
    const [profilePicture,setprofilePicture] = useState('')
    const [bio,setBio] = useState('')
    const [categories,setCategories] = useState([])
    
    const mentalHealth = ['Depression','Anxiety','Schizophrenia','ADHD','Bipolar Disorder']
    axios.defaults.withCredentials = true

    const signUpUser = async(e) =>{
        e.preventDefault()
        try {
            const response = await axios.post(`/user/auth/signup`,{
                username:username,
                password:password,
                email:email,
                profilePicture:profilePicture,
                bio:bio,
                categories:categories

            })
            console.log(response)
        } catch (error) {
            console.log(error)
        }

    }
    const checkBoxSubmit = e => {
        e.preventDefault();
        if(e.target.checked){
            setCategories([...categories,e.target.value])
            
        } else {
            const newArr = categories.filter((item) => item !== e.target.value);
            setCategories(newArr);
        }
       
    }


    return (
        <div>
            <form>
                <label>UserName</label>
                <input type='text' name="username" value = {username} onChange={e=>setUsername(e.target.value)}/>
                <label>Email</label>
                <input type='email' name="email" value = {email} onChange={e=>setEmail(e.target.value)}/>
                <label>Password</label>
                <input type='password' name="password" value = {password} onChange={e=>setPassword(e.target.value)}/>
                <label>Profile Picture</label>
                <input type='file' name="profilePicture" value = {profilePicture} onChange={e=>setprofilePicture(e.target.files[0])}/>
                <label>Bio</label>
                <input type='text' name="bio" value = {bio} onChange={e=>setBio(e.target.value)}/>
                <label>Categories</label>
                {
                    mentalHealth.map((item,key)=>(
                        <div key={key}>
                            
                        <input
                        type='checkbox'
                        name='categories'
                        value={item}
                        onChange={checkBoxSubmit}
                        checked={item.checked}
                        />
                        <label>{item}</label>
                        </div>
                        
                    ))
                }
                <button onClick={signUpUser}>Sign Up</button>
                
            </form>

        </div>
    )
    

    

}

export default SignUp