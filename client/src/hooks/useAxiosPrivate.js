import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "../context/auth";


const useAxiosPrivate = () =>{
    const refresh = useRefreshToken()
    const { auth } = useAuth()
    
    useEffect(()=>{
        const requestIntercept = axiosPrivate.interceptors.request.use()
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) =>{
                const prevRequest = error?.config;
                if(error?.response?.status === 403 && !prevRequest?.sent){
                    prevRequest.sent = true
                    const newAccessToken = await refresh()
                    //set the new Access token
                    return axiosPrivate(prevRequest)
                }
            }
        )
        return () => {
            axiosPrivate.interceptors.response.eject(responseIntercept)
        }

    },[auth,refresh])

    return axiosPrivate
}

export default useAxiosPrivate0