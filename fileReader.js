//This module is used to access local music files 
//from input alternative to FileAccess API and return a array including objects
//By feie9454 2022/2/17


"use strict"
function mntdir_(inputObj) {
    for (let index = 0; index < inputObj.length; index++) {
        const element = inputObj[index];
        if (validationEnd(element.name, ".mp3") || validationEnd(element.name, ".aac") || validationEnd(element.name, ".ogg") || validationEnd(element.name, ".flac")) {
            let music = new Object()
            music.name = element.name
            music.file = element
            music.type = "music"
            jsmediatags.read(music.file, {
                onSuccess: function (tag) {
                    music.tag = tag
                },
            });
            musicfilelist.push(music)
        } else if (validationEnd(element.name, ".lrc")) {
            let music = new Object()
            music.name = element.name
            music.file = element
            music.type = "lrc"
            musicfilelist.push(music)
        }
    }
    return musicfilelist
}