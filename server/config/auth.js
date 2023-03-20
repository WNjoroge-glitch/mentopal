const jwt = require('jsonwebtoken')
const axios = require('axios')
const { response } = require('express')


const authRequest = (req,res,next) =>{
   
    const { accessToken,refreshToken } = req.cookies
   
   
    if(!accessToken) return res.status(401).json({message:'Failed to authenticate'})
    //valid access token
    jwt.verify(accessToken,process.env.JWT_SECRET_KEY,(err,data)=>{
        if(err) return res.status(500).json({message:"Failed to authenticate"})
        
        req.user = {id:data.userId}
        next()
    })
    //expired but valid refresh token

    

}

const authUser = (req,res,next) =>{
    if(!req.user){
        res.status(500).json({message:"Invalid Request"})
    }
}
const authMpesaRequest = async(req,res,next) =>{
    let consumer_key = process.env.CONSUMER_KEY;
        let consumer_secret = process.env.CONSUMER_SECRET;

        let url = process.env.OUATH_TOKEN_URL; 

        let buffer = new Buffer.from(consumer_key +  ":" + consumer_secret);

        const auth = `Basic ${new Buffer.from(
            `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
          ).toString('base64')}`;
      
        try{

            await axios.get(url,{
                headers:{
                    authorization: auth
                },
               })
               .then((response)=>{
                token = response.data.access_token;
                req.token = token
                
               })
               .catch((error)=>{
               console.log(error)
               })
            // let {data} = await axios.get(url,{
            //     "headers":{
            //         "Authorization":auth
            //     }
            // }).then((response)=>{
            //     console.log(response)
            // })
            
           

            
       

            return next();
        }catch(err){
            // console.log({
            //     success:false,
            //     message:err['response']['statusText']
            // })
            console.log(err['response'])

            // return res.send({
            //     success:false,
            //     message:err['response']['statusText']
            // });

        }

}

module.exports = {authRequest,authMpesaRequest}