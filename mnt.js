async function mntdir() {
    try {
      const dirHandle = await window.showDirectoryPicker();
      for await (const entry of dirHandle.values()) {
        if (entry.kind == "file") {
          if (validationEnd(entry.name, ".mp3")) {
            $("#int_").remove()
            if (num % 2) {
              $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action list-group-item-dark waves-effect" id="c'+num+'">' + entry.name + '</a>')
            } else {
              $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action list-group-item-primary waves-effect" id="c'+num+'">'  + entry.name + '</a>')
            }
            musiclist.push(entry.name)
            file_ = await entry.getFile()
            await musicfilelist.push(file_)
            var tags = {};
            jsmediatags.read(file_, {
              onSuccess: function (tag) {
                musictagslist.push(tag)
  
              },
              onError: function (error) {
              }
            });
            num++
          } else if (validationEnd(entry.name, ".lrc")) {
            $("#int_").remove()
            if (num % 2) {
              $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action list-group-item-dark waves-effect" id="c'+num+'">' + entry.name + '</a>')
            } else {
              $(".list-group").append('<a href="javascript:c(' + num + ')" class="list-group-item list-group-item-action list-group-item-primary waves-effect" id="c'+num+'">'  + entry.name + '</a>')
            }
            musiclist.push(entry.name)
            file_ = await entry.getFile()
            await musicfilelist.push(file_)
            musictagslist.push("lrc")
            num++
          }
        }
      }
  
    }
    catch (e) {
      console.error(e);
    }
  }
  