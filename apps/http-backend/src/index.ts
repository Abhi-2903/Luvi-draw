import express from "express";
import jwt from "jsonwebtoken"
import { middleware } from "./middleware";
//@ts-ignore
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from '@repo/common/types';
const app = express();
CreateUserSchema



app.post("/signin", (req, res)=>{

    const data = SignInSchema.safeParse(req.body);
    if(!data.success){
         res.json({
            msg:"invalid Credentials"
        })
        return;
    }

    const userId=1;
    const token=jwt.sign({
         userId
     }, JWT_SECRET);
     res.json({
        token
     })
})
app.post("/signup", (req, res)=>{
    //zod validation
    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success){

return res.json({
    msg:"invalid data"
})   
 }

res.json({
    userId:"123"
})
})

app.post("/room", middleware,(req, res)=>{
    //db call
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success){
         res.json({
            msg:"invalid Credentials"
        })
        return;
    }
    
    res.json({
        roomId:123
    })
})

app.listen(3001)