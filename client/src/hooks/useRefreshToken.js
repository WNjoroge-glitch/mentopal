import axios from '../api/axios';
import { useAuth } from '../context/auth';

const useRefreshToken = () =>{
    const {setAuth} = useAuth()
    

    const refresh = async() =>{
        

       
        const response = await axios.post('/user/token',{
           
            refreshToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE2NTM3Mzk3MjUsImV4cCI6MTY1MzgyNjEyNX0.NpgcnFDU1o-bWyCX1ljVFE7HYVWSrKWmmw4kLLg0jXo",
            email:'john@email.com',
            id:9

        })

        
        setAuth(prev =>{
            console.log(JSON.stringify(prev))
            console.log(response)
           
            return{...prev,accessToken:response.data.accessToken}
        })
        return response.data.accessToken
    }
    return refresh;
}

export default useRefreshToken;