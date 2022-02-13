num = 0
window.onload = function () {
    if (!window.showDirectoryPicker) {
        $("#intG").css("display", "none")
        $("#intAlt").css("display", "block")
        document.getElementById("intAlt").addEventListener("change", function () { mntdir_() })
    }
}

//str：字符串    appoint：指定字符
function  validationEnd (str, appoint) {
    str=str.toLowerCase();  //不区分大小写：全部转为小写后进行判断
         
    var start = str.length-appoint.length;  //相差长度=字符串长度-特定字符长度
    var char= str.substr(start,appoint.length);//将相差长度作为开始下标，特定字符长度为截取长度
     
    if(char== appoint){ //两者相同，则代表验证通过
       return true;
    }
    return false;
 }

async function mntdir() {
    try {
        const dirHandle = await window.showDirectoryPicker();
        for await (const entry of dirHandle.values()) {
            if (entry.kind == "file") {
                if (validationEnd(entry.name, ".mp3") || validationEnd(entry.name, ".lrc")) {
                    $("#int_").remove()
                    if (num % 2) {
                        $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action list-group-item-dark waves-effect">' + entry.name + '</a>')
                    } else {
                        $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action list-group-item-primary waves-effect">' + entry.name + '</a>')
                    }
                    window.parent.musiclist.push(entry.name)
                    file_ = await entry.getFile()
                    await window.parent.musicfilelist.push(file_)
                    var tags = {};
                    jsmediatags.read(file_, {
                        onSuccess: function (tag) {
                            window.parent.musictagslist.push(tag)

                        },
                        onError: function (error) {
                        }
                    });

                    //window.parent.document.getElementById("mlist").contentWindow.musicfilelist
                    num++
                }
            }
        }

    }
    catch (e) {
        console.error(e);
    }
}
function mntdir_() {
    window.parent.musicfilelist = document.getElementById("intAlt").files
    for (let index = 0; index < window.parent.musicfilelist.length; index++) {
        const element = window.parent.musicfilelist[index];
        window.parent.musiclist.push(element.name)
        $("#int_").remove()
        if (num % 2) {
            $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action list-group-item-dark">' + element.name + '</a>')
        } else {
            $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action  list-group-item-primary">' + element.name + '</a>')
        }
        num++

    }
}
function c(music) {
    window.parent.nowmusic = music
    url = URL.createObjectURL(window.parent.musicfilelist[music])
    window.parent.document.getElementById("player").src = url
    window.parent.play = false
    window.parent.startstop()
    window.parent.refrush()
}

