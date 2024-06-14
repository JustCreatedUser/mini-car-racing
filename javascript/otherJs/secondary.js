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
let devicePopupPositions = [[0, window.innerWidth, window.innerWidth * 2], 0];
export const secondaryFunctions = {
  actionLevelChange() {
    alert("Ти ж розумієш, що перегони без екшену - не перегони!");
  },
  pause() {
    if (!isGamePaused && permissions.toPause) {
      currentWindows += "-menu";
      $(".menu").css("display", "flex");
      $(".pause img").css("visibility", "hidden");
      $(".pause").append("<p>&cross;</p>");
      isGamePaused = true;
      document.body.style.overflowY = "hidden";
    } else {
      if (currentWindows.includes("gmpause")) {
        document.body.style.overflowY = "scroll";
      }
      let arr = currentWindows.split("-");
      arr.pop();
      currentWindows = arr.join("-");
      $(".menu").css("display", "none");
      $(".pause img").css("visibility", "visible");
      $(".pause p").remove();
      isGamePaused = false;
      $("#choose-info").val("Обери пояснення");
      $(".explanation-content").text("поки нічого");
    }
  },
  useGuideBlockButton() {
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
  },
  returnToMenu() {
    if ($(".gameplay-pause").css("display") == "none" && permissions.toPause) {
      turns.array = [];
      $(".enemy-car").remove();
      myCar.noClutchMode = false;
      $(".gameplay-pause").css({ display: "flex", opacity: 1 });
      $(this).css("visibility", "hidden");
      guideBlock.style.opacity = "0";
      $(".enemy-position").css("visibility", "hidden");
      $(".turn-position").css("display", "0");
      race.style.opacity = 0;
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
    function setImg(param, pos) {
      return `<img id="${param}ccelerationPedal" style="grid-column:${pos};" class="playing-btn pedal" src="./icons-and-images/pedals/${param}cceleration.png">`;
    }
    $(".phone-counters").append(setImg("a", "5/6"));
    $(".phone-counters").prepend(setImg("de", "1/2"));
    let functions;
    if (device == "phone") {
      functions = ["touchstart", "touchend"];
    } else {
      functions = ["mousedown", "mouseup"];
    }
    $("#gearUpButton").on(functions[0], () => {
      if (isEngineWorking) {
        gearFunctions.up.mechanism();
      }
    });
    $("#gearDownButton").on(functions[1], () => {
      if (isEngineWorking && myCar.gear != 0) {
        gearFunctions.down.mechanism();
      }
    });
    $("#deccelerationPedal").on(functions[0], () => {
      if (isEngineWorking && !myCar.decceleration && !myCar.acceleration) {
        if (
          myCar.moveDirection != "decceleration" &&
          isEngineWorking &&
          permissions.forLessRpm
        ) {
          myCar.moveDirection = `decceleration`;
        }
        myCar.decceleration = true;
      }
    });
    $("#deccelerationPedal").on(functions[1], () => {
      if (myCar.decceleration) {
        myCar.decceleration = false;
        if (myCar.moveDirection !== 0) {
          myCar.moveDirection = 0;
          $(".car .vehicle").css("transform", "rotate(0)");
        }
      }
    });
    accelerationPedal.addEventListener(functions[1], () => {
      if (action > 1 && myCar.acceleration) {
        myCar.acceleration = false;
        rpmFunctions.inertiaMechanism();
        myCar.exhaust();
        if (myCar.moveDirection !== 0) {
          myCar.moveDirection = 0;
          $(".car .vehicle").css("transform", "rotate(0)");
        }
      }
    });
    accelerationPedal.addEventListener(functions[0], () => {
      if (!myCar.acceleration && !myCar.decceleration) {
        myCar.acceleration = true;
        if (
          myCar.moveDirection != "acceleration" &&
          !isGamePaused &&
          isEngineWorking &&
          permissions.forMoreRpm
        ) {
          myCar.moveDirection = `acceleration`;
        }
      }
    });
    useTheEngine.addEventListener(functions[0], () => {
      myCar.fns.useTheEngine();
    });

    let buttons = document.querySelectorAll(".playing-btn");
    buttons.forEach((btn) => {
      btn.addEventListener(`contextmenu`, (e) => {
        console.log();
        e.preventDefault();
      });
    });
  },
  changeDevice() {
    secondaryFunctions.createDeviceChangingPopup(false, true, true);
  },
  useLocalStorageAndCookies() {
    let startPermission = false;
    function checkLocalStorageForIssues() {
      let localStorageArray = [];
      for (let i = 0; i < localStorage.length; i++) {
        let save = localStorage.getItem(localStorage.key(i));
        if (save == "null") {
          localStorageArray.push(localStorage.key(i));
        }
      }
      localStorageArray.forEach((wrongSave) => {
        localStorage.removeItem(wrongSave);
      });
    }
    function checkDevice() {
      if (!localStorage.getItem("device")) {
        secondaryFunctions.createDeviceChangingPopup(startPermission);
      } else {
        currentWindows = "race";
        device = localStorage.getItem("device");
        startPermission = true;
      }
      if (device != "computer" && device != undefined) {
        secondaryFunctions.setStylesForPhone();
      }
    }
    function checkMusic() {
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
        device == "computer"
      ) {
        let savedKeyboard = JSON.parse(
          localStorage.getItem("mini-car-racing-keyboard")
        );
        for (const key in keyboard) {
          keyboard[key] = savedKeyboard[key];
          $("." + key).text(keyboard[key]);
        }
      }
    }
    checkLocalStorageForIssues();
    checkDevice();
    checkMusic();
    checkKeyboard();
    this.begin(startPermission);
  },
  begin(permission) {
    if (permission) {
      if (
        localStorage.getItem("mini-car-racing-progress") &&
        localStorage.getItem("mini-car-racing-progress") != "introduction"
      ) {
        currentWindows = "race-gmpause";
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
  },
  gameOver(reason) {
    turns.array = [];
    music.changeVolume(0.5);
    permissions.toPause = false;
    guideBlock.style.opacity = "0";
    $(".pause").css("opacity", "0");
    $(".enemy-position").css("visibility", "hidden");
    $(".turn-position").css("display", "0");
    $(".tunnel").css("right", "-75%");
    race.style.opacity = 0.5;
    setTimeout(() => {
      changes.movingPause = true;
      race.style.opacity = 0;
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
      $("#race").css({
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
            $("#race").css({ transform: "scale(1.5)", marginLeft: "20vw" });
            firstRace.beginning(
              firstRace.tip(
                "Як Бачиш - пора змагатись! Якщо ти забув управління - зайди в меню паузи). Зараз заведи мотор"
              ),
              "<div class='enemy-car firstRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/firstRace.png' alt='car' class='vehicle enemy-vehicle' /></div>"
            );
            $(".gameplay-pause").css("display", "none");
            break;
          case 3:
            $("#race").css({ transform: "scale(1.5)", marginLeft: "20vw" });
            secondRace.beginning(
              secondRace.tip(
                `Хоч тобі і вдалось пройти першу гонку, але тепер противник швидший, а до поворотів треба швидше тормозити. \n все як минулого разу: двигун => обороти => кнопка => відлік => передача вгору`
              ),
              "<div class='enemy-car secondRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/secondRace.png' alt='car' class='vehicle enemy-vehicle' /></div>"
            );

            break;
          case 4:
            $("#race").css({ transform: "scale(1.5)", marginLeft: "20vw" });
            finalRace.beginning(
              secondRace.tip("Настав час... ...змагатись за першість..."),
              "<div class='enemy-car finalRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img  src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/finalRace.png' alt='car' class='vehicle enemy-vehicle' /></div>"
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
  },
  announceFn(text, followingFunction) {
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
  },
  restartTheGame() {
    localStorage.clear();
    localStorage.setItem("device", device);
    $.removeCookie("cheatEffect", { path: "/" });
    $.removeCookie("song", { path: "/" });
    setTimeout(location.reload(), 500);
  },
  createDeviceChangingPopup(
    permission,
    changeSelectValue = false,
    restart = false
  ) {
    if (device == undefined) {
      currentWindows = "race-device";
    } else {
      currentWindows += "-device";
    }
    document.body.style.overflowY = "hidden";
    $(document.body).prepend(`<div  class="device-changing-popup">
      <p moveAttr="left" class="go-arrow"><</p>
      <p moveAttr="right" class="go-arrow">></p>
      ${device != undefined ? "<p class='just-exit'>✗</p>" : ""}
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
      $("#choose-device").val(device);
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
      let arr = currentWindows.split("-");
      arr.pop();
      currentWindows = arr.join("-");
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
          let arr = currentWindows.split("-");
          arr.pop();
          currentWindows = arr.join("-");
          if (currentWindows == "race") {
          }
          alert("Екран варто тримати лише в горизонтальному положенні!");
          device = $("#choose-device").val();
          $(".device-changing-popup button").off("click");
          $(".device-changing-popup").remove();
          permission = true;
          devicePopupPositions[1] = 0;
          if (device != "computer") {
            secondaryFunctions.setStylesForPhone();
          }
          secondaryFunctions.begin(permission);
          localStorage.setItem("device", device);
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
