const io = require('socket.io-client');
let socket = io('http://localhost:4000', {
    query: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDU4NjJiZWZmMGI5ZDJhZWNlY2QwYzkiLCJuYW1lIjoiQWJkdWwgUmVobWFuIiwiZW1haWwiOiJtZWhhcnMuNjkyNUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Im1laGFyIiwicGFzc3dvcmQiOiIkMmIkMTAkN0FsYnBnV1VKRGIvSTFBU1F4a081LlVVaG5KRk1xWmw1eXl4Rk1Xa1hTUzRQeTBubHNYaGkiLCJjcmVhdGVkQXQiOiIyMDE5LTA4LTE3VDIwOjI1OjM0LjQxN1oiLCJ1cGRhdGVkQXQiOiIyMDE5LTA4LTE3VDIwOjI1OjM0LjQxN1oiLCJfX3YiOjAsImlhdCI6MTU2NjA3NTYxN30.ZHUiTg53BJjATZ7kuypRH1YBC2E4lxD1MAUv4HbG4zA'
    },
    transports: ['websocket'], upgrade: false
})
socket.on('connection', () => {
    console.log('connected to socket.io server')
})
socket.on('message', (mes) => console.log(mes))