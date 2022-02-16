"use strict"
//list script
var num = 0

function validationEnd(str, appoint) {
    str = str.toLowerCase();  //不区分大小写：全部转为小写后进行判断

    var start = str.length - appoint.length;  //相差长度=字符串长度-特定字符长度
    var char = str.substr(start, appoint.length);//将相差长度作为开始下标，特定字符长度为截取长度

    if (char == appoint) { //两者相同，则代表验证通过
        return true;
    }
    return false;
}

function mntdir_() {
    for (let index = 0; index < document.getElementById("intAlt").files.length; index++) {
        const element = document.getElementById("intAlt").files[index];
        if (validationEnd(element.name, ".mp3")) {

            musicfilelist.push(element)
            musiclist.push(element.name)
            musicfilelist
            $("#int_").css("display", "none")
            if (num % 2) {
                $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action list-group-item-dark waves-effect" id="c' + num + '">' + element.name + '</a>')
            } else {
                $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action  list-group-item-primary waves-effect" id="c' + num + '">' + element.name + '</a>')
            }

            var tags = {};
            jsmediatags.read(element, {
                onSuccess: function (tag) {
                    musictagslist.push(tag)

                },
                onError: function (error) {
                }
            });

            num++
        } else if (validationEnd(element.name, ".lrc")) {
            musicfilelist.push(element)
            musiclist.push(element.name)
            musicfilelist
            $("#int_").remove()
            if (num % 2) {
                $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action list-group-item-dark waves-effect" id="c' + num + '">' + element.name + '</a>')
            } else {
                $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action  list-group-item-primary waves-effect" id="c' + num + '">' + element.name + '</a>')
            }


        }
    }
    loadsuccess()
}

