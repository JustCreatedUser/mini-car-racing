//Функції, від яких важливі механізми не залежить
"use strict";
import {
  introduction,
  firstRace,
  secondRace,
  finalRace,
  chapters,
} from "../story.js";
import { enemyCars, myCar } from "../mechanisms/cars.js";
import { music } from "./music.js";
import { turns } from "../mechanisms/turningFunctions.js";
import { keyboard } from "./keyboard.js";
function actionLevelChange() {
  alert("Ти ж розумієш, що перегони без екшену - не перегони!");
}
function pause() {
  if (!isGamePaused && permissions.toPause) {
    $(".menu").css("display", "flex");
    $(".pause img").attr("src", "");
    $(".pause").append("<p>&cross;</p>");
    isGamePaused = true;
  } else {
    $(".menu").css("display", "none");
    $(".pause img").attr("src", "./icons-and-images/pause.svg");
    $(".pause p").remove();
    isGamePaused = false;
    $("select").val("Обери пояснення");
    $(".explanation-content").text("поки нічого");
  }
}
function useGuideBlockButton() {
  if (!changes.firstRace.startRace && progress == "firstRace") {
    music.changeVolume(1);
    firstRace.startRace();
  } else if (!changes.firstRace.continueFirstTurnExplanation) {
    changes.firstRace.continueFirstTurnExplanation = true;
    firstRace.everyTip.continueTurnExplanation();
  } else if (
    changes.firstRace.startRace &&
    changes.firstRace.continueFirstTurnExplanation
  ) {
    chapters[progress].startTurning();
    music.changeVolume(1);
    changes.firstRace.firstTurnExplanation = true;
  } else if (
    (!changes.secondRace.startRace && progress == "secondRace") ||
    (!changes.finalRace.startRace && progress == "finalRace")
  ) {
    music.changeVolume(1);
    chapters[progress].startRace();
  }
}
function returnToMenu() {
  if ($(".gameplay-pause").css("display") == "none" && permissions.toPause) {
    turns.array = [];
    $(".enemy-car").remove();
    myCar.noClutchMode = false;
    $(".gameplay-pause").css({ display: "flex", opacity: 1 });
    $(this).css("visibility", "hidden");
    guideBlock.style.opacity = "0";
    $(".enemy-position").css("visibility", "hidden");
    $(".turn-position").css("display", "0");
    wrap.style.opacity = 0;
    setTimeout(() => {
      myCar.fns.useTheEngine(true);
      changes.rewriteEverything();
      document.body.style.overflowY = "scroll";
    }, 2000);
    document.body.style.overflowY = "scroll";
    turns.isRightNow = false;
    $(".background").css({
      translate: "0",
      transform: "rotateY(0) rotateX(0) rotate(0deg)",
    });
  }
}
function saveProgress() {
  if (permissions.toSaveProgress) {
    permissions.toSaveProgress = false;
    $(this).css({
      background: "white",
      color: "black",
      borderBottom: "2px solid black",
    });
    $(this).text("Прогрес збережено");
    switch (totalProgress) {
      case "firstRace":
        totalProgress = "secondRace";
        break;

      case "introduction":
        totalProgress = "firstRace";
        break;
      case "secondRace":
        totalProgress = "finalRace";
        break;
      case "finalRace":
        totalProgress = "Everything";
        break;
    }
    localStorage.setItem("mini-car-racing-progress", totalProgress);
  }
}
function fastest_speed_cheat() {
  if (permissions.toCheat) {
    if (music.song !== undefined) {
      music.song.pause();
      music.song.currentTime = 0;
    }
    if (music.cheaterSong == undefined) {
      music.cheaterSong = new Audio(
        "https://ia600605.us.archive.org/8/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3"
      );
    }
    permissions.toCheat = false;
    if ($("select").val() == "speedCheat") {
      $(".explanation-content").html(`
      fastest_speed_cheat() - пранк, який зменшує обороти до  ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">60</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)
      `);
    }
    if (music.isAllowedToPlay) {
      music.cheaterSong.play();
    }
    myCar.maxRpm = enemyCars.array[enemyCars.index].maxRpm;
    alert(
      `ТЕБЕ ЗАРІКРОЛИЛИ! В Тебе тепер ще менше оборотів - ${
        enemyCars.array[enemyCars.index].maxRpm
      }`
    );
    alert(`Цей ефект пройде аж через одну хвилину!`);
    let cheatEffectTime = 60;
    $.removeCookie("cheatEffect", { path: "/" });
    $.cookie("cheatEffect", cheatEffectTime, { expires: 0.127, path: "/" });
    localStorage.setItem("cheaterSongWasDiscovered", "true");
    music.hidden.cheaterSongWasDiscovered = true;
    let cheatEffect = setInterval(() => {
      cheatEffectTime--;
      $(".cheat-counter").text(cheatEffectTime);
      $.cookie("cheatEffect", cheatEffectTime, { expires: 0.127, path: "/" });
      if (cheatEffectTime == 10) {
        alert("Ще 10 секунд, і ефект від читів буде скинуто");
      } else if (cheatEffectTime <= 0) {
        alert(
          "Все, ефект від читів пройшов і в тебе знову 10000 оборотів. Якщо хочеш, можеш знову написати цю команду і твоя машина нарешті отримає масимальну потужність."
        );
        if ($("select").val() == "speedCheat") {
          $(".explanation-content").html(
            `Нажми на <button class="cheat-button">Мене</button>, і все станеться.`
          );
        }

        permissions.toCheat = true;
        clearInterval(cheatEffect);
        myCar.maxRpm = 10000;
        $.removeCookie("cheatEffect", { path: "/" });
      }
    }, 1000);
  }
}
function useLocalStorageAndCookies() {
  if (!navigator.cookieEnabled) {
    alert(
      "У вас відключено файли cookie. Тут вони використовуються для того, щоб запам'ятати те - хочете ви слухати музику, чи ні. Для кращих емоцій вам варто дозволити використання цих файлів"
    );
  } else if (localStorage.getItem("listenedCycle")) {
    music.listenedCycle = JSON.parse(localStorage.getItem("listenedCycle"));
    music.checkListenedSongs("localStorage");
  }
  if ($.cookie("cheatEffect") != undefined) {
    permissions.toCheat = false;
    music.cheaterSong = new Audio(
      "https://ia600605.us.archive.org/8/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3"
    );
    myCar.maxRpm = enemyCars.array[enemyCars.index].maxRpm;
    let cheatEffectTime = Math.round(Number($.cookie("cheatEffect")));
    $(".explanation-content").html(`
      fastest_speed_cheat() - пранк, який зменшує обороти до ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">${cheatEffectTime}</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)
      `);
    let cheatEffect = setInterval(() => {
      cheatEffectTime--;
      $(".explanation-content .cheat-counter").text(cheatEffectTime);
      $.cookie("cheatEffect", cheatEffectTime, { expires: 0.127, path: "/" });
      if (cheatEffectTime == 10) {
        alert("Ще 10 секунд, і ефект від читів буде скинуто");
      } else if (cheatEffectTime <= 0) {
        alert(
          "Все, ефект від читів пройшов і в тебе знову 10000 оборотів. Якщо хочеш, можеш знову написати цю команду і твоя машина нарешті отримає масимальну потужність."
        );
        $(".explanation-content").html(
          `нажми <button class="cheat-button">Мене</button>, і все станеться`
        );
        myCar.maxRpm = 10000;
        permissions.toCheat = true;
        clearInterval(cheatEffect);
        $.removeCookie("cheatEffect", { path: "/" });
      }
    }, 1000);
  }
  if (localStorage.getItem("cheaterSongWasDiscovered")) {
    music.hidden.cheaterSongWasDiscovered = true;
  }
  if (localStorage.getItem("finalSongWasDiscovered")) {
    music.hidden.finalSongWasDiscovered = true;
  }
  if (localStorage.getItem("mini-car-racing-keyboard")) {
    let savedKeyboard = JSON.parse(
      localStorage.getItem("mini-car-racing-keyboard")
    );
    for (const key in keyboard) {
      keyboard[key] = savedKeyboard[key];
      $("." + key).text(keyboard[key]);
    }
  }
  if (
    localStorage.getItem("mini-car-racing-progress") &&
    localStorage.getItem("mini-car-racing-progress") != "introduction"
  ) {
    totalProgress = localStorage.getItem("mini-car-racing-progress");
    switch (totalProgress) {
      case "Everything":
      case "finalRace":
      case "secondRace":
        $(".secondRace-begin img").remove();
        $(".secondRace-begin").css("color", "white");
        $(".completed-parts .parts").append($(".firstRace-begin"));
        break;
    }
    switch (totalProgress) {
      case "Everything":
      case "finalRace":
        $(".finalRace-begin img").remove();
        $(".finalRace-begin").css("color", "white");
        $(".completed-parts .parts").append($(".secondRace-begin"));
        $(".gameplay-headline").text(
          "Як швидко минає час... Нижче можна скинути прогрес."
        );
        break;
    }
    if (totalProgress == "Everything") {
      $(".completed-parts .parts").append($(".finalRace-begin"));
      $(".uncompleted-parts h3").text("Вже все пройдено...");
      $(".uncompleted-parts").append(
        `<button>Скинути прогрес і перезавантажитись?</button>`
      );
    } else {
      $(".gameplay-headline").text("Знову ганяєте? (гортай донизу)");
    }
    permissions.toSaveProgress = false;
    permissions.toPause = true;
    setTimeout(() => {
      $(".gameplay-pause").css("opacity", 1);
    }, 500);
    $(".gameplay-pause").css({ display: "flex" });

    document.body.style.overflowY = "scroll";
    $(".save-the-progress-button").css({
      background: "white",
      color: "black",
      borderBottom: "2px solid black",
    });
    $(".save-the-progress-button").text("Прогрес збережено");
  } else {
    introduction.beginning();
  }
}
function gameOver(reason) {
  turns.array = [];
  music.changeVolume(0.5);
  permissions.toPause = false;
  guideBlock.style.opacity = "0";
  $(".pause").css("opacity", "0");
  $(".enemy-position").css("visibility", "hidden");
  $(".turn-position").css("display", "0");
  $(".tunnel").css("right", "-75%");
  wrap.style.opacity = 0.5;
  setTimeout(() => {
    changes.movingPause = true;
    wrap.style.opacity = 0;
    guideBlock.style.opacity = 0;
    let h1 = document.createElement("h1");
    h1.className = "veryLargeText";
    h1.textContent = "GAME OVER";
    document.body.append(h1);
    setTimeout(() => {
      changes.rewriteEverything();
      h1.textContent = reason;
      setTimeout(() => {
        permissions.toPause = true;
        changes.movingPause = false;
        $(".enemy-car").remove();
        myCar.fns.useTheEngine(true);
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
  car.style.transition = "3s";
  car.style.rotate = "1080deg";
  car.style.marginTop = document.body.offsetHeight / 2 + "px";
}
function selectInfoInMenu() {
  let topic = $("select").val();
  switch (topic) {
    case "acceleration":
      $(".explanation-content").html(
        "Для Ефективного набирання швидкості треба розганяти обороти до всіх 10000RPM та переключати передачі вгору в самий останній момент"
      );
      break;
    case "turn":
      $(".explanation-content").html(
        `Ти повинен бути готовим, що справа на дорозі буде написано: Через "дистанція до поворота" m, "допустима швидкість" km/h. Як тільки це з'явилось - тормози до допустимої швидкості І НЕ РОЗГАНЯЙСЯ, доки не минеш поворот`
      );
      break;
    case "speedCheat":
      if (!permissions.toCheat) {
        $(".explanation-content").html(`
          fastest_speed_cheat() - пранк, який зменшує обороти до  ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">60</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)
          `);
      } else {
        $(".explanation-content").html(`
        Цей чит-код дасть тобі максимальну швидкість, а саме - 100000RPM. Ти просто маєш натиснути на <button class="cheat-button">МЕНЕ</button>
        `);
      }
      break;
    case "music":
      $(".explanation-content")
        .html(`1) running in the 90s - Max Coveri; 2) Deja vu - Dave Rodgers; 3) Gas Gas Gas - Manuel; 4) Styles of Beyond - Nine Thou (Superstars Remix); 5) Born too slow - The Crystal Method; 6)The only - StaticX; 7) Broken Promises - Element Eighty;
      <span class='undiscovered-music-left'>Назви решти творів ти отримаєш при проходженні гри</span>
        `);
      let number = music.listenedCycle.length + music.songsList.length,
        numberArray = Object.values(music.hidden).filter(
          (item) => item == true
        );

      if (music.hidden.finalSongWasDiscovered) {
        $(".undiscovered-music-left").before(
          ` ${number}) THE TOP by KEN BLAST; `
        );
        number++;
      }
      if (music.hidden.cheaterSongWasDiscovered) {
        $(".undiscovered-music-left").before(
          ` ${number}) Never gonna give you up - Rick Astley; `
        );
        number++;
      }
      if (numberArray.length == 2) {
        $(".undiscovered-music-left").remove();
      }
      break;
  }
}
function chooseChapter() {
  let part = $(this)[0].classList[1],
    continuing,
    raceIndex;
  switch (part) {
    case "introduction-restart":
      continuing = confirm("Перезапустити вступ?");
      raceIndex = 1;
      progress = "introduction";
      break;
    case "firstRace-begin":
      continuing = confirm("Почати першу гонку?");
      raceIndex = 2;
      progress = "firstRace";
      enemyCars.index = 0;
      break;
    case "secondRace-begin":
      if (
        totalProgress == "secondRace" ||
        totalProgress == "finalRace" ||
        totalProgress == "Everything"
      ) {
        continuing = confirm("Почати другу гонку?");
        progress = "secondRace";
        raceIndex = 3;
        enemyCars.index = 1;
      }
      break;
    case "finalRace-begin":
      if (totalProgress == "finalRace" || totalProgress == "Everything") {
        continuing = confirm("Почати ОСТАННЮ гонку?");
        raceIndex = 4;
        progress = "finalRace";
        enemyCars.index = 2;
      }
      break;
  }
  if (continuing) {
    music.changeVolume(1);
    $("#wrap").css({
      opacity: 0,
      display: "flex",
    });
    document.body.style.overflowY = "hidden";
    $(".gameplay-pause").css("opacity", "0");
    $(".pause").css("display", "none");
    permissions.toPause = false;
    setTimeout(() => {
      guideBlock.style.display = "flex";
      switch (raceIndex) {
        case 1:
          introduction.beginning();
          $(".gameplay-pause").css("display", "none");
          break;
        case 2:
          $("#wrap").css({ transform: "scale(1.5)", marginLeft: "20vw" });
          firstRace.beginning(
            firstRace.tip(
              "Як Бачиш - пора змагатись! Якщо ти забув управління - зайди в меню паузи). Зараз заведи мотор"
            ),
            "<div class='enemy-car firstRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img style='margin-top:45px; margin-left:0px;' src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/firstRace.png' alt='car' class='vehicle enemy-vehicle' /></div>"
          );
          $(".gameplay-pause").css("display", "none");
          break;
        case 3:
          $("#wrap").css({ transform: "scale(1.5)", marginLeft: "20vw" });
          secondRace.beginning(
            secondRace.tip(
              `Хоч тобі і вдалось пройти першу гонку, але тепер противник швидший, а до поворотів треба швидше тормозити. \n все як минулого разу: двигун => обороти => кнопка => відлік => передача вгору`
            ),
            "<div class='enemy-car secondRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img style='margin-top:43px; margin-left:-9px;' src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/secondRace.png' alt='car' class='vehicle enemy-vehicle' /></div>"
          );

          break;
        case 4:
          $("#wrap").css({ transform: "scale(1.5)", marginLeft: "20vw" });
          finalRace.beginning(
            secondRace.tip("Настав час... ...змагатись за першість..."),
            "<div class='enemy-car finalRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img style='margin-top:29px; margin-left:-7px;' src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/finalRace.png' alt='car' class='vehicle enemy-vehicle' /></div>"
          );
          if (music.finalSong === undefined) {
            music.finalSong = new Audio(
              "https://mini-car-racing.netlify.app/additional-music/finalSong.mp3"
            );
          }

          music.hidden.finalSongWasDiscovered = true;
          localStorage.setItem("finalSongWasDiscovered", "true");
          if (music.isAllowedToPlay) {
            if (music.cheaterSong != undefined) {
              music.cheaterSong.pause();
            } else {
              music.song.pause();
            }
            music.finalSong.play();
          }

          break;
      }
    }, 3000);
    $(".back-to-menu-button").css("visibility", "visible");
  }
}
function announceFn(text, followingFunction) {
  permissions.toPause = false;
  $(".pause").css("display", "none");
  announcement = document.createElement("div");
  announcement.className = "announcement";
  document.body.append(announcement);
  announcementText = document.createElement("h1");
  announcementText.className = "veryLargeText";
  announcementText.innerText = text;
  announcement.append(announcementText);
  followingFunction();
}
function restartTheGame() {
  localStorage.clear();
  $.removeCookie("cheatEffect", { path: "/" });
  $.removeCookie("song", { path: "/" });
  setTimeout(location.reload(), 500);
}
export {
  restartTheGame,
  chooseChapter,
  selectInfoInMenu,
  saveProgress,
  gameOver,
  useGuideBlockButton,
  useLocalStorageAndCookies,
  returnToMenu,
  fastest_speed_cheat,
  pause,
  actionLevelChange,
  announceFn,
};
