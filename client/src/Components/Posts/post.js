import React,{useState} from 'react';
import axios from '../../api/axios';
import { IndividualPost } from './IndividualPost';
import { AuthSubmit } from '../../style';
export const Post = () =>{
    
    const [newPost,setNewPost] = useState('')
    const [category,setCategory] = useState('')
    const [postResponse,setPostResponse] = useState([])
   

    const postNewPost = async() =>{
        const new_post = await axios.post('/posts',{
            post:newPost,
            category:category
        })
        console.log(new_post)
        
        
        setPostResponse(new_post.data.post)
    }
    
    return (
        <div>
            <label>Write a new Post</label>
            <input type="text" onChange={e =>setNewPost(e.target.value)}/>
            <select name="category" onChange={e=>setCategory(e.target.value)}>
                <option></option>
                <option>Depression</option>
                <option>Anxiety</option>
                <option>Bipolar</option>
            </select>
            <AuthSubmit onClick={postNewPost}>Post</AuthSubmit>
            <IndividualPost postData={postResponse}/>

        </div>
    )
}