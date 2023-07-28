const socket = io();
const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const messageForm = document.getElementById('message-form');
const nameInput = document.getElementById('name-input');
const messageTone= new Audio('/message-tone mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
})
socket.on('clients-total', (data) => {
    clientsTotal.innerText =`Total clients:${data}`
})

//for function of sendMessage()
function sendMessage() {
    if(messageInput.value === '') return
   // console.log(messageInput.value);
    const data = {
        name: nameInput.value,
        message:messageInput.value,
        dateTime:new Date(),
    }
    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ""
}
socket.on('chat-message', (data)=>{
  addMessageToUI(false,data)
    messageTone.play()
})
function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const element =`
    <li class="${isOwnMessage ?"message-right":"message-left"}">
    <p class="message">
        ${data.message}
        <span>${data.name}🔹${moment(data.dateTime).fromNow()}</span>
    </p>
</li>`
    messageContainer.innerHTML += element
    scrollToBottom();
}
function scrollToBottom() {
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}
messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback:`🖋 ${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback:`🖋${nameInput.value} is typing a message`
    })
})
messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback:''
    })
})
socket.on('feedback', (data) => {
    clearFeedback()
    const element=` <li class="message-feedback">
    <p class ="feedback" id="feedback">${data.feedback}</p>
</li>`
messageContainer.innerHTML+= element
})
function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}