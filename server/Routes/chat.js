const express = require('express')
const router = express.Router()
const pool = require('../config/db')


//create a chat

router.get('/',async(req,res)=>{
    const chats = await pool.query('SELECT DISTINCT ON (sender,receiver) * FROM messages INNER JOIN users ON users.user_id = messages.receiver WHERE sender = $1',[req.user.id])
    if(chats.rowCount > 0){
        res.status(200).send(chats.rows)
    
    } else {
        res.send({message:'user does not have any chats'})
    }

})


router.get('/:chatId',async(req,res)=>{
    const chatId = req.params.chatId
    
   
    try {
        const chat = await pool.query('SELECT * FROM messages INNER JOIN users ON user_id = receiver WHERE (sender = $1 OR receiver = $1) AND (receiver = $2 OR sender =$2)',[req.user.id,chatId])
        //const chat = await pool.query('SELECT * FROM messages WHERE sender = $1',[chatId])
        
        if(chat.rowCount > 0){
            res.status(200).send(chat.rows)
        } else {
        //res.send('no chat exists')
            try {
                const chat = await pool.query('INSERT INTO chats (logged_in_user,receipient,date) VALUES ($1,$2,$3) RETURNING *',[req.user.id,userId,new Date()])
            res.status(200).send(chat)
            } catch (error) {
                res.status(500).send(error.message)
                console.log(error)
            }
            
        }
    } catch (error) {
        //res.send(500).send(error.message)
        console.log(error)
    }

    
   


})


module.exports = router