//Музичний супровід!
"use strict";

import { variables } from "./variables.js";

type CheckSongsUsage = "localStorage" | "restore default";
interface Imusic {
  songsList: Array<string>;
  listenedCycle: Array<string>;
  song: undefined | HTMLAudioElement;
  cheaterSong: undefined | HTMLAudioElement;
  finalSong: undefined | HTMLAudioElement;
  hidden: {
    cheaterSongWasDiscovered: boolean;
    finalSongWasDiscovered: boolean;
  };
  songS?: Array<undefined | HTMLAudioElement>;
  index: number;
  hasBeenListened: boolean;
  isPlaying: boolean;
  checkMusicDurationInterval: undefined | number;
  isAllowedToPlay: boolean;
  checkListenedSongs: (direction: CheckSongsUsage) => void;
  listenToMusic: () => void;
  changeVolume: (musicVolume: number) => void;
}
const music: Imusic = {
  songsList: [
    "https://ia801400.us.archive.org/27/items/need-for-speed-underground-soundtrack-2003-gamerip/07.%20Element%20Eighty%20-%20Broken%20Promises%20%28NFS%20Underground%20Edition%29.mp3",
    "https://dn720306.ca.archive.org/0/items/gas-gas-gas/Gas%20Gas%20Gas.mp3",
    "https://ia601301.us.archive.org/22/items/61-zb-4-pz-6-sf-l.-ac-uf-1000-1000-ql-80/01.%20Styles%20of%20Beyond%20-%20Nine%20Thou%20%28Superstars%20Remix%29.mp3",
    "https://ia800701.us.archive.org/34/items/InitialDDejaVu_201811/Initial%20D-Deja%20Vu.mp3",
    "https://ia601400.us.archive.org/27/items/need-for-speed-underground-soundtrack-2003-gamerip/02.%20The%20Crystal%20Method%20-%20Born%20Too%20Slow%20%28NFS%20Underground%20Edition%29.mp3",
    "https://ia800503.us.archive.org/15/items/RunningInThe90s_201608/Running_in_the_90s.mp3",
    "https://ia801400.us.archive.org/27/items/need-for-speed-underground-soundtrack-2003-gamerip/06.%20Static-X%20-%20The%20Only%20%28NFS%20Underground%20Edition%29.mp3",
    "https://ia801400.us.archive.org/27/items/need-for-speed-underground-soundtrack-2003-gamerip/03.%20Rancid%20-%20Out%20of%20Control%20%28NFS%20Underground%20Edition%29.mp3",
  ],
  listenedCycle: [],
  song: undefined,
  cheaterSong: undefined,
  finalSong: undefined,
  hidden: {
    cheaterSongWasDiscovered: false,
    finalSongWasDiscovered: false,
  },
  index: 0,
  hasBeenListened: false,
  isPlaying: false,
  checkMusicDurationInterval: undefined,
  isAllowedToPlay: false,
  checkListenedSongs(direction) {
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
  listenToMusic() {
    if (!music.isAllowedToPlay) {
      music.isAllowedToPlay = true;
      $(".music-settings").text(
        variables.language != "english"
          ? "Бажаєте вимкнути МУЗОН?"
          : "Turn off music?"
      );
      if (!music.hasBeenListened) {
        music.hasBeenListened = true;
        music.song = new Audio(music.songsList[music.index]);
      }
      if (music.finalSong != undefined) {
        music.finalSong.play();
      } else if (music.cheaterSong != undefined) {
        music.cheaterSong.play();
      } else if (music.song != undefined) {
        music.song.play();
      }
      localStorage.setItem(
        "listenedCycle",
        JSON.stringify(music.listenedCycle)
      );
      music.checkMusicDurationInterval = setInterval(() => {
        music.songS = [
          music.song,
          music.cheaterSong,
          music.finalSong,
        ].reverse();

        music.songS?.forEach((sonG) => {
          if (sonG != undefined && sonG.currentTime == sonG.duration) {
            switch (sonG) {
              case music.finalSong:
              case music.cheaterSong:
                sonG == music.finalSong
                  ? (music.finalSong = undefined)
                  : (music.cheaterSong = undefined);

                if (music.song) {
                  music.song.currentTime = 0;
                  music.song.play();
                }
                break;

              case music.song:
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
                break;
            }
          }
        });
      }, 4000);
    } else {
      music.isAllowedToPlay = false;
      $(".music-settings").text(
        variables.language != "english"
          ? "Бажаєте ввімкнути МУЗОН?"
          : "Switch on music?"
      );

      music.songS = [music.song, music.cheaterSong, music.finalSong].reverse();
      music.songS?.forEach((sonG) => {
        if (sonG != undefined) {
          sonG.pause();
        }
      });
    }
  },
  changeVolume(musicVolume) {
    music.songS?.forEach((sonG) => {
      if (sonG != undefined) {
        sonG.volume = musicVolume;
      }
    });
  },
};
music.index = Math.round(Math.random() * music.songsList.length - 1);
music.songS = [music.song, music.cheaterSong, music.finalSong].reverse();
export { music };
