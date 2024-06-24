//Функції, від яких важливі механізми не залежить
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
let devicePopupPositions: [Array<number>, number] = [
  [0, window.innerWidth, window.innerWidth * 2],
  0,
];
export const secondaryFunctions = {
  actionLevelChange() {
    alert("Ти ж розумієш, що перегони без екшену - не перегони!");
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
      $("#choose-info").val("Обери пояснення");
      $(".explanation-content").text("поки нічого");
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
      $(this).text("Прогрес збережено");
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
      if (music.cheaterSong == undefined) {
        music.cheaterSong = new Audio(
          "https://ia600605.us.archive.org/8/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3"
        );
      }
      permissions.toCheat = false;
      if ($("#choose-info").val() == "speedCheat") {
        $(".explanation-content").html(`
      Це пранк, який зменшує обороти до  ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">60</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)
      `);
      }
      if (music.isAllowedToPlay) {
        music.cheaterSong.play();
      }
      myCar.maxRpm = enemyCars.array[enemyCars.index].maxRpm as number;
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
          if ($("#choose-info").val() == "speedCheat") {
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
  },
  setStylesForPhone() {
    $("head").append(`
    <link rel="stylesheet" href="./styles/for-phones/styles.css" />
    `);
    $(".keyboard").html(`
      <button>Зайти в повний екран?</button>
      `);
    $(".keyboard")[0].className = "changeScreen";
    $(".changeScreen button").click(function () {
      function fullScreen(element: any) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitrequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.mozRequestFullscreen) {
          element.mozRequestFullScreen();
        }
        $(".changeScreen button").text("Вийти з повного екрану?");
      }
      if (document.fullscreenEnabled) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          $(".changeScreen button").text("Зайти в повний екран?");
        } else {
          fullScreen(document.documentElement);
        }
      } else {
        alert("Браузер не підтримує цю функцію");
      }
    });
    $("nav").after($(".handling-settings"));
    $(".computer-counters").attr("class", "phone-counters");
    $(".phone-counters").prepend(`<div class="counters"></div>`);
    $(".counters").append($(".rpm"));
    $(".counters").append($(".speed"));
    $(".phone-counters").prepend('<div class="gears-block"></div>');
    $(".gears-block").append($(".gear-counter"));
    let arrow = '<img src="./useless-images/arrow.png"';
    $(".gears-block").prepend(
      arrow + "id='gearUpButton' class='playing-btn'/>"
    );
    $(".gears-block").append(
      arrow + 'style="rotate:180deg" id="gearDownButton" class="playing-btn"/>'
    );

    $(".counters").after(
      '<button id="useTheEngine" class=" playing-btn">ДВИГУН</button>'
    );

    function setImg(param: string, pos: string) {
      return `<div id="${param}ccelerationPedal" class="playing-btn pedal" style="grid-column:${pos};"><div style="z-index:1;"></div><img draggable="false" src="./icons-and-images/pedals/${param}cceleration.png"></div>`;
    }
    $(".phone-counters").append(setImg("a", "5/6"));
    $(".phone-counters").prepend(setImg("de", "1/2"));
    let functions: Array<string>;
    if (variables.device == "phone") {
      functions = ["touchstart", "touchend"];
    } else {
      functions = ["mousedown", "mouseup"];
    }
    $("#gearUpButton").on(functions[0], () => {
      if (variables.isEngineWorking) {
        gearFunctions.up.mechanism();
      }
    });
    $("#gearDownButton").on(functions[0], () => {
      if (variables.isEngineWorking && myCar.gear != 0) {
        gearFunctions.down.mechanism();
      }
    });
    $("#deccelerationPedal").on(functions[0], () => {
      if (
        variables.isEngineWorking &&
        !myCar.decceleration &&
        !myCar.acceleration
      ) {
        $("#deccelerationPedal")[0].style.transform = "rotateX(1deg)";
        if (
          myCar.moveDirection != "decceleration" &&
          variables.isEngineWorking &&
          permissions.forLessRpm
        ) {
          myCar.moveDirection = `decceleration`;
        }
        myCar.decceleration = true;
      }
    });
    $("#deccelerationPedal").on(functions[1], () => {
      if (myCar.decceleration) {
        $("#deccelerationPedal")[0].style.transform = "rotateX(0deg)";
        myCar.decceleration = false;
        if (myCar.moveDirection !== 0) {
          myCar.moveDirection = 0;
          $(".car .vehicle").css("transform", "rotate(0)");
        }
      }
    });
    $("#accelerationPedal").on(functions[0], () => {
      if (!myCar.acceleration && !myCar.decceleration) {
        myCar.acceleration = true;
        $("#accelerationPedal")[0].style.transform = "rotateX(1deg)";
        if (
          myCar.moveDirection != "acceleration" &&
          !variables.isGamePaused &&
          variables.isEngineWorking &&
          permissions.forMoreRpm
        ) {
          myCar.moveDirection = `acceleration`;
        }
      }
    });
    $("#accelerationPedal").on(functions[1], () => {
      if (variables.action > 1 && myCar.acceleration) {
        $("#accelerationPedal")[0].style.transform = "rotateX(0deg)";
        myCar.acceleration = false;
        rpmFunctions.inertiaMechanism();
        myCar.exhaust();
        if (myCar.moveDirection !== 0) {
          myCar.moveDirection = 0;
          $(".car .vehicle").css("transform", "rotate(0)");
        }
      }
    });

    $("#useTheEngine")[0].addEventListener(
      functions[0],
      () => {
        myCar.fns.useTheEngine();
      },
      false
    );

    let buttons = document.querySelectorAll(".playing-btn");
    buttons.forEach((btn) => {
      btn.addEventListener(
        `contextmenu`,
        (e) => {
          e.preventDefault();
        },
        false
      );
    });
  },
  changeDevice() {
    secondaryFunctions.createDeviceChangingPopup(false, true, true);
  },
  useLocalStorageAndCookies() {
    let startPermission = false;
    function checkLocalStorageForIssues() {
      let wrongArray = Object.entries(localStorage).filter(
        (save) => save[1] == "undefined" || save[1] == "null"
      );
      wrongArray.forEach((wrongSave) => {
        localStorage.removeItem(wrongSave[0]);
      });
      localStorage.removeItem("touchEvents");
    }
    function checkDevice() {
      if (!localStorage.getItem("device")) {
        secondaryFunctions.createDeviceChangingPopup(startPermission);
      } else if (localStorage.getItem("device")) {
        variables.currentWindows = "race";
        variables.device = localStorage.getItem("device") as string;
        startPermission = true;
      }
      if (variables.device != "computer" && variables.device != undefined) {
        secondaryFunctions.setStylesForPhone();
      }
    }
    function checkMusic() {
      if (!navigator.cookieEnabled) {
        alert(
          "У вас відключено файли cookie. Тут вони використовуються для того, щоб запам'ятати те - хочете ви слухати музику, чи ні. Для кращих емоцій вам варто дозволити використання цих файлів"
        );
      } else if (localStorage.getItem("listenedCycle")) {
        music.listenedCycle = JSON.parse(
          localStorage.getItem("listenedCycle") as string
        );
        music.checkListenedSongs("localStorage");
      }
      if ($.cookie("cheatEffect") != undefined) {
        permissions.toCheat = false;
        music.cheaterSong = new Audio(
          "https://ia600605.us.archive.org/8/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3"
        );
        myCar.maxRpm = enemyCars.array[enemyCars.index].maxRpm as number;
        let cheatEffectTime = Math.round(Number($.cookie("cheatEffect")));
        $(".explanation-content").html(`
      Це пранк, який зменшує обороти до ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">${cheatEffectTime}</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)
      `);
        let cheatEffect = setInterval(() => {
          cheatEffectTime--;
          $(".explanation-content .cheat-counter").text(cheatEffectTime);
          $.cookie("cheatEffect", cheatEffectTime, {
            expires: 0.127,
            path: "/",
          });
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
    }
    function checkKeyboard() {
      if (
        localStorage.getItem("mini-car-racing-keyboard") &&
        variables.device == "computer"
      ) {
        let savedKeyboard = JSON.parse(
          localStorage.getItem("mini-car-racing-keyboard") as string
        );
        let key: keyof typeof keyboard;
        for (key in keyboard) {
          keyboard[key] = savedKeyboard[key];
          $("." + key).text(keyboard[key]);
        }
      }
    }
    checkLocalStorageForIssues();
    checkDevice();
    checkMusic();
    checkKeyboard();
    secondaryFunctions.begin(startPermission);
  },
  begin(permission: boolean) {
    if (permission) {
      if (
        localStorage.getItem("mini-car-racing-progress") &&
        localStorage.getItem("mini-car-racing-progress") != "introduction"
      ) {
        variables.currentWindows = "race-gmpause";
        variables.totalProgress = localStorage.getItem(
          "mini-car-racing-progress"
        ) as TotalProgress;
        switch (variables.totalProgress) {
          case "Everything":
          case "finalRace":
          case "secondRace":
            $(".secondRace-begin img").remove();
            $(".secondRace-begin").css("color", "white");
            $(".completed-parts .parts").append($(".firstRace-begin"));
            break;
        }
        switch (variables.totalProgress) {
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
        if (variables.totalProgress == "Everything") {
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
          Це пранк, який зменшує обороти до  ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">60</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)
          `);
        } else {
          $(".explanation-content").html(`
        Цей чит-код дасть тобі максимальну швидкість, а саме - 100000RPM. Ти просто маєш натиснути на <button class="cheat-button">МЕНЕ</button>
        `);
        }
        break;
      case "music":
        $(".explanation-content")
          .html(`1) running in the 90s - Max Coveri; 2) Deja vu - Dave Rodgers; 3) Gas Gas Gas - Manuel; 4) Styles of Beyond - Nine Thou (Superstars Remix); 5) Born too slow - The Crystal Method; 6)The only - StaticX; 7) Broken Promises - Element Eighty; 8) Out of Control - Rancid; 
      <span class='undiscovered-music-left'>Назви решти творів ти отримаєш при проходженні гри</span>
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
          $(".undiscovered-music-left").text("Ти знайшов всі пісні!");
        }
        break;
      case "device":
        $(".explanation-content").html(
          'Якщо хочеш змінити дезайн і управління на інший девайс, то нажми на <button class="change-device">МЕНЕ</button>'
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
        continuing = confirm("Перезапустити вступ?");
        raceIndex = 1;
        variables.progress = "introduction";
        break;
      case "firstRace-begin":
        continuing = confirm("Почати першу гонку?");
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
          continuing = confirm("Почати другу гонку?");
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
          continuing = confirm("Почати ОСТАННЮ гонку?");
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
              "<div class='enemy-car firstRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/firstRace.png' alt='car' class='vehicle enemy-vehicle' /></div>",
              "Як Бачиш - пора змагатись! Якщо ти забув управління - зайди в меню паузи). Зараз заведи мотор"
            );
            $(".gameplay-pause").css("display", "none");
            break;
          case 3:
            $("#race").css({ transform: "scale(1.5)", marginLeft: "20vw" });
            secondRace.beginning(
              secondRace.tip,
              "<div class='enemy-car secondRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/secondRace.png' alt='car' class='vehicle enemy-vehicle' /></div>",
              `Хоч тобі і вдалось пройти першу гонку, але тепер противник швидший, а до поворотів треба швидше тормозити. \n все як минулого разу: двигун => обороти => кнопка => відлік => передача вгору`
            );

            break;
          case 4:
            $("#race").css({ transform: "scale(1.5)", marginLeft: "20vw" });
            finalRace.beginning(
              secondRace.tip,
              "<div class='enemy-car finalRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img  src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/finalRace.png' alt='car' class='vehicle enemy-vehicle' /></div>",
              "Настав час... ...змагатись за першість..."
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
              } else if (music.song) {
                music.song.pause();
              }
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
    $.removeCookie("cheatEffect", { path: "/" });
    $.removeCookie("song", { path: "/" });
    setTimeout(location.reload, 500);
  },
  createDeviceChangingPopup(
    permission: boolean,
    changeSelectValue: boolean = false,
    restart: boolean = false
  ) {
    if (variables.device == undefined) {
      variables.currentWindows = "race-device";
    } else {
      variables.currentWindows += "-device";
    }
    document.body.style.overflowY = "hidden";
    $(document.body).prepend(`<div class="device-changing-popup">
      <p moveAttr="left" class="go-arrow"><</p>
      <p moveAttr="right" class="go-arrow">></p>
      ${variables.device != undefined ? "<p class='just-exit'>✗</p>" : ""}
      <div class="screen-width">
        <h2>Привіт! Обери управління</h2>
        </div>
        <div class="screen-width">
        <select id="choose-device">
          <option selected disabled value="undefined">Не обрано</option>
          <option value="computer">Клавіатура</option>
          <option value="mouse">Комп'ютерна мишка</option>
          <option value="phone">Екран телефона</option>
        </select>
        </div>
        <div class="screen-width">
        <button>Підтвердити</button>
        </div>
      </div>`);

    if (changeSelectValue) {
      $("#choose-device").val(variables.device as string);
    }
    $(".go-arrow").click(function () {
      devicePopupPositions[0] = [0, window.innerWidth, window.innerWidth * 2];
      switch ($(this).attr("moveAttr")) {
        case "left":
          if (devicePopupPositions[1] != 0) {
            devicePopupPositions[1]--;
          }
          break;
        default:
          if (devicePopupPositions[1] != 2) {
            devicePopupPositions[1]++;
          }
          break;
      }
      $(".device-changing-popup")[0].scrollLeft =
        devicePopupPositions[0][devicePopupPositions[1]];
    });
    $(".just-exit").on("click", function () {
      let arr = variables.currentWindows.split("-");
      arr.pop();
      variables.currentWindows = arr.join("-");
      $(".device-changing-popup button").off("click");
      $(".just-exit").off("click");
      $(".device-changing-popup").remove();
      devicePopupPositions[1] = 0;
    });
    $(".device-changing-popup button").on("click", function () {
      if ($("#choose-device").val()) {
        let confirmation = confirm(
          "Ви впевнені? Управління потім можна буде змінити в меню паузи"
        );
        if (confirmation) {
          let currentOption: string | undefined = variables.device;

          if (!currentOption && $("#choose-device").val() != "computer") {
            secondaryFunctions.setStylesForPhone();
          }
          let arr = variables.currentWindows.split("-");
          arr.pop();
          variables.currentWindows = arr.join("-");
          alert("Екран варто тримати лише в горизонтальному положенні!");
          variables.device = $("#choose-device").val() as string;
          $(".device-changing-popup button").off("click");
          $(".device-changing-popup").remove();
          permission = true;
          devicePopupPositions[1] = 0;
          if (!currentOption) {
            secondaryFunctions.begin(permission);
          }
          localStorage.setItem("device", variables.device);
        }

        if (restart) {
          location.reload();
        }
      } else {
        alert("Управління НЕ ОБРАНЕ");
      }
    });
  },
};
