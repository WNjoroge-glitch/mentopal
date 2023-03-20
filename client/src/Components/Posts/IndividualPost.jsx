import React,{useEffect,useState} from 'react';
import axios from '../../api/axios';
import { Image,ImageContainer,PostedByData,EngageButtons,PostContainer } from './post.style';

import { Comment } from '../Comments/comment';
import { Like } from './Like';

export const IndividualPost = ({postData,test}) =>{
    const[posts,setPosts] = useState([])
   
    
    useEffect(()=>{
        (async()=>{
                const fetchPosts = await axios.get('/posts/timeline')
                setPosts(fetchPosts.data.rows)

                
    
            })()
    
        },[])

        
        

       
    return (
        <div>
            <h1>Discover</h1>
            {
                posts.map((post,index)=>(
                    <PostContainer key={index}>
                        <PostedByData>
                        <ImageContainer>
                        <Image src={`/${post.profilepicture}`}/>
                        </ImageContainer>
                        <h3>{post.username}</h3>
                        </PostedByData>
                       
                        
                        
                       
                        <p style={{marginBottom:'0'}}>{post.post}</p>
                        <EngageButtons>
                        <Like post={post}/>                       
                        <Comment commentData={postData} post_id ={post.post_id}/> 
                        </EngageButtons>

                        
                    </PostContainer>
                ))
            }
           

        </div>
    )
}
