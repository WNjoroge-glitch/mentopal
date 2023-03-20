import React ,{useState,useRef,useEffect} from 'react';

import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import {BsFillCameraVideoFill,BsFillTelephoneFill} from 'react-icons/bs';
import {GiPhone} from 'react-icons/gi';
import {FiPhoneCall} from 'react-icons/fi';
import { useAuth } from '../../context/auth';
import { VideoCall } from './VideoCall';
import {Link} from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
// const ENDPOINT = 'http://localhost:5000';
// var socket;


// const client = AgoraRTC.createClient(config);
  const channel = 'video'
const appId = "01d89842030f4bd1b82b7c656d9bc75d"; //ENTER APP ID HERE
const token = "007eJxTYJgXKVd6Y KKcbqfTI2GPR4ozj0skaHj/dHYPl2pN8GeNe6PAYGCYYmFpYWJkYGyQZpKUYphkYZRknmxmapZimZRsbpri4duc3BDIyLB71T9mRgYIBPFZGcoyU1LzGRgAiEwdbA==";
const client = AgoraRTC.createClient({ 
  mode: "rtc", 
  codec: "vp8",
});



export const Video = ({userIdToCall}) =>{
  
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [users,setUsers] = useState([])
  const [localTracks,setLocalTracks] = useState([])
  const [trackState,setTrackState] = useState({video:true,audio:true})

  const muteVideoandAudio = async(mediaType) =>{
    if(mediaType === 'audio'){
      await localTracks[0].setEnabled(!trackState.audio)
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
      } else if (mediaType === 'video'){
        await localTracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
         
      }

  }
  const handleUserJoined = async(user,mediaType) =>{
    await client.subscribe(user,mediaType)

    if (mediaType === 'video'){
      setUsers((previousUsers) => [...previousUsers, user]);
    }
    if (mediaType === 'audio') {
      // user.audioTrack.play()
    }

  }
  const handleUserLeft =  (user) =>{
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );

  }
  useEffect(()=>{
    client.on('user-published',handleUserJoined)
    client.on('user-left',handleUserLeft)
    client
    .join(appId,channel,token,null)
    .then((uid)=>
    Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(),uid])
    
      .then(([tracks,uid])=>{
        const [audioTrack,videoTrack] = tracks
        setLocalTracks(tracks)
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks)

      })
    )
    return () =>{
      for (let localTrack of localTracks){
        localTrack.stop()
        localTrack.close()

      }
      client.off('user-published',handleUserJoined)
      client.off('user-left',handleUserLeft)
      client.unpublish(localTracks).then(()=>client.leave())
    }

  },[])
  return (
    <div style={{display:'flex',justifyContent:'center'}}>
      <h1 className="heading">Agora RTC NG SDK React Wrapper</h1>
    <div style={{display:'grid', gridTemplateColumns:'repeat(2,500px)'}}>
     {
      users.map((user)=>(
        <div>
       
        <VideoCall key={user.uid} user={user}/>
        <button onClick={()=>muteVideoandAudio("audio")}>Mute</button>
        <button onClick={()=>muteVideoandAudio("video")}>Stop video</button>
        </div>
        
      ))
     }
     </div>
      {/* {inCall ? (
        <VideoCall setInCall={setInCall} channelName={channelName} />
      ) : (
        <ChannelForm setInCall={setInCall} setChannelName={setChannelName} />
      )}  */}
    </div>
  );
  
//     const [stream,setStream] = useState()
//     const [receivingCall,setReceivingCall] = useState(false)
//     const [caller,setCaller] = useState('')
//     const [callerSignal,setCallerSignal] = useState()
//     const [callAccepted,setCallAccepted] = useState(false)
//     const [idToCall,setIdToCall] = useState('')
//     const[callEnded,setCallEnded] = useState(false)
//     const [name,setName] = useState('')
//     const [me,setMe] = useState('')
   
//     const {user} = useAuth()

//     const myVideo = useRef()
//     const userVideo = useRef()
//     const connectionRef = useRef()
//     const ROOM_ID = window.location.href;

//     useEffect(()=>{
       
