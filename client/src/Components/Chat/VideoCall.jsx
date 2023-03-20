import React,{useState,useEffect,useRef} from 'react';

export const VideoCall = ({user}) =>{
    // const [users,setUsers] = useState([])
    // const [start,setStart] = useState(false)
    // const client = useClient()
    const ref=useRef()

    useEffect (()=>{
        user.videoTrack.play(ref.current)
    },[])

    return (
        <div>
            {/* Uid:{user.uid} */}
            <div ref={ref} 
            style={{width:'400px',height:'400px'}}
            ></div>
        </div>
    )


}