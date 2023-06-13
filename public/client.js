
const socket = io();

const form = document.getElementById('send-form');
const inputmsg = document.getElementById('txt');
const chatbox = document.querySelector('.chats');
const main = document.querySelector('.main');
const box = document.querySelector('.box');

let namee = prompt("Enter your name to join");
if( namee == null || namee.length < 3 || namee.length > 20){
    box.remove();
    const h1 = document.querySelector('.h1class');
    h1.innerHTML = "<br> Please Enter a valid Name and... <br> Enjoy Chatting 😁😘<br> ╰(*°▽°*)╯";
}
else{
    socket.emit('new-user-joined', namee);
}


const joinedAction = (message)=>{
    const msgElem = document.createElement('div');
    msgElem.innerText = message;
    msgElem.classList.add('newjoined');
    chatbox.append(msgElem);
    chatbox.scrollTop = chatbox.scrollHeight;
}

socket.on('userjoined', (data) =>{
    joinedAction(`${data.name} Joined the Chat`);
});


form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const msg = inputmsg.value;
    if(msg ===""){
        return ;
    }
    const id = Math.round(Math.random() * 100000 );
    appendLeftRight(msg, "You", 'right');
    socket.emit('send', {msg, id});
    inputmsg.value = "";
})


socket.on('receive', (data)=>{
    appendLeftRight(`${data.message}`, data.name, 'left' );
});

const appendLeftRight =(msg, spnname, pos )=>{
    const msgElem = document.createElement('div');
    const realmessage = document.createElement('div');
    const datetime = new Date();
    let min = datetime.getMinutes();
    if(min>=0 && min<10 ){
        min = `0${min} `;
    }
    const hour = datetime.getHours();
    realmessage.innerText = msg ;
    const span = document.createElement('span');
    span.innerText = `${spnname}: (${hour}:${min})`;
    span.classList.add('span');
    msgElem.append(span);
    msgElem.append(realmessage);
    msgElem.classList.add('message');
    msgElem.classList.add(pos);
    chatbox.append(msgElem);
    chatbox.scrollTop = chatbox.scrollHeight;
}

socket.on('userleft', (data)=>{
    const msgElem = document.createElement('div');
    let leftmessage = `${data.name} left the Chat`;
    msgElem.innerText = leftmessage;
    msgElem.classList.add('userleft');
    chatbox.append(msgElem);
    chatbox.scrollTop = chatbox.scrollHeight;
});


socket.on('users-list', (users)=>{
    const ol = document.querySelector('#ol');
    ol.innerText = "";
    const users_array = Object.values(users);
    for(i=0;i< users_array.length ; i++){
        const username = users_array[i];
        const li = document.createElement('li');
        li.innerText = users_array[i];
        ol.append(li);
    }
})
