const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const tokenList = {}
const {authRequest} = require('../config/auth')




//create a user
router.post('/auth/signup',async(req,res)=>{
        try {
           
            const {username,password,email,profilePicture,bio,categories}= req.body
            const userName = await pool.query('SELECT user_id FROM users WHERE username = $1',[username])
            if (userName.rowCount > 0){
                res.status(409).json({message:'The username already exists. Please try another username'})
            }
            const Email = await pool.query('SELECT user_id FROM users WHERE email = $1',[email])
            if (Email.rowCount > 0){
                res.status(409).json({message:'Looks like the email has been already registred. Login instead or use a different email.'})
            } else {
                const hashedPassword = await bcrypt.hash(password,10)
               
                //const newUser = await pool.query('INSERT INTO users(username,password,email,profilepicture,bio,categories,followers,following,joinedon) VALUES($1,$1,$1,$1,$1,$1,$1,$1,$1)',[username,hashedPassword,email,profilePicture,bio,categories.split(','),followers,following,new Date()])
                const newUser = await pool.query('INSERT INTO users(username,password,email,profilepicture,bio,categories,joinedon) VALUES($1,$2,$3,$4,$5,$6,$7)',[username,hashedPassword,email,profilePicture,bio,categories,new Date()])
                res.status(200).json({message:'Successful sign up'})
            }
            
        } catch (error) {
            res.status(500).json({message:'There was an error signing you in. Please try again'})
            console.log(error)
            
        }
})

router.post('/auth/login',async(req,res)=>{
   
    try{
        const {email,password} = req.body
        const user = await pool.query('SELECT user_id,username,password FROM users WHERE email = $1',[email])
        if(!user.rowCount){
            res.status(404).json({message:"User not found"})
        } else {
            const verifiedPassword = await bcrypt.compare(password,user.rows[0].password)
            if(!verifiedPassword){
                res.status(401).json({message:'Email/password does not match. Please try again'})
            }

        
       

        const token = jwt.sign({userId:user.rows[0].user_id,email:user.rows[0].email},process.env.JWT_SECRET_KEY,{expiresIn:'10m'})
        const refreshToken = jwt.sign({userId:user.rows[0].user_id,email:user.rows[0].email},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'24h'})
       
       res.cookie('refreshToken',refreshToken,{
           maxAge:3.154e10,
           httpOnly:true
       })
       res.cookie('accessToken',token,{
        httpOnly:true,
        maxAge:300000
    })
       const response = {
           "status":"Logged in",
           "accessToken":token,
           "refreshToken":refreshToken
       }
       tokenList[refreshToken] = response
     
       res.status(200).json(response)
    }

    } catch(err){
        console.log(err)
        //res.status(500).json({message:'There was an error logging in. Please try again'})

    }
})
router.get('/therapists',async(req,res)=>{
    const counsellor = 'counsellor'
    const users = await pool.query('SELECT * FROM users WHERE role = $1',[counsellor])
    res.status(200).send(users.rows)
    //res.status(200).send(users.rows[0])
})

router.get('/basic',async(req,res)=>{
    const role = 'user'
    const users = await pool.query('SELECT * FROM users WHERE role = $1',[role])

    res.status(200).send(users.rows)
})

router.get('/',authRequest,async(req,res)=>{
    const user = await pool.query('SELECT * FROM users WHERE user_id = $1',[req.user.id])
    res.status(200).send(user.rows[0])
})

router.post('/token',(req,res)=>{
    
    try {
        
    
    const {refreshToken,email,id} = req.body
   
    
    if((refreshToken) && (refreshToken in tokenList)){
        const token = jwt.sign({userId:id,email:email},process.env.JWT_SECRET_KEY,{expiresIn:'10m'})
        const response = {
            'token':token,
        }
        tokenList[refreshToken].token=token
        res.send(response)
       
    } else {
        res.send('token not found')
    }

   

   
} catch (error) {
        console.log(error)
        res.status(500).json({message:"Session expired.Login Again"})
}
})

//follow user

router.post('/follow',authRequest,async(req,res)=>{
    //logged in user is the follower
   
    
    const follower = req.user.id
    const {followedUser} = req.body
    try {
        const followUser = await pool.query('INSERT INTO followers(follower_user,following_user,followed_on) VALUES($1,$2,$3) RETURNING *',[follower,followedUser,new Date()])
        const followingCount = await pool.query('UPDATE users SET following = following + 1 WHERE user_id = $1 RETURNING username,profilepicture,following',[follower])
        const followerCount = await pool.query('UPDATE users SET followers = followers + 1 WHERE user_id = $1 RETURNING followers',[followedUser])
        //console.log(followerCount)
        const response = {
            followerId : followedUser,
            followerCount : followerCount.rows[0].followers,
            followers:[follower],
            users:{
                [follower] :{
                    username: followingCount.rows[0].username,
                    profile:followingCount.rows[0].profilepicture,
                    count:followingCount.rows[0].following
                }
            },
            isFollowing : followUser.rows[0].follower_id
            
        }
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        //return res.status(500).json({ message: 'There was an error. Please try again later' ,error:error.message})
    }
})

router.post('/auth/logout',(req,res)=>{
    res.cookie('accessToken','',{
        maxAge:0,
        httpOnly:true
    })
    return res.send({message:"logout successful"})
})

router.post("/test",(req,res)=>{
    console.log(req.cookies)
})



module.exports = router