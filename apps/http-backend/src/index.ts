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

app.post("/signin", async (req, res)=>{
//hash password ko match krna hai
    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success){
         res.json({
            msg:"invalid Credentials"
        })
        return;
    }

        const user = await prismaClient.user.findFirst({
            where:{
                email: parsedData.data.username,
                password: parsedData.data.password 
            }
        })
        if(!user)
        {
             res.status(403).json({
                msg:"no such user exists, Please Sign UP"
            })
            return;
        }
    const token=jwt.sign({
         userId : user.id 
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
const existingUser = await prismaClient.user.findFirst({
    where: {
        email: parsedData.data.username 
    }
});

if (existingUser) {
    return res.status(409).json({
        msg: "User already exists"
    });
}
try{
 const user = await prismaClient.user.create({
    data: { 
        email: parsedData.data.username,
        name: parsedData.data.name,
        //password ki hashing krni hai
        password: parsedData.data.password,
    }
 })
 res.json({
     userId:user.id
 })
}
catch(e){
    return res.json({
        msg:"user already exists"
    })
}

})

app.post("/room", middleware, async (req, res)=>{
    //db call
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        console.log(parsedData.error);
         res.json({
            msg:"invalid Credentials"
        })
        return;
    }
        //@ts-ignore
            const userId= req.userId;
            if(!userId){
                 res.status(403).json({
                msg: "Please SignIn or SignUp first" 
                })
            }
try{
            const room = await prismaClient.room.create(
                {data:{
                    slug: parsedData.data.slug,
                    adminId: userId
            }}) 
            res.json({
                roomId: room.id
            })
        }
        catch(e){
            return res.status(500).json({
                msg:"room exist with this name"
            })
        }
    
})

app.get("/chat/:roomId", async (req,res)=>
{
    const roomId = Number(req.params.roomId);
    const chats= await prismaClient.chat.findMany({
        where:{
            roomId: roomId
        },
        orderBy:{
            id: 'desc'
        },
        take: 50
    })
    res.json(chats
    )
})

app.listen(3001,()=>{
    console.log("server started on port 3001")
})