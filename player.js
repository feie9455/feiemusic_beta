//main script for feiemusic
//Refactoring by feie9454 2022/2/18

"use strict"
var numOfLoadedSongs = 0
var musicObjList = []
var nowmusic = 0
var play = false
var nowplaynum = 0
var playedlist = []
var playmode = 1

class Fmusic {
    constructor(name, handle, type) {
        this.name = name
        this.handle = handle
        this.type = type
    }
}


window.onload = () => {
    if (localStorage.getItem("bgpic")) {
        document.body.background = localStorage.getItem("bgpic")
    }
    setInterval(() => {
        refrush()
    }, 1000);
}

function refrush() {
    if (document.getElementById("player").src) {
        if (document.getElementById("player").currentTime == document.getElementById("player").duration) {
            gforward()
        }
        if (document.getElementById("player").duration) {
            document.getElementById("nowtime").innerHTML = String(Math.floor(document.getElementById("player").currentTime / 60)) + ":" + String(_padZero(Math.floor(document.getElementById("player").currentTime) % 60)) + " / " + String(Math.floor(document.getElementById("player").duration / 60)) + ":" + String(_padZero(Math.floor(document.getElementById("player").duration) % 60))
        }
        document.getElementById("len").ariaValueMax = Math.floor(document.getElementById("player").duration)
        document.getElementById("len").ariaValueNow = Math.floor(document.getElementById("player").currentTime)
        $("#len").css("width", String(Math.floor(document.getElementById("player").currentTime) / Math.floor(document.getElementById("player").duration) * 100 + "%"));
    }
}

function startstop() {
    if (play) {
        play = false
        $("#playicon").removeClass("fa-pause").addClass("fa-play")
        $("#player")[0].pause()
    } else {
        c(nowmusic)
    }
}

function forward() {
    document.getElementById("player").currentTime = document.getElementById("player").currentTime + 15
    refrush()
}

function backward() {
    if (document.getElementById("player").currentTime >= 10) {
        document.getElementById("player").currentTime = document.getElementById("player").currentTime - 15
    } else {
        document.getElementById("player").currentTime = 0
    }
    refrush()
}

function gforward() {
    if (playmode) {
        if (musicObjList.length - 1 >= nowmusic + 1) {
            nowmusic = nowmusic + 1
        } else {
            if (playmode == 2) {
                nowmusic = 0
            }
        }
    } else {
        nowmusic = Math.ceil(Math.random() * musicObjList.length) - 1
    }
    c(nowmusic)
    nowplaynum++
}

function gbackward() {
    if (playmode) {
        if (nowmusic >= 1) {
            nowmusic = nowmusic - 1
        } else {
            nowmusic = musicObjList.length - 1
        }
    } else {
        if (nowplaynum - 1 >= 0) {
            nowmusic = playedlist[nowplaynum - 1]
            nowplaynum--
        } else {
            nowmusic = playedlist[0]
        }
    }
    c(nowmusic)
}


//刷新歌曲列表
function refreshSongList() {
    for (let index = 0; index < musicObjList.length; index++) {
        if (index % 2) {
            $("#c" + index).removeClass("list-group-item list-group-item-action list-group-item-warning waves-effect").addClass("list-group-item list-group-item-action list-group-item-dark waves-effect")
        } else {
            $("#c" + index).removeClass("list-group-item list-group-item-action list-group-item-warning waves-effect").addClass("list-group-item list-group-item-action list-group-item-primary waves-effect")
        }
    }
    if (nowmusic % 2) {
        $("#c" + nowmusic).removeClass("list-group-item list-group-item-action list-group-item-dark").addClass("list-group-item list-group-item-action list-group-item-warning")
    }
    else {
        $("#c" + nowmusic).removeClass("list-group-item list-group-item-action list-group-item-primary").addClass("list-group-item list-group-item-action list-group-item-warning")
    }
}

//选择歌曲
async function c(music) {
    play = true
    nowmusic = music
    refreshSongList()
    document.getElementById("player").src = URL.createObjectURL(await getFile(music))
    $("#playicon").removeClass("fa-play").addClass("fa-pause")
    $("#player")[0].play()
    playedlist[nowplaynum] = nowmusic
    let tag = await readTags(nowmusic)
    document.getElementById("title").innerHTML = tag.tags.title
    document.getElementById("artist").innerHTML = tag.tags.artist
    document.querySelector("#c" + nowmusic).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    changeFavicon(music)
}


async function readTags(music) {
    let file = await getFile(music)
    return new Promise(function (resolve, reject) {
        jsmediatags.read(file, {
            onSuccess: function (tag) {
                resolve(tag)
            },
        });
    })

}

async function getFile(music) {
    return await musicObjList[music].handle.getFile()
}

//获取歌曲文件
function getMusicObj() {
    $("#loading").css("display", "inline-block")
    return new Promise(function (resolve, reject) {
        if (!window.showDirectoryPicker) {
            musicObjList = musicObjList.concat(mntdir_())
            resolve(musicObjList)
        } else {
            mntdir().then(list => {
                musicObjList = musicObjList.concat(list)
                resolve(musicObjList)
            })
        }
    })
        .then(
            list => {
                $(".list-group").remove()
                $("#mlist").append('<div class="list-group">')
                list.forEach(element => {
                    if (numOfLoadedSongs % 2) {
                        $(".list-group").append('<a href="javascript:c(' + numOfLoadedSongs + ')" class="list-group-item list-group-item-action list-group-item-dark waves-effect" id="c' + numOfLoadedSongs + '">' + element.name + '</a>')
                    } else {
                        $(".list-group").append('<a href="javascript:c(' + numOfLoadedSongs + ')" class="list-group-item list-group-item-action list-group-item-primary waves-effect" id="c' + numOfLoadedSongs + '">' + element.name + '</a>')
                    }
                    numOfLoadedSongs++
                });
                $("#int_").remove()
                $("#loading").css("display", "none")
            }
        )
        .catch(
            err => {
                $("#loading").css("display", "none")
                reject(err)
            }
        )
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

function bgp() {
    $("#file").trigger("click");
}

function getFilePath() {
    $("body").css("background-image", URL.createObjectURL(document.getElementById("file").files[0]))
    document.body.background = URL.createObjectURL(document.getElementById("file").files[0])
    $('#savepicConfirm').css('display', 'inline')
}

function savepictrue() {
    let bgpic = document.getElementById("file").files[0]
    let reader = new FileReader();
    reader.readAsDataURL(bgpic);
    reader.onload = function (ev) {
        let dataURL = ev.target.result;
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


//Some method

function _padZero(num) {
    let len = num.toString().length;
    while (len < 2) {
        num = "0" + num;
        len++;
    }
    return num;
}

async function changeFavicon(music) {
    const tags = await readTags(music);
    let picture = tags.tags.picture;
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
        let $favicon = document.querySelector('link[rel="icon"]');
        if ($favicon !== null) {
            $favicon.href = imageUri;
        } else {
            $favicon = document.createElement("link");
            $favicon.rel = "icon";
            $favicon.href = imageUri;
            document.head.appendChild($favicon);
        }
    }, 200);
}

function validationEnd(str, appoint) {
    str = str.toLowerCase();
    var start = str.length - appoint.length;
    var char = str.substr(start, appoint.length);
    if (char == appoint) {
        return true;
    }
    return false;
}
