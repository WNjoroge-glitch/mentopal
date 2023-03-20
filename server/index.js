const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const userRouter = require('./Routes/user')
const postsRouter = require('./Routes/post')
const messageRouter = require('./Routes/message')
const {authRequest} = require('./config/auth')
const chatRouter = require('./Routes/chat')
const mpesa = require('./mpesa')
const { v4: uuidv4 } = require("uuid");
//middleware

app.use(cors({
    credentials:true,
    origin:'http://localhost:3000'
}))
app.use(express.json())
app.use(express.urlencoded({ extended:false }))

const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
const users = {}
io.on('connection',(socket)=>{
  console.log('connected')
  socket.on('new message',(newMessage)=>{
    console.log(newMessage)

  })
  socket.on('online',(user_id)=>{
   
    console.log(`user of userId ${user_id} connected`)
    users[socket.id] = user_id;

  })
//   socket.emit('user',socket.id)
  
//   socket.on('disconnect',()=>{
//     socket.broadcast.emit('call ended')
//   })
//   socket.on('callUser',(roomId,userId,userName)=>{
//     socket.join(roomId)
//     socket.to(roomId).broadcast.emit('user-connected',userId)
//     socket.on("message", (message) => {
//       io.to(roomId).emit("createMessage", message, userName);
//     })
//   })
//   // socket.on('callUser', (data)=>{
//   //   io.to(data.userToCall).emit('callUser',{signal:data.signal,from:data.from,name:data.name})
//   // })
//   socket.on('answer call',(data)=>{
//     io.to(data.to).emit('callAccepted',data.signal)
//   })
//   //console.log('connected')
// })

//   app.use((req,res,next)=>{
//     req.io = io
//     next()

})
//app.set('socket.io',io)



//routes
app.use('/user',userRouter)
app.use('/posts',authRequest,postsRouter)
app.use('/msg',authRequest,messageRouter)
app.use('/chat',authRequest,chatRouter)
app.use('/mpesa',mpesa)



const PORT = process.env.PORT || 5000

http.listen(PORT,()=>{
    console.log(`app listening on port ${PORT}`)
})