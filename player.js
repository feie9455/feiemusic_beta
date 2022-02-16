"use strict"
var play = false
var ca = document.getElementById('tutorial')
var musiclist = [], musicfilelist = [], musictagslist = [], musicpiclist = [], musictpiclist = [], tpicdata = [], playedlist = []
var nowmusic = null
var initok = false
var jsmediatags = window.jsmediatags;
var playmode = 1
var nowplaynum = 0
var url
function startstop() {
  if (play) {
    play = false
    $("#playicon").removeClass("fas fa-pause");
    $("#playicon").addClass("fas fa-play")
    $("#player")[0].pause()
  } else {
    initok = true
    play = true
    $("#playicon").removeClass("fas fa-play");
    $("#playicon").addClass("fas fa-pause")
    if (!$("#player")[0].src) {
      nowmusic = 0
      $("#player")[0].src = URL.createObjectURL(musicfilelist[nowmusic])
      playedlist.push(nowmusic)
    }
    $("#player")[0].play()
    document.querySelector("#c" + nowmusic).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    for (let index = 0; index < musicfilelist.length; index++) {
      if (index % 2) {
        $("#c" + index).removeClass("list-group-item list-group-item-action list-group-item-warning waves-effect")
        $("#c" + index).addClass("list-group-item list-group-item-action list-group-item-dark waves-effect")
      } else {
        $("#c" + index).removeClass("list-group-item list-group-item-action list-group-item-warning waves-effect")
        $("#c" + index).addClass("list-group-item list-group-item-action list-group-item-primary waves-effect")
      }
    }
    if (nowmusic % 2) {
      $("#c" + nowmusic).removeClass("list-group-item list-group-item-action list-group-item-dark waves-effect")
      $("#c" + nowmusic).addClass("list-group-item list-group-item-action list-group-item-warning waves-effect")
    }
    else {
      $("#c" + nowmusic).removeClass("list-group-item list-group-item-action list-group-item-primary waves-effect")
      $("#c" + nowmusic).addClass("list-group-item list-group-item-action list-group-item-warning waves-effect")
    }
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
    setTimeout(function () {
      ctx.drawImage(img, 0, 0, 64, 64)
      imageUri = canvas.toDataURL("image/jpeg", 1)
      changeFavicon(imageUri)
    }, 200);
  }
}

