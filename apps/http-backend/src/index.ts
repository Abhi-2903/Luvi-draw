import express from "express";
import jwt from "jsonwebtoken"
import { middleware } from "./middleware";
//@ts-ignore
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';
const app = express();
CreateUserSchema

app.use(express.json());

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
app.post("/signup", async(req, res)=>{
    //zod validation
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
    console.log(parsedData.error);

return res.json({
    msg:"invalid data"
})   
 }
try{
 await prismaClient.user.create({
    data: { 
        email: parsedData.data.username,
        name: parsedData.data.name,
        password: parsedData.data.password,
    }
 })
}
catch(e){
    return res.json({
        msg:"user already exists"
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

app.listen(3001,()=>{
    console.log("server started on port 3001")
})