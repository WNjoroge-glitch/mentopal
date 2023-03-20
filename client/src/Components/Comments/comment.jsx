import React, { useState,useEffect } from 'react';
import {IoMdSend} from 'react-icons/io';
import axios from '../../api/axios';
import {BiCommentDetail} from 'react-icons/bi';
import { Image,ImageContainer } from '../Posts/post.style';
import {useAuth} from '../../context/auth'



export const Comment = ({commentData,post_id}) =>{
    const [commentInfo,setCommentData] = useState([])

    const[postComment,setPostComment] = useState(false)
    const [comment,setComment] = useState('')
    const[postId,setPostId] = useState('')
    const [attachment,setAttachment] = useState('')
    const[Comments,setComments] = useState([])
    //console.log(commentData)
    const sendComment = async(postId) =>{

        try {
            setComment('')
            setComment([...Comments,{comment:comment,postId:postId,attachment:attachment}])
            const sentComment = await axios.post('/posts/comment',{
                comment:comment,
                postId:postId,
                attachment:attachment
            })
        } catch (error) {
            console.log(error)
        }
       
        
        
        
    }
    const getComments = async() =>{
        setPostComment(!postComment)
        
           
            if(!postComment){
                const comments = await axios.get(`posts/comment/${post_id}`)
                setComments(comments.data.comments)
                console.log(comments.data.comments)
        
            }
            
    }

    // useEffect(()=>{
    //     // console.log(commentData)
        
    //      (async()=>{
            
    //         const comments = await axios.get(`/posts/comment/${post_id}`)
    //        console.log(comments)
    //     })()

    // },[])

    return (
        <div>
        <BiCommentDetail onClick={getComments}/>
        {
        postComment && 
        <div>
            <input type="text" value={comment} onChange={(e)=>setComment(e.target.value)}/> <IoMdSend onClick={()=>sendComment(post_id)}/>
            {
                Comments.map((comment,index)=>(
                    <div key={index}>
                        <div style={{display:"flex"}}>
                        <ImageContainer>
                            <Image src={`/${comment.profilepicture}`}/>

                        </ImageContainer>
                        
                        <h2>{comment.username}</h2>
                        </div>
                        
                        <p>{comment.comment}</p>
                    </div>


                ))
            }
          
        </div>
        }

        </div>

    )
}