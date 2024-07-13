//Функції, від яких важливі механізми не залежить
//@ts-check
"use strict";
import {
  introduction,
  firstRace,
  secondRace,
  finalRace,
  chapters,
} from "../story.js";
import { gearFunctions } from "../mechanisms/gearFunctions.js";
import { rpmFunctions } from "../mechanisms/rpmFunctions.js";
import { enemyCars, myCar } from "../mechanisms/cars.js";
import { music } from "./music.js";
import { turns } from "../mechanisms/turningFunctions.js";
import { keyboard } from "./keyboard.js";
import { variables, permissions, changes, TotalProgress } from "./variables.js";

export const secondaryFunctions = {
  actionLevelChange() {
    alert(
      variables.language != "english"
        ? "Ти ж розумієш, що перегони без екшену - не перегони!"
        : "This is a joke! A race without action is not a race!"
    );
  },
  pause() {
    if (!variables.isGamePaused && permissions.toPause) {
      variables.currentWindows += "-menu";
      $(".menu").css("display", "flex");
      $(".pause img").css("visibility", "hidden");
      $(".pause").append("<p>&cross;</p>");
      variables.isGamePaused = true;
      document.body.style.overflowY = "hidden";
    } else {
      if (variables.currentWindows.includes("gmpause")) {
        document.body.style.overflowY = "scroll";
      }
      let arr = variables.currentWindows.split("-");
      arr.pop();
      variables.currentWindows = arr.join("-");
      $(".menu").css("display", "none");
      $(".pause img").css("visibility", "visible");
      $(".pause p").remove();
      variables.isGamePaused = false;
      $("#choose-info").val(
        variables.language != "english" ? "Обери щось" : "Choose smth"
      );
      $(".explanation-content").text(
        variables.language != "english" ? "поки нічого" : "nothing so far"
      );
    }
  },
  useGuideBlockButton() {
    if (!changes.firstRace.startRace && variables.progress == "firstRace") {
      music.changeVolume(1);
      firstRace.startRace();
    } else if (!changes.firstRace.continueFirstTurnExplanation) {
      changes.firstRace.continueFirstTurnExplanation = true;
      firstRace.everyTip.continueTurnExplanation();
    } else if (
      changes.firstRace.startRace &&
      changes.firstRace.continueFirstTurnExplanation
    ) {
      (chapters as any)[variables.progress].startTurning();
      music.changeVolume(1);
      changes.firstRace.firstTurnExplanation = true;
    } else if (
      (!changes.secondRace.startRace && variables.progress == "secondRace") ||
      (!changes.finalRace.startRace && variables.progress == "finalRace")
    ) {
      music.changeVolume(1);
      (chapters as any)[variables.progress].startRace();
    }
  },
  returnToMenu() {
    if ($(".gameplay-pause").css("display") == "none" && permissions.toPause) {
      if (variables.device != "computer") {
        $(".playing-btn").css({ boxShadow: "unset", zIndex: 0 });
      }
      turns.array = [];
      $(".enemy-car").remove();
      myCar.noClutchMode = false;
      $(".gameplay-pause").css({ display: "flex", opacity: 1 });
      $(this).css("visibility", "hidden");
      variables.guideBlock.style.opacity = "0";
      $(".enemy-position").css("visibility", "hidden");
      $(".turn-position").css("display", "0");
      variables.race.style.opacity = "0";
      setTimeout(() => {
        if (changes.rewriteEverything) {
          changes.rewriteEverything();
        }

        document.body.style.overflowY = "scroll";
      }, 2000);
      document.body.style.overflowY = "scroll";
      turns.isRightNow = false;
      $(".background").css({
        translate: "0",
        transform: "rotateY(0) rotateX(0) rotate(0deg)",
      });
    }
  },
  saveProgress() {
    if (permissions.toSaveProgress) {
      permissions.toSaveProgress = false;
      $(this).css({
        background: "white",
        color: "black",
        borderBottom: "2px solid black",
      });
      $(this).text(
        variables.language != "english"
          ? "Прогрес збережено"
          : "Progress is saved"
      );
      switch (variables.totalProgress) {
        case "firstRace":
          variables.totalProgress = "secondRace";
          break;
        case "introduction":
          variables.totalProgress = "firstRace";
          break;
        case "secondRace":
          variables.totalProgress = "finalRace";
          break;
        case "finalRace":
          variables.totalProgress = "Everything";
          break;
      }
      localStorage.setItem("mini-car-racing-progress", variables.totalProgress);
    }
  },
  fastest_speed_cheat() {
    if (permissions.toCheat) {
      if (music.song !== undefined) {
        music.song.pause();
        music.song.currentTime = 0;
      }
      if (music.cheaterSong == undefined)
        music.cheaterSong = new Audio(
          "https://ia600605.us.archive.org/8/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3"
        );

      permissions.toCheat = false;
      if ($("#choose-info").val() == "speedCheat")
        $(".explanation-content").html(
          variables.language != "english"
            ? `
    Це пранк, який зменшує обороти до ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">60</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)`
            : `
    This is a prank, which decrements your car's stats to ${myCar.maxRpm}. It will affect your game for <span class="cheat-counter">60</span> seconds     ......(You should play fair!!!)`
        );

      if (music.isAllowedToPlay) music.cheaterSong.play();
      myCar.maxRpm = enemyCars.array[enemyCars.index].maxRpm as number;
      alert(
        variables.language != "english"
          ? `ТЕБЕ ЗАРІКРОЛИЛИ! В Тебе тепер ще менше оборотів - ${
              enemyCars.array[enemyCars.index].maxRpm
            }`
          : `YOU GOT RICKROLLED! Your car's max RPM was decremented by ${
              10000 - enemyCars.array[enemyCars.index].maxRpm
            }RPM`
      );
      alert(
        variables.language != "english"
          ? `Цей ефект пройде аж через одну хвилину!`
          : "This will last for a MINUTE"
      );
      let cheatEffectTime = 60;
      sessionStorage["cheatEffect"] = cheatEffectTime;
      localStorage.setItem("cheaterSongWasDiscovered", "true");
      music.hidden.cheaterSongWasDiscovered = true;
      let cheatEffect = setInterval(() => {
        cheatEffectTime--;
        $(".cheat-counter").text(cheatEffectTime);
        sessionStorage["cheatEffect"] = cheatEffectTime;
        if (cheatEffectTime == 10)
          alert("Ще 10 секунд, і ефект від читів буде скинуто");
        else if (cheatEffectTime <= 0) {
          alert(
            variables.language != "english"
              ? "Все, ефект від читів пройшов і в тебе знову 10000 оборотів. Якщо хочеш, можеш знову натиснути кнопку і твоя машина нарешті отримає максимальну потужність."
              : "Alright, now you got your 10000 rpm limit back. This time i won`t lie: tap button again and enjoy SUPER-POWER!"
          );
          if ($("#choose-info").val() == "speedCheat")
            $(".explanation-content").html(
              variables.language != "english"
                ? `нажми <button class="cheat-button">Мене</button>, і все станеться`
                : 'tap <button class="cheat-button">ME</button>, and get SUPER-POWER'
            );

          permissions.toCheat = true;
          clearInterval(cheatEffect);
          myCar.maxRpm = 10000;
        }
      }, 1000);
    }
  },
  gameOver(reason: string) {
    if (variables.progress == "firstRace") {
      changes.firstRace.firstTurnExplanation = false;
      changes.firstRace.continueFirstTurnExplanation = false;
    }
    $(".back-to-menu-button").css("visibility", "hidden");
    turns.array = [];
    music.changeVolume(0.5);
    permissions.toPause = false;
    variables.guideBlock.style.opacity = "0";
    $(".pause").css("opacity", "0");
    $(".enemy-position").css("visibility", "hidden");
    $(".turn-position").css("display", "0");
    $(".tunnel").css("left", "100%");
    variables.race.style.opacity = "0.5";
    setTimeout(() => {
      changes.movingPause = true;
      variables.race.style.opacity = "0";
      variables.guideBlock.style.opacity = "0";
      let h1 = document.createElement("h1");
      h1.className = "veryLargeText";
      h1.textContent = "GAME OVER";
      document.body.append(h1);
      setTimeout(() => {
        changes.rewriteEverything ? changes.rewriteEverything() : "";
        h1.textContent = reason;
        setTimeout(() => {
          permissions.toPause = true;
          changes.movingPause = false;
          $(".enemy-car").remove();
          turns.isRightNow = false;
          $(".background").css({
            translate: "0",
            transform: "rotateY(0) rotateX(0) rotate(0deg)",
          });
          h1.remove();
          $(".pause").css("opacity", 1);
          $(".gameplay-pause").css({ display: "flex", opacity: 1 });
          document.body.style.overflowY = "scroll";
        }, 3000);
      }, 2000);
    }, 3000);
    variables.car.style.transition = "3s";
    variables.car.style.rotate = "1080deg";
    variables.car.style.marginTop = document.body.offsetHeight / 2 + "px";
  },
  selectInfoInMenu() {
    let topic = $("#choose-info").val();
    switch (topic) {
      case "acceleration":
        $(".explanation-content").html(
          variables.language != "english"
            ? "Для Ефективного набирання швидкості треба розганяти обороти до всіх 10000RPM та переключати передачі вгору в самий останній момент"
            : "To accelerate efficiently you need to rev up 10000RPM and change gear at the last moment."
        );
        break;
      case "turn":
        $(".explanation-content").html(
          variables.language != "english"
            ? `Ти повинен бути готовим, що справа на дорозі буде написано: Через "дистанція до поворота" m, "допустима швидкість" km/h. Як тільки це з'явилось - тормози до допустимої швидкості І НЕ РОЗГАНЯЙСЯ, доки не минеш поворот`
            : `Before a bend on the right-hand side of the road, the following appears: "After "distance to bend" m, "maximum speed" km/h".`
        );
        break;
      case "speedCheat":
        if (!permissions.toCheat) {
          $(".explanation-content").html(
            variables.language != "english"
              ? `
      Це пранк, який зменшує обороти до ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">60</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)`
              : `
      This is a prank, which decrements your car's stats to ${myCar.maxRpm}. It will affect your game for <span class="cheat-counter">60</span> seconds     ......(You should play fair!!!)`
          );
        } else {
          $(".explanation-content").html(
            variables.language != "english"
              ? `Цей чит дасть тобі максимальну швидкість, а саме - 100000RPM. Ти просто маєш натиснути на <button class="cheat-button">МЕНЕ</button>`
              : 'This cheat can give you SUPER POWER - 100000RPM!!! Just press <button class="cheat-button">ME</button>'
          );
        }
        break;
      case "music":
        $(".explanation-content")
          .html(`1) running in the 90s - Max Coveri; 2) Deja vu - Dave Rodgers; 3) Gas Gas Gas - Manuel; 4) Styles of Beyond - Nine Thou (Superstars Remix); 5) Born too slow - The Crystal Method; 6)The only - StaticX; 7) Broken Promises - Element Eighty; 8) Out of Control - Rancid; 
      <span class='undiscovered-music-left'>${
        variables.language != "english"
          ? "Назви решти творів ти отримаєш при проходженні гри"
          : "The names of the other songs will be revealed as you play."
      }</span>
        `);
        let number = music.listenedCycle.length + music.songsList.length,
          numberArray = Object.values(music.hidden).filter(
            (item) => item == true
          );
        if (music.hidden.cheaterSongWasDiscovered) {
          number++;
          $(".undiscovered-music-left").before(
            ` ${number}) Never gonna give you up - Rick Astley; `
          );
        }
        if (music.hidden.finalSongWasDiscovered) {
          number++;
          $(".undiscovered-music-left").before(
            ` ${number}) THE TOP by KEN BLAST; `
          );
        }
        if (numberArray.length == 2) {
          $(".undiscovered-music-left").text(
            variables.language != "english"
              ? "Ти знайшов всі пісні!"
              : "You've found all songs!"
          );
        }
        break;
      case "device":
        $(".explanation-content").html(
          variables.language != "english"
            ? "Якщо хочеш змінити управління на інший девайс або мову, то нажми на <button class='change-device'>МЕНЕ</button>"
            : 'To change the interface or language, tap <button class="change-device">ME</button>'
        );
        break;
    }
  },
  chooseChapter() {
    let part: string = $(this)[0].classList[1],
      continuing: boolean,
      raceIndex: number;
    switch (part) {
      case "introduction-restart":
        continuing = confirm(
          variables.language != "english"
            ? "Перезапустити вступ?"
            : "Restart the INTRO?"
        );
        raceIndex = 1;
        variables.progress = "introduction";
        break;
      case "firstRace-begin":
        continuing = confirm(
          variables.language != "english"
            ? "Почати першу гонку?"
            : "Start the First race?"
        );
        raceIndex = 2;
        variables.progress = "firstRace";
        enemyCars.index = 0;
        break;
      case "secondRace-begin":
        if (
          variables.totalProgress == "secondRace" ||
          variables.totalProgress == "finalRace" ||
          variables.totalProgress == "Everything"
        ) {
          continuing = confirm(
            variables.language != "english"
              ? "Почати Другу гонку?"
              : "Start the Second race?"
          );
          variables.progress = "secondRace";
          raceIndex = 3;
          enemyCars.index = 1;
        }
        break;
      case "finalRace-begin":
        if (
          variables.totalProgress == "finalRace" ||
          variables.totalProgress == "Everything"
        ) {
          continuing = confirm(
            variables.language != "english"
              ? "Почати ОСТАННЮ гонку?"
              : "Start THE LAST race?"
          );
          raceIndex = 4;
          variables.progress = "finalRace";
          enemyCars.index = 2;
        }
        break;
    }
    if (continuing) {
      document.body.scrollTop = 0;
      music.changeVolume(1);
      $("#race").css({
        opacity: 0,
        display: "flex",
      });
      document.body.style.overflowY = "hidden";
      $(".gameplay-pause").css("opacity", "0");
      $(".pause").css("display", "none");
      permissions.toPause = false;
      setTimeout(() => {
        variables.guideBlock.style.display = "flex";
        switch (raceIndex) {
          case 1:
            introduction.beginning();
            $(".gameplay-pause").css("display", "none");
            break;
          case 2:
            $("#race").css({ transform: "scale(1.5)", marginLeft: "20vw" });
            firstRace.beginning(
              firstRace.tip,
              "<div class='enemy-car firstRace'><img src='./icons-and-images/wheel.webp' alt='' class='wheel one enemy-wheel'><img src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.webp' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/firstRace.webp' alt='car' class='vehicle enemy-vehicle' /></div>",
              variables.language == "ukrainian"
                ? `Як Бачиш - пора змагатись! ${
                    variables.device == "computer"
                      ? "Якщо ти забув управління - зайди в меню паузи). Зараз заведи мотор"
                      : ""
                  } `
                : `As you can see, it's time to compete! ${
                    variables.device == "computer"
                      ? "Tips about handling are in menu (just pause the game)"
                      : ""
                  }`
            );
            $(".gameplay-pause").css("display", "none");
            break;
          case 3:
            $("#race").css({ transform: "scale(1.5)", marginLeft: "20vw" });
            secondRace.beginning(
              secondRace.tip,
              "<div class='enemy-car secondRace'><img src='./icons-and-images/wheel.webp' alt='' class='wheel one enemy-wheel'><img src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.webp' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/secondRace.webp' alt='car' class='vehicle enemy-vehicle' /></div>",
              variables.language != "english"
                ? `Хоч тобі і вдалось пройти першу гонку, але тепер противник швидший, а до поворотів треба швидше тормозити. \n все як минулого разу: двигун => обороти => кнопка => відлік => передача вгору`
                : `Despite your first victory, don't relax! Your rival is faster and the corners are sharper!!! However the start is the same: engine => RPM => guide button => count => gear up`
            );

            break;
          case 4:
            $("#race").css({ transform: "scale(1.5)", marginLeft: "20vw" });
            finalRace.beginning(
              secondRace.tip,
              "<div class='enemy-car finalRace'><img src='./icons-and-images/wheel.webp' alt='' class='wheel one enemy-wheel'><img  src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.webp' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/finalRace.webp' alt='car' class='vehicle enemy-vehicle' /></div>",
              variables.language != "english"
                ? "Настав час... ...змагатись за першість..."
                : "Time to fight... ...to be first..."
            );
            if (music.finalSong === undefined)
              music.finalSong = new Audio(
                "https://mini-car-racing.netlify.app/additional-music/finalSong.mp3"
              );

            music.hidden.finalSongWasDiscovered = true;
            localStorage.setItem("finalSongWasDiscovered", "true");
            if (music.isAllowedToPlay) {
              if (music.cheaterSong) music.cheaterSong.pause();
              else if (music.song) music.song.pause();
              music.finalSong.play();
            }
            break;
        }
      }, 3000);
      $(".back-to-menu-button").css("visibility", "visible");
    }
  },
  announceFn(text: string, followingFunction: () => void) {
    permissions.toPause = false;
    $(".pause").css("display", "none");
    variables.race.append(variables.$announcement);
    variables.$announcementText.innerText = text;
    variables.$announcement.append(variables.$announcementText);
    followingFunction();
  },
  restartTheGame() {
    localStorage.clear();
    localStorage.setItem("device", variables.device as string);
    setTimeout(location.reload, 500);
  },
};
$(".save-the-progress-button").on("click", secondaryFunctions.saveProgress);
$("#choose-info").on("input", secondaryFunctions.selectInfoInMenu);
$(".part").on("click", secondaryFunctions.chooseChapter);
$(".pause").on("click", secondaryFunctions.pause);
$(".back-to-menu-button").on("click", secondaryFunctions.returnToMenu);

$(".continue-game-button").on("click", secondaryFunctions.useGuideBlockButton);
$(".action-settings").on("click", secondaryFunctions.actionLevelChange);
$(".explanation-content").on(
  "click",
  ".cheat-button",
  secondaryFunctions.fastest_speed_cheat
);
$(".uncompleted-parts").on(
  "click",
  "button",
  secondaryFunctions.restartTheGame
);
