const socket = io();

let user;
const chatBox = document.getElementById('chatBox');

Swal.fire({
    title: "Identificate",
    input: "text",
    text:"Ingresa tu nombre de usuario",
    inputValidator:(value)=>{
        return !value && "Ingrese un nombre de usuario para continuar";
    },
    allowOutsideClick: false,
}), then ((result)=>{
    user = result.value;
});

chatBox.addEventListener("keyup", (event)=>{
    if(event.key === "Enter"){
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value = "";
        }
    }
});

socket.on("message", (data)=>{
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.foreach((message)=>{
        messages = messages + `${message.user} dice: ${message.message} <br>`;
    });
    log.innerHTML = messages;
})