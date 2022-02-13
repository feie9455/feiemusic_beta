play = false
ca = window.parent.document.getElementById("mlist").contentWindow.document.getElementById('tutorial')
musiclist = []
musicfilelist = []
musictagslist = []
musicpiclist = []
musictpiclist = []
tpicdata = []
nowmusic = null
initok=false
var jsmediatags = window.jsmediatags;
function startstop() {
  if (play) {
    play = false
    $("#playicon").removeClass("fas fa-pause");
    $("#playicon").addClass("fas fa-play")
    $("#player")[0].pause()
  } else {initok=true
    play = true
    $("#playicon").removeClass("fas fa-play");
    $("#playicon").addClass("fas fa-pause")
    if (!$("#player")[0].src) { nowmusic=0
      $("#player")[0].src=URL.createObjectURL(musicfilelist[nowmusic]) }

    $("#player")[0].play()
    const element = musictagslist[nowmusic];
    var picture = element.tags.picture; // create reference to track art 
    var base64String = "";
    for (var i = 0; i < picture.data.length; i++) {
        base64String += String.fromCharCode(picture.data[i]);
    }
    var imageUri = "data:" + picture.format + ";base64," + window.btoa(base64String);

    var img = new Image();
    img.src = imageUri
    var canvas = document.getElementById('tutorial');
    var ctx = canvas.getContext("2d");
    setTimeout(() => {
      ctx.drawImage(img, 0, 0, 64, 64)
      imageUri = canvas.toDataURL("image/jpeg", 1)
      changeFavicon(imageUri)
    ;
    
    }, 200);

    //    imgdata = ctx.getImageData(0, 0, 64, 64)
    //    var base64String = "";
    //    for (var i = 0; i < imgdata.data.length; i++) {
    //        base64String += String.fromCharCode(imgdata.data[i]);
    //    }
    //    var imageUri = "data:" + imgdata.format + ";base64," + window.btoa(base64String);

    setTimeout(() => {
      document.getElementById("len").max = Math.floor(document.getElementById("player").duration)
      document.getElementById("len").value = Math.floor(document.getElementById("player").currentTime)

    }, 200);
  }
}

function _padZero({ num, length = 2, position = "left" }) {
  let len = num.toString().length;
  if (position === "left") {
    while (len < length) {
      num = "0" + num;
      len++;
    }
  } else if (position === "right") {
    while (len < length) {
      num = num + "0";
      len++;
    }
  }
  return num;
}
function forward() {
  document.getElementById("player").currentTime = document.getElementById("player").currentTime + 10
  refrush()
}
function backward() {
  if (document.getElementById("player").currentTime >= 10) {
    document.getElementById("player").currentTime = document.getElementById("player").currentTime - 10
  } else {
    document.getElementById("player").currentTime = 0
  }
  refrush()
}
function gforward() {
  if (musicfilelist.length - 1 >= nowmusic + 1) {
    url = URL.createObjectURL(musicfilelist[nowmusic + 1])
    nowmusic = nowmusic + 1
  } else {
    url = URL.createObjectURL(musicfilelist[0])
    nowmusic = 0
  }

  document.getElementById("player").src = url
  play = false
  startstop()
  refrush()

}
function gbackward() {
  if (nowmusic >= 1) {
    url = URL.createObjectURL(musicfilelist[nowmusic - 1])
    nowmusic = nowmusic - 1
  } else {
    url = URL.createObjectURL(musicfilelist[musicfilelist.length - 1])
    nowmusic = musicfilelist.length - 1
  }
  document.getElementById("player").src = url
  play = false
  startstop()
  refrush()
}


function refrush() {
  if(initok){
  document.getElementById("len").value = Math.floor(document.getElementById("player").currentTime)
  document.getElementById("nowtime").innerHTML = String(Math.floor(document.getElementById("player").currentTime / 60)) + ":" + String(_padZero({ num: Math.floor(document.getElementById("player").currentTime) % 60 }))
  document.title = musictagslist[nowmusic].tags.title+"-"+musictagslist[nowmusic].tags.artist
  document.getElementById("title").innerHTML = musictagslist[nowmusic].tags.title
  document.getElementById("artist").innerHTML = musictagslist[nowmusic].tags.artist
  if (document.getElementById("player").currentTime == document.getElementById("player").duration) {
    next()
  }
}}
function next() {
  gforward()
}
//document.querySelector("#drag").ondrag = function () {
//  console.log('拖拽中');
//  $("#main").css("top", event.pageY - 24)
//  $("#main").css("left", event.pageX - 360)
//}
//
//document.querySelector("#drag").ondragend = function () {
//  $("#main").css("top", event.pageY - 24)
//  $("#main").css("left", event.pageX - 360)
//}
//
function bgp() {
  $("#file").trigger("click");
}
function getFilePath() {
  $("body").css("background-image", URL.createObjectURL(document.getElementById("file").files[0]))
  document.body.background = URL.createObjectURL(document.getElementById("file").files[0])
}
window.onload = function () {
  setInterval(() => {
    refrush()
  }, 1000);

  var drag = document.getElementById('drag');
  drag.onmousedown = function (event) {
    var event = event || window.event;
    var diffX = event.clientX - drag.offsetLeft;
    var diffY = event.clientY - drag.offsetTop;
    if (typeof drag.setCapture !== 'undefined') {
      drag.setCapture();
    }
    document.onmousemove = function (event) {
      var event = event || window.event;
      $("#main").css("top", event.pageY )
      $("#main").css("left", event.pageX - 384)
    }
    document.onmouseup = function (event) {
      this.onmousemove = null;
      this.onmouseup = null;
      if (typeof drag.releaseCapture != 'undefined') {
        drag.releaseCapture();
      }
    }
  }
}
const changeFavicon = link => {
  let $favicon = document.querySelector('link[rel="icon"]');
  // If a <link rel="icon"> element already exists,
  // change its href to the given link.
  if ($favicon !== null) {
    $favicon.href = link;
    // Otherwise, create a new element and append it to <head>.
  } else {
    $favicon = document.createElement("link");
    $favicon.rel = "icon";
    $favicon.href = link;
    document.head.appendChild($favicon);
  }
};