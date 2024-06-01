//Музичний супровід
"use strict";
export const music = {
  songsList: [
    "https://dn720306.ca.archive.org/0/items/gas-gas-gas/Gas%20Gas%20Gas.mp3",
    "https://ia601301.us.archive.org/22/items/61-zb-4-pz-6-sf-l.-ac-uf-1000-1000-ql-80/01.%20Styles%20of%20Beyond%20-%20Nine%20Thou%20%28Superstars%20Remix%29.mp3",
    "https://ia800701.us.archive.org/34/items/InitialDDejaVu_201811/Initial%20D-Deja%20Vu.mp3",
    "https://ia800503.us.archive.org/15/items/RunningInThe90s_201608/Running_in_the_90s.mp3",
  ],
  listenedCycle: [],
  song: undefined,
  cheaterSong: undefined,
  finalSong: undefined,
  hidden: {
    cheaterSongWasDiscovered: false,
    finalSongWasDiscovered: false,
  },
  index: Math.round(Math.random() * 3),
  hasBeenListened: false,
  isPlaying: false,
  checkMusicDurationInterval: undefined,
  isAllowedToPlay: false,
  checkListenedSongs: (direction) => {
    let count = 0;
    switch (direction) {
      case "localStorage":
        music.listenedCycle.forEach((listenedSong) => {
          count = 0;
          music.songsList.forEach((notListenedSong) => {
            if (listenedSong == notListenedSong) {
              music.songsList.splice(count, 1);
            }
            count++;
          });
        });
        music.index = Math.round(Math.random() * (music.songsList.length - 1));
        break;
      case "restore default":
        music.songsList = music.listenedCycle;
        music.listenedCycle = [];
        break;
    }

    localStorage.setItem("listenedCycle", JSON.stringify(music.listenedCycle));
  },
  listenToMusic: () => {
    if (!music.isAllowedToPlay) {
      music.isAllowedToPlay = true;
      $(".music-settings").text("Бажаєте вимкнути МУЗОН?");
      if (!music.hasBeenListened) {
        music.song = new Audio(music.songsList[music.index]);
      }
      if (music.finalSong != undefined) {
        music.finalSong.play();
      } else if (music.cheaterSong != undefined) {
        music.cheaterSong.play();
      } else {
        music.song.play();
      }
      localStorage.setItem(
        "listenedCycle",
        JSON.stringify(music.listenedCycle)
      );
      music.checkMusicDurationInterval = setInterval(() => {
        if (
          music.finalSong != undefined &&
          music.finalSong.currentTime == music.finalSong.duration
        ) {
          music.finalSong = undefined;
          music.song.currentTime = 0;
          music.song.play();
        } else if (
          music.cheaterSong != undefined &&
          music.cheaterSong.currentTime == music.cheaterSong.duration
        ) {
          music.cheaterSong = undefined;
          music.song.currentTime = 0;
          music.song.play();
        } else if (music.song.currentTime == music.song.duration) {
          music.listenedCycle.push(music.songsList[music.index]);
          music.songsList.splice(music.index, 1);
          if (music.songsList.length == 0) {
            music.checkListenedSongs("restore default");
          }
          music.index = Math.round(
            Math.random() * (music.songsList.length - 1)
          );
          localStorage.setItem(
            "listenedCycle",
            JSON.stringify(music.listenedCycle)
          );
          music.song = new Audio(music.songsList[music.index]);
          music.song.play();
        }
      }, 4000);
      music.hasBeenListened = true;
    } else {
      music.isAllowedToPlay = false;
      $(".music-settings").text("Бажаєте ввімкнути МУЗОН?");
      if (music.finalSong != undefined) {
        music.finalSong.pause();
      } else if (music.cheaterSong != undefined) {
        music.cheaterSong.pause();
      } else {
        music.song.pause();
      }
    }
  },
  changeVolume: (musicVolume) => {
    if (music.finalSong != undefined) {
      music.finalSong.volume = musicVolume;
    }
    if (music.cheaterSong != undefined) {
      music.cheaterSong.volume = musicVolume;
    }
    if (music.song != undefined) {
      music.song.volume = musicVolume;
    }
  },
};