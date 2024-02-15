const httpServer = require('http').createServer() 
const io = require("socket.io")(httpServer, {
    cors: {
    // The origin is the same as the Vue app domain. Change if necessary
        methods: ["GET", "POST"], 
        credentials: true
    } 
})

httpServer.listen(8080, () =>{ console.log('listening on *:8080')})

let playersWaiting = []

io.on('connection', (socket) => {
    console.log(`client ${socket.id} has connected`)
    socket.on('available' , (data) => {
        if(playersWaiting.length > 0) {
            const opponent = playersWaiting.pop()
            socket.data.opponent = opponent
            io.to(opponent).emit('startGame', {opponent: data.name, id: socket.id, firstPlayer: true})
            socket.emit('startGame', {opponent: data.name, id: opponent, firstPlayer: true})
        } else {
            playersWaiting.push(socket.id)
        }
    });

    socket.on('play', (data) => {
        io.to(socket.data.opponent).emit('play', {cell: data.cell, position: data.position})
    })
})