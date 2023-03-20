const express = require('express')
const router = express.Router()
const pool = require('../config/db')


router.post('/',async(req,res)=>{
    try {
        const {post,category} = req.body
        const postedBy = req.user.id
        
        const newPost = await pool.query('INSERT INTO posts (post,posted_by,posted_on,category) VALUES ($1,$2,$3,$4) RETURNING *',[post,postedBy,new Date(),category])
    const result = newPost.rows[0]
 
    const response = {
        posts:{
            contents:{},
            ids:[]
        },
        users:{},
        comments:{}
    }
    response.posts.contents[result.post_id] = {
        post:result.post,
        postedOn:result.posted_on,
        comments:result.comments,
        likes:result.likes,
        commentIds:[],
        postedBy:result.posted_by,
        liked:false
    }
    response.posts.ids.push(post.post_id)
    res.status(200).json({message:"Added new post",post:response})
        
    } catch (error) {
        console.log(error)
    }
   
    

})

//like post

router.post('/like/:postId',async(req,res)=>{
    const postId = req.params.postId
    console.log(postId)
    const loggedInUser = req.user.id
    try{
        let statement = 'INSERT INTO likes(post_id,user_id,liked_on) VALUES ($1,$2,$3) returning like_id'
        let likedPost = await pool.query(statement,[postId,loggedInUser,Date.now()])
        const response = { liked: likedPost.rows[0].like_id, likes: 0 }
        stmt = 'UPDATE posts SET likes = likes + 1 WHERE post_id = $1 RETURNING likes'
        likedPost = await pool.query(stmt, [postId])
        
    response.likes = likedPost.rows[0].likes
    return res.status(200).json({ message: 'Post liked', content: response })
    } catch(err){
        console.log(err)
        return res
        .status(500)
        .json({ message: 'There was an error while liking the post. Please try again later' })

    }

})

//unlike a post
router.post('/unlike/:likeId',async(req,res)=>{
    const likeId = req.params.likeId
    console.log(likeId)

        try {
            let stmt = 'DELETE FROM likes WHERE like_id = $1 RETURNING *'
            let result = await pool.query(stmt, [likeId])
            stmt = 'UPDATE posts SET likes = likes - 1 WHERE post_id = $1 RETURNING likes'
            result = await pool.query(stmt, [result.rows[0].post_id])
            return res.status(200).json({
              message: 'Post unliked',
              content: { liked: false, likes: result.rows[0].likes }
            })
          } catch (err) {
            return res
              .status(500)
              .json({ message: 'There was an error while unliking the post. PLease try again later' })
          } 
    

})

//make comment

router.post('/comment',async(req,res)=>{
    try {
        const {comment,postId,attachment} = req.body
       
const loggedInUser = req.user.id
let statement = 'INSERT INTO comments (comment,attachment,post,commented_by,commented_on) VALUES ($1,$2,$3,$4,$5) RETURNING *'
//const newPost = await pool.query('INSERT INTO posts (post,posted_by,posted_on,category) VALUES ($1,$2,$3,$4) RETURNING *',[post,postedBy,new Date(),category])  
let newComment = await pool.query(statement,[comment,attachment,postId,loggedInUser,new Date()])

   const response = {
       postId:postId,
       comment_ids:[newComment.rows[0].comment_id],
       comment:{
           [newComment.rows[0].comment_id]:{
               comment:newComment.rows[0].comment,
               author:loggedInUser,
               timestamp:newComment.rows[0].commented_on
           }

       }
   }
   statement = 'UPDATE posts SET comments = comments + 1 WHERE post_id = $1 RETURNING comments'
   newComment = await pool.query(statement,[postId])
   console.log(newComment.rows[0])
//    response.comment = newComment.rows[0].comment
//    res.status(200).json({ message: 'Comment created', contents: newComment.rows })
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
        
    }
   
})
//get comments

router.get('/comment/:postId',async(req,res)=>{
   
    const postId = req.params.postId
   
    const getCommentId = await pool.query('SELECT * FROM comments WHERE post = $1',[postId])
    let query = 'SELECT comments.*,username,profilepicture from comments INNER JOIN users ON users.user_id = comments.commented_by WHERE post = $1'
    let values = [postId]
    if(getCommentId > 0){
        query += 'AND comment_id < $2'
        values.push(getCommentId.rows[0].comment_id)
    
    } else {
        query += 'ORDER BY comment_id DESC LIMIT 3'
    }
    const result = await pool.query(query,values)
    // const response = {
    //     postId:postId,
    //     commentIds:[],
    //     comments:[],
    //     users:{}
    // }
    // result.rows.forEach((comment)=>{
    //     response.commentIds.push(comment.comment_id)
       
    //     response.comments[comment.comment_id] = {
    //         comment:comment.comment,
    //         author:comment.username,
    //         timestamp:comment.commented_on
    //     }
    //     if(!(comment.commented_by in response.users)){
    //         response.users[comment.commented_by] = {
    //             username:comment.username,
    //             avatar:comment.profilepicture
    //         }
    //     }
    // })
    
    // response.commentIds.sort((a,b) => a-b)
    //res.send(response)
   res.status(200).json({comments:result.rows})
    
})
router.get('/timeline',async(req,res)=>{
    //find all the users that the logged in user follows
    try {
    const loggedInUser = req.user.id
    const timeline = await pool.query('SELECT * FROM posts JOIN users ON posts.posted_by = users.user_id JOIN followers ON user_id = following_user WHERE follower_user = $1 OR posted_by = $1;',[loggedInUser])
   
    res.status(200).send(timeline)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error.message})
        
    }
    
})

module.exports = router