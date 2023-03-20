import React,{useState} from 'react';
import {MdFavorite,MdFavoriteBorder} from 'react-icons/md';
import axios from '../../api/axios';

export const Like = (post) => {
    const [isActive,setIsActive] = useState(false)
    const [likeIconFillColor,setLikeIconFillColor] = useState('white')

    const likePost = async(postId,index) =>{  
      
      setIsActive(!isActive) 
      
      
            if(isActive){
              try{
           
              setLikeIconFillColor('red')
              const resp = await axios.post(`/posts/like/${postId}`)   
            }catch(err){
              console.log(err)
  
          }
            } else {
              try {
                setLikeIconFillColor('white')
                const response = await axios.post(`/posts/unlike/${postId}`)
              } catch (error) {
                console.log(error)
              }
             
            }                 

                  
            
          

       
    }

    const unlikePost = async(postId)=>{
        setIsActive(false)
        console.log('unliked post')  
        // try{
        //     const response = await axios.post('/posts/unlike',{
        //         likeId:postId

        //     })
        // } catch(err){
        //     console.log(err)

        // }
    }
  return (
   <div>
         {/* {isActive ? <MdFavorite fill='#000000' onClick={e=>likePost(post.post_id)}/> : <MdFavoriteBorder onClick={e=>unlikePost(post.post_id)}/>} */}
        <MdFavorite fill={likeIconFillColor} onClick={e=>likePost(post.post.post_id)}/>
         <p>{post.likes}</p>
       
   </div>
  )
}
