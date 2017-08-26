// ==UserScript==
// @name         Diep.io Announcement System
// @namespace    https://discord.gg/BwqMNRn
// @version      0.1
// @description  A system to allow announcements to be made in diep.io.
// @author       Lucario
// @match        http://diep.io
// @match        http://diep.io/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js
// ==/UserScript==

HTMLElement.prototype.focus=()=>{};

const url = "https://diep-announcements.herokuapp.com/";

var socket = url ? io.connect(url) : null;

var group = null;

var socketConnectInterval = null;
var announcementFadeoutTimeout = null;

function socketConnect(){
    if (socket == null){
        socket = url ? io.connect(url) : null;
    }
    if (socket != null){
        clearInterval(socketConnectInterval);
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

if (url){
    socketConnectInterval = setInterval(socketConnect, 2500);
}

var announcementDisplay =`<span id="announcementDisplay" style="position:absolute;top:25vh;display:none;text-align:center;font-size:5vh;color:#FF6600;width:100vw;height:0px;overflow:visible;pointer-events:none;"></span>`;

document.querySelector('body').insertAdjacentHTML('afterend', announcementDisplay);

socket && socket.on("connect", () => {
    socket.on("message", (data) => {
        if (group !== null && data.target == group){
            clearTimeout(announcementFadeoutTimeout);
            document.getElementById("announcementDisplay").innerHTML = htmlEntities(data.message);
            document.getElementById("announcementDisplay").style.display = "block";
            announcementFadeoutTimeout = setTimeout(() => {document.getElementById("announcementDisplay").style.display = "none";}, 5000);
        }
    });
    socket.once("disconnect", () => {
        socket.off("message");
        socket = null;
        socketConnectInterval = setInterval(socketConnect, 2500);
    });
});

document.addEventListener('keydown', function(event){
    if (event.keyCode == 36){
        var a = document.getElementById("announcementBox");
        if (a){
            a.style.display == "none" ? a.style.display = "block" : a.style.display = "none";
        }
    }
});
