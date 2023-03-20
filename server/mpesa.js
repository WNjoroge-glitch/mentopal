const express = require('express')
const router = express.Router()
const {authMpesaRequest,authRequest} = require('./config/auth')
const axios = require('axios')
const datetime = require('node-datetime')
const pool = require('./config/db')

router.post('/',authMpesaRequest,async(req,res)=>{
    const token = req.token
    const {BusinessShortCode,TransactionType,CallBackURL,AccountReference,TransactionDesc,PartyA,PhoneNumber}  = req.body
   

    const timeStamp = () => {
        const dt = datetime.create();
        const formattedDate = dt.format('YmdHMS')
    
        return formattedDate
    }
    const newPassword = () => {


        const passString = BusinessShortCode + process.env.PASSKEY + timeStamp()
        const base64EncodedPassword = Buffer.from(passString).toString('base64')
      
    
        return base64EncodedPassword
    }
    try {
        const {data} = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',{
            BusinessShortCode:174379,
            Password:newPassword(),
           Timestamp:timeStamp(),
            TransactionType:TransactionType,
            Amount:1,
            PartyA:PartyA,
            PartyB:174379,
            PhoneNumber:PhoneNumber,
            CallBackURL:CallBackURL,
            AccountReference:AccountReference,
            TransactionDesc:TransactionDesc
        },{
            "headers":{
                "Authorization":`Bearer ${token}`
            }
        })
        res.send(data)
    } catch (error) {
        console.log(error)
    }


})

router.post('/callback',authRequest,async(req,res)=>{
//    const info = req.body
    const monthEndDate= new Date(new Date().setDate(new Date().getDate() + 30))
   


    //console.log(req.body.Body[0])
    // if(!info.Body.stkCallback.CallbackMetadata){
    //     console.log(info.body)
    //     res.json('')
    // }
    // const amount = info.Body.stkCallback.CallbackMetadata.Item[0].Value
    // const date = info.Body.stkCallback.CallbackMetadata.Item[3].Value
    // const phonenumber = info.Body.stkCallback.CallbackMetadata.Item[4].Value
    // const data = await pool.query('INSERT INTO mpesaTransactions(amount,phonenumber) VALUES($1,$2)',[amount,phonenumber])
    // if(callbackData.Amount === '1'){
        // try {
        //     const basicPlan = await pool.query('INSERT INTO subscriptions (subscriptionstart,subscriptionend,subscriptionplan,userid) VALUES ($1,$2,$3,$4)',[new Date(),monthEndDate,'basic',req.user.id])
        //     res.send(basicPlan)
        // } catch (error) {
        //     console.log(error)
        // }
        
    // } else {
    //     try {
    //         const proPlan = await pool.query('INSERT INTO subscriptions (subscriptionstart,subscriptionend,subscripionplan,userid) VALUES ($1,$2,$3,$4)',[new Date(),monthEndDate,'pro',req.user.id])
    //         console.log(proPlan)
    //     } catch (error) {
    //         console.log(error)
    //     }
        
    // }
    //console.log(info.Body.stkCallback.CallbackMetadata) 
    


})

router.get('/subscription',authRequest,async(req,res)=>{
    const subscription = await pool.query('SELECT * FROM subscriptions WHERE userid = $1',[req.user.id])
    res.send(subscription.rows[0])
})


module.exports = router