//         socket = io('http://localhost:5000',{
//             withCredentials:true
//         })   
//         //setMe(user.data.user_id)
//         navigator.mediaDevices.getUserMedia({video:true,audio:true})
//         .then((stream)=>{

//             setStream(stream)

//             console.log(stream)
//             window.localStream = stream
//             myVideo.current.srcObject = stream

            
//             peer.on('signal',(call)=>{
//             setCallAccepted(true)
//                call.answer(stream)
//                call.on('stream',(userVideoStream)=>{
//                 setStream(userVideoStream)
//                })
//             })
//             socket.on('user-connected',(userId)=>{
//                 connectToNewUser(userId,stream)
//             })
//             connectionRef.current = peer

            
            
//         })
       
//         socket.on('user',(id)=>{
//             setMe(id)
//         })
      
//         socket.on('callUser',(data)=>{
//             setReceivingCall(true)
//             setCaller(data.from)
//             setName(data.name)
//             setCallerSignal(data.signal)
//         })
       

//     },[])
//     const peer = new Peer({
//         initiator:true,
//         trickle:false,
//         stream:stream

//     })
    
//         const callUser = (id) =>{
           
//             navigator.mediaDevices.getUserMedia({video:true,audio:true})
//             .then((stream)=>{

//                 setStream(stream)

//                 console.log(stream)
//                 window.localStream = stream
//                 myVideo.current.srcObject = stream

                
//                 peer.on('signal',(call)=>{
//                    call.answer(stream)
//                    call.on('stream',(userVideoStream)=>{
//                     setStream(userVideoStream)
//                    })
//                 })
//                 socket.on('user-connected',(userId)=>{
//                     connectToNewUser(userId,stream)
//                 })
//                 connectionRef.current = peer

                
//             })
           
           
           
//             console.log(`${me} is calling ${userIdToCall}`)
//             console.log(receivingCall)
//         }

//         const connectToNewUser = (userId,stream) =>{
//             const call = peer.call(userId,stream)
//             call.on('stream',(userVideoStream)=>{
//                 setStream(userVideoStream)
//             })

//         }

//         peer.on('open',(id)=>{
//             socket.emit('callUser',ROOM_ID,id,user.data.id)

//         })

//         const answerCall = () =>{
//             setCallAccepted(true)
//             const peer = new Peer({
//                 initiator:false,
//                 trickle:false,
//                 stream:stream
//             })
//             peer.on('signal',(data)=>{
//                 console.log(data)
//                 socket.emit('answer call',{signal:data,to:caller})
//             })
//             peer.on('stream',(stream)=>{
//                 userVideo.current.srcObject = stream

//             })
//             peer.signal(callerSignal)
//             connectionRef.current = peer
//             console.log('answering call')
//         }

//         const leaveCall = () => {
//             setCallEnded(true)
//             connectionRef.current.destroy()
//             console.log(connectionRef.current)
//         }
    





//     return (
//         <div>
 
//  {
//    stream && <p>Caller video</p>
//     // stream && <video playsInline muted ref={myVideo} autoPlay style={{width:'300px'}} />
//  }

//  <div>
//     {
//          callAccepted  && <p>User Video</p> 

//     // callAccepted && !callEnded && <video playsInline ref={userVideo} autoPlay style={{width:'500px'}}/> 
//     }
//  </div>
 
//  <div>
//  {callAccepted && !callEnded ? (
// 						//<GiPhone onClick={leaveCall}/>
//                         <p>Leave call</p>
					
// 					) : (
						
//                         <div>
//                        <BsFillCameraVideoFill onClick={() => leaveCall()}/>
            
//                         {/* <BsFillCameraVideoFill onClick={() => callUser(userIdToCall)}/> */}
                       
//                         </div>
                        

                      
							
						
// 					)}
                   
// 					{idToCall}
//  </div>
//  <div>
//  {receivingCall && !callAccepted ? (
// 						<div className="caller">
// 						<h1 >{name} is calling...</h1>
//                         <button onClick={answerCall}>Answer Call</button>
// 						{/* <FiPhoneCall onClick={answerCall}/> */}
							
// 					</div>
// 				) : null}
//  </div>
//         </div>
//     )
}