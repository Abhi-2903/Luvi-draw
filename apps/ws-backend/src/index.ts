import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from '@repo/db/client';

const wss = new WebSocketServer({port:8080});


interface User{
    userId: string;
    ws: WebSocket;
    rooms: string[];
}

const users:User[]=[];
function checkUser(token:string):string | null{
    try{

        const decoded = jwt.verify(token, JWT_SECRET);  
        if(typeof decoded =="string"){
            return null;
        } 
    
        if(!decoded || !decoded.userId){
            return null;
        }
    
        return decoded.userId;
    }
    catch(err){
        console.log(err);
        return null;
    }
}


wss.on('listening', () => {
    console.log('WebSocket server is listening on port 8080');
});

wss.on('connection', function connection(ws, request){
 console.log("websocket connected");
    //extract token from url

    const url = request.url;
            if(!url){
                ws.close();
                return;
            }
            const queryParams = new URLSearchParams(url.split('?')[1]);
            const token = queryParams.get('token') || "";
            // ab token verify kr raha

            const userId= checkUser(token);
            if(!userId){
                ws.close();
                return;
            
            }

            users.push({
                userId,
                rooms:[],
                ws
            })


    ws.on('message', async function message(data: string){
        const parsedData= JSON.parse(data as unknown as string);
        
        if(parsedData.type == "join_room"){
            const user= users.find(x=>x.ws ===ws)
                if (typeof parsedData.roomId === 'number' && Number.isInteger(parsedData.roomId)) {
                    user?.rooms.push(parsedData.roomId.toString());
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'roomId must be an integer' }));
                }
                console.log(`user subscribed ${parsedData.roomId}`)
            }

            if(parsedData.type == "leave_room"){
                const user = users.find(x=>x.ws === ws)
                user!.rooms = user!.rooms.filter(x=>x !== parsedData.roomId);
            }

        if (parsedData.type==="chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            await prismaClient.chat.create({
                data:{
                    roomId,
                    message,
                    userId
                }
            })
            users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message: message,
                        roomId
                    }))
                }
            })
 
        }
    
    });
});