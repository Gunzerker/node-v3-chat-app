const socket=io ()
socket.on('update',(tab)=>{
    console.log(tab)
    var pr='';
    for(var i=0 ;i<tab.length;i++){
        pr=pr+tab[i].room+'('+tab[i].usersInRoom+')  '
        document.getElementById('ss').innerHTML=pr
    }
    
})



