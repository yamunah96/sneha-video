
const socket = io("/")

var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: 443
});
const user = prompt("Enter you name ")

const myvideo = document.createElement("video")
myvideo.muted = true


console.log("what is video: ", myvideo)


var mystream

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
})
    .then((stream) => {
        mystream = stream
        console.log("what is mystream:  ", mystream)
        addVideoStream(myvideo, mystream)


        socket.on("user-connected", (userId) => {
            connectToNewUser(userId, mystream)
        })

        peer.on("call",(call)=>{
            call.answer(mystream)
            const newvideo = document.createElement("video")
            call.on("stream", (uservideoStream) => {
                console.log("wht usevStream: ",uservideoStream)
                addVideoStream(newvideo, uservideoStream)
            })
        })

    })

function addVideoStream(myvideo, mystream) {
    myvideo.srcObject = mystream
    console.log("wht is srcobject: ", myvideo.srcObject)
    myvideo.addEventListener("loadedmetadata", () => {
        myvideo.play()
        $("#video_stream").append(myvideo)

    })
}


function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream)
    console.log("what is call:  ", call)
    const newvideo = document.createElement("video")
    call.on("stream", (uservideoStream) => {
        console.log("wht usevStream: ",uservideoStream)
        addVideoStream(newvideo, uservideoStream)

    })
}


$(function () {
    $("#show_chat").click(function () {
        $(".left-window").css("display", "none")
        $(".right-window").css("display", "block")
        $(".header_back").css("display", "block")
    })
    $(".header_back").click(function () {
        $(".left-window").css("display", "block")
        $(".right-window").css("display", "none")
        $(".header_back").css("display", "none")
    })
    $("#send").click(function () {
        if ($("#chat_message").val().length !== 0) {
            socket.emit("message", $("#chat_message").val())
            $("#chat_message").val("")
        }
    })
    $("#chat_message").keydown(function (e) {
        if (e.key == "Enter" && $("#chat_message").val().length !== 0) {
            socket.emit("message", $("#chat_message").val())
            $("#chat_message").val("")
        }
    })
})

peer.on("open", (ROOM_ID, id) => {
    socket.emit("join-room", ROOM_ID, id, user)
    console.log("what is roomId ", ROOM_ID)
    console.log("what is id: ", id)
    console.log("what is user: ", user)
})
socket.on("createMessage", (message, userName, userId) => {
    console.log("what is user msg ", message)
    console.log("what is userId: ", userId)
    $(".messages").append(`
        <div class="mymessage">
        <b><i class="far fa-user-circle"></i> <span> ${userName === user ? "me" : userName
        }</span> </b>
        <span>${message}</span>
    </div>
`)

})