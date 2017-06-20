var ws = new WebSocket('ws:/localhost:7878')
ws.addEventListener('open', function(event){
    console.log("Connected")
})
ws.addEventListener('message', function incoming(event){
    console.log(JSON.parse(event.data))
    // document.getElementById("container").innerHTML = event.data
})