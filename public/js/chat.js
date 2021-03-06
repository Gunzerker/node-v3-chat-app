const socket=io()

//elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $messageFromLocation=document.querySelector('#location')
const $messages=document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate= document.querySelector('#location-template').innerHTML
const sidebarTemplate=  document.querySelector('#sidebartemplate').innerHTML

//options
const {username,room,psw}=Qs.parse(location.search,{ ignoreQueryPrefix:true})



const autoscroll =()=>{
    // New message element
    const $newMessage=$messages.lastElementChild

    // Height of the new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // Length of scroll
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop=$messages.scrollHeight
    }

}

try{

socket.on('update',(arr)=>{
    
})

socket.on('NoLogin',(message)=>{
    if(window.confirm(message)){
        window.location.replace("login.html");
    }
})

socket.on('message',(message)=>{
   
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('LocationMessage',(message)=>{
    
    const html=Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData', ({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message=e.target.elements.message.value

    socket.emit('SendMessage',message,(message)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
       
    })
})

$messageFromLocation.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Your borwser does not support geolocation')
    }
$messageFromLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{latitude:position.coords.latitude,longtitude:position.coords.longitude},(acknoledge)=>{
            $messageFromLocation.removeAttribute('disabled')
            
        })
        
    })
})


socket.emit('join',room,psw)

socket.on('problem',(prob)=>{
        alert(prob)
        location.href='/'
})

/*socket.emit('join',username,room,(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})
*/
}
catch(e){
    console.log(e)
}
