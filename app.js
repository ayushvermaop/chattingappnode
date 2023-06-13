const { urlencoded } = require("express");
const express = require("express");
const path = require('path');
const http = require('http');
const app = express();

const server = http.createServer(app);

const PORT = process.env.PORT || 9898 ;

app.use(express.json());
app.use(urlencoded({extended:false}));
app.use(express.static(path.join(__dirname , "public")));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.get('/about', (req, res)=>{
    res.send("Hello About File ");
});

server.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
})

        /*        Socket  Server Setup        */ 
 const io = require("socket.io")(server);
 const users ={};
 io.on('connection', socket =>{

     socket.on('new-user-joined', name=>{
         users[socket.id] = name;
         socket.broadcast.emit('userjoined', {name:users[socket.id]});
         io.emit('users-list', users);
        //  console.log("New user is ", users[socket.id] , "with id-> " , socket.id );
     });
 
     socket.on('send', data=>{
         socket.broadcast.emit('receive', {message: data.msg, name:users[socket.id], id: data.id});
     });
 
     socket.on('disconnect', () =>{
        socket.broadcast.emit('userleft', {name:users[socket.id]});
        delete users[socket.id];
        io.emit('users-list', users);
     });

 })


