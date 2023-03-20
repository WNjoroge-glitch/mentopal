const express = require('express')
const router = express.Router()
const pool = require('../config/db')


router.post('/',async(req,res)=>{
    const {message,receiver,chatId} = req.body
    const sender = req.user.id
    try {
        req.io.sockets.emit('message', message);
        
    const saveMessage = await pool.query('INSERT INTO messages (sender,receiver,message,time,chat,latestmessage) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',[sender,receiver,message,new Date(),chatId,message])
    const latestMessage = await pool.query('UPDATE chats SET latestmessage = $1 WHERE chat_id = $2',[message,chatId])
    res.status(200).send(saveMessage.rows[0])
    } catch (error) {
        res.status(500).send(error.message)
        console.log(error)
        
    }
  
   
})

router.get('/:id',async(req,res)=>{
    try {
       
        const userChats = await pool.query('SELECT * FROM chats WHERE chat_id = $1',[req.params.id])
        res.status(200).send(userChats.rows)
    } catch (error) {
        res.status(500).send(error.message)
        console.log(error)
        
    }
})


module.exports = router