function _padZero(num) {
  let len = num.toString().length;

  while (len < 2) {
    num = "0" + num;
    len++;
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
  if (playmode) {
    if (musicfilelist.length - 1 >= nowmusic + 1) {
      url = URL.createObjectURL(musicfilelist[nowmusic + 1])
      nowmusic = nowmusic + 1
    } else {
      if (playmode == 2) {
        url = URL.createObjectURL(musicfilelist[0])
        nowmusic = 0
      }
    }
  } else {
    nowmusic = Math.ceil(Math.random() * musiclist.length) - 1
    url = URL.createObjectURL(musicfilelist[nowmusic])
  }
  document.getElementById("player").src = url
  play = false
  startstop()
  refrush()
  playedlist.push(nowmusic)
  nowplaynum++
  nowplaynum = playedlist.length - 1
}

function gbackward() {
  if (playmode) {
    if (nowmusic >= 1) {
      url = URL.createObjectURL(musicfilelist[nowmusic - 1])
      nowmusic = nowmusic - 1
    } else {
      url = URL.createObjectURL(musicfilelist[musicfilelist.length - 1])
      nowmusic = musicfilelist.length - 1
    }
  } else {
    if (nowplaynum - 1 >= 0) {
      nowmusic = playedlist[nowplaynum - 1]
      url = URL.createObjectURL(musicfilelist[nowmusic])
      nowplaynum--
    } else {
      nowmusic = playedlist[0]
      url = URL.createObjectURL(musicfilelist[nowmusic])
    }
  }
  document.getElementById("player").src = url
  play = false
  startstop()
  refrush()
}

function refrush() {
  if (initok) {
    document.getElementById("len").ariaValueNow = Math.floor(document.getElementById("player").currentTime)
    if (document.getElementById("player").currentTime == document.getElementById("player").duration) {
      next()
    }

    if (document.getElementById("player").duration) {
      document.getElementById("nowtime").innerHTML = String(Math.floor(document.getElementById("player").currentTime / 60)) + ":" + String(_padZero(Math.floor(document.getElementById("player").currentTime) % 60)) + " / " + String(Math.floor(document.getElementById("player").duration / 60)) + ":" + String(_padZero(Math.floor(document.getElementById("player").duration) % 60))
    } document.title = musictagslist[nowmusic].tags.title + "-" + musictagslist[nowmusic].tags.artist
    document.getElementById("title").innerHTML = musictagslist[nowmusic].tags.title
    document.getElementById("artist").innerHTML = musictagslist[nowmusic].tags.artist
    document.getElementById("len").ariaValueMax = Math.floor(document.getElementById("player").duration)
    document.getElementById("len").ariaValueNow = Math.floor(document.getElementById("player").currentTime)
    $("#len").css("width", String(Math.floor(document.getElementById("player").currentTime) / Math.floor(document.getElementById("player").duration) * 100 + "%"));
  }
}

function next() {
  gforward()
}

function bgp() {
  $("#file").trigger("click");
}

function getFilePath() {
  $("body").css("background-image", URL.createObjectURL(document.getElementById("file").files[0]))
  document.body.background = URL.createObjectURL(document.getElementById("file").files[0])
  $('#savepicConfirm').css('display', 'inline')
}
window.onload = function () {
  if (!window.showDirectoryPicker) {
    $("#intG").css("display", "none")
    $("#intAlt").css("display", "block")
    document.getElementById("intAlt").addEventListener("change", function () { mntdir_() })
    $("#int_").append("<p style='color:red'>Your browser does not support FileSystem Access API. Some functions may be limited.</p>")
  }
  if (localStorage.getItem("bgpic")) {
    document.body.background = localStorage.getItem("bgpic")

  }
  setInterval(function () {
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
      $("#main").css("top", event.pageY - 36)
      $("#main").css("left", event.pageX - 400)
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

function c(music) {
  nowmusic = music
  url = URL.createObjectURL(musicfilelist[music])
  document.getElementById("player").src = url
  play = false
  startstop()
  refrush()
}

function loadsuccess() {

}

function savepictrue() {
  bgpic = document.getElementById("file").files[0]
  var reader = new FileReader();
  reader.readAsDataURL(bgpic);
  reader.onload = function (ev) {
    var dataURL = ev.target.result;
    if (localStorage.getItem("bgpic")) {
      localStorage.removeItem("bgpic");
    }
    try {
      localStorage.setItem("bgpic", dataURL);
    } catch (error) {
      alert("Picture is too large. I cannot handle it. (っ °Д °;)っ")
    }
  }
}

function changeplaymode() {
  switch (playmode) {
    case 2:
      playmode = 0
      $("#playmode").removeClass("fas fa-redo");
      $("#playmode").addClass("fas fa-random");
      break;
    case 0:
      playmode = 1
      $("#playmode").removeClass("fas fa-random");
      $("#playmode").addClass("fas fa-exchange-alt");
      break;
    case 1:
      playmode = 2
      $("#playmode").removeClass("fas fa-exchange-alt");
      $("#playmode").addClass("fas fa-redo");
      break;
  }
}
$('.popover-dismiss').popover({
  trigger: 'focus'
})
function changeFavicon(link) {
  let $favicon = document.querySelector('link[rel="icon"]');
  if ($favicon !== null) {
    $favicon.href = link;
  } else {
    $favicon = document.createElement("link");
    $favicon.rel = "icon";
    $favicon.href = link;
    document.head.appendChild($favicon);
  }
};

