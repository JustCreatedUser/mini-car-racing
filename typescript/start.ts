import { variables, permissions, TotalProgress } from "./other/variables.js";
import { music } from "./other/music.js";
import { myCar, enemyCars } from "./mechanisms/cars.js";
import { keyboard } from "./other/keyboard.js";
let devicePopupPositions: [Array<number>, number] = [
  [0, window.innerWidth, window.innerWidth * 2, window.innerWidth * 3],
  0,
];
(function useLocalStorageAndCookies() {
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
  function checkDeviceAndLanguage() {
    if (!localStorage.getItem("device") || !localStorage.getItem("language"))
      createDeviceChangingPopup(startPermission);
    else if (
      localStorage.getItem("device") &&
      localStorage.getItem("language")
    ) {
      variables.currentWindows = "race";
      variables.device = localStorage.getItem("device") as string;
      variables.language = localStorage.language;
      setENLanguageForHtml();
      startPermission = true;
      if (variables.device != "computer") {
        setStylesForPhone(variables.language);
      }
    }
  }
  function checkMusic() {
    if (!navigator.cookieEnabled) {
      alert("Cookies are forbidden!");
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
      $(".explanation-content").html(
        variables.language != "english"
          ? `
      Це пранк, який зменшує обороти до ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">${cheatEffectTime}</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)`
          : `
      This is a prank, which decrements your car's stats to ${myCar.maxRpm}. It will affect your game for <span class="cheat-counter">${cheatEffectTime}</span> seconds     ......(You should play fair!!!)`
      );
      let cheatEffect = setInterval(() => {
        cheatEffectTime--;
        $(".explanation-content .cheat-counter").text(cheatEffectTime);
        $.cookie("cheatEffect", cheatEffectTime, {
          expires: 0.127,
          path: "/",
        });
        if (cheatEffectTime == 10) {
          alert(
            variables.language != "english"
              ? "Ще 10 секунд, і ефект від читів буде скинуто"
              : "10 seconds more, and effect for cheating will vanish"
          );
        } else if (cheatEffectTime <= 0) {
          alert(
            variables.language != "english"
              ? "Все, ефект від читів пройшов і в тебе знову 10000 оборотів. Якщо хочеш, можеш знову натиснути кнопку і твоя машина нарешті отримає максимальну потужність."
              : "Alright, now you got your 10000 rpm limit back. This time i won`t lie: tap button again and enjoy SUPER-POWER!"
          );
          $(".explanation-content").html(
            variables.language != "english"
              ? `нажми <button class="cheat-button">Мене</button>, і все станеться`
              : 'tap <button class="cheat-button">ME</button>, and get SUPER-POWER'
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
  checkDeviceAndLanguage();
  window.onload = checkMusic;
  checkKeyboard();
  begin(startPermission);
})();

function createDeviceChangingPopup(
  permission: boolean,
  restart: boolean = false
) {
  !variables.device ||
  (!variables.language && variables.totalProgress == "introduction")
    ? (variables.currentWindows = "race-device")
    : (variables.currentWindows += "-device");
  document.body.style.overflowY = "hidden";
  $(document.body).prepend(`<div class="device-changing-popup">
      <p moveAttr="left" class="go-arrow"><</p>
      <p moveAttr="right" class="go-arrow">></p>
      ${
        variables.device && variables.language
          ? "<p class='just-exit'>✗</p>"
          : ""
      }
      <div class="screen-width">
        <h2>Hi! Adjust settings! <br />
          Привіт. Налаштуй гру!</h2>
        </div>
        <div class="screen-width">
        <p>Handling / Управління</p>
        <select id="choose-device">
          <option selected disabled value="undefined">choose / обери</option>
          <option value="computer">Keyboard / Клавіатура</option>
          <option value="mouse">Mouse / Мишка</option>
          <option value="phone">Touchscreen / Екран</option>
        </select>
        </div>
        <div class="screen-width">
        <p>Language / Мова</p>
        <select id="choose-language">
          <option selected disabled value="undefined">choose / обери</option>
          <option value="ukrainian">UA / Українська</option>
          <option value="english">EN / Англійська</option>
        </select>
        </div>
        <div class="screen-width">
        <button>Confirm / Підтвердити</button>
        </div>
      </div>`);

  if (localStorage.getItem("device")) {
    $("#choose-device").val(localStorage.getItem("device"));
  }

  if (localStorage.getItem("language"))
    $("#choose-language").val(localStorage.getItem("language"));

  $(".go-arrow").on("click", function () {
    devicePopupPositions[0] = [
      0,
      window.innerWidth,
      window.innerWidth * 2,
      window.innerWidth * 3,
    ];
    switch ($(this).attr("moveAttr")) {
      case "left":
        if (devicePopupPositions[1] != 0) devicePopupPositions[1]--;

        break;
      default:
        if (devicePopupPositions[1] != 3) devicePopupPositions[1]++;

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
    if ($("#choose-device").val() && $("#choose-language").val()) {
      let confirmation = confirm(
        $("#choose-language").val() == "ukrainian"
          ? "Ви впевнені? Все потім можна буде змінити в меню паузи"
          : "Are you sure? You can still change it while the game is paused."
      );
      if (confirmation) {
        let { device, language } = variables;
        if (!device && $("#choose-device").val() != "computer") {
          setStylesForPhone(
            $("#choose-language").val() as "english" | "ukrainian"
          );
        }
        let arr = variables.currentWindows.split("-");
        arr.pop();
        variables.currentWindows = arr.join("-");

        variables.device = $("#choose-device").val() as string;
        variables.language = $("#choose-language").val() as
          | "ukrainian"
          | "english";
        alert(
          variables.language == "ukrainian"
            ? "Екран варто тримати лише в горизонтальному положенні!"
            : "Please, hold your device horizontally."
        );
        $(".device-changing-popup button").off("click");
        $(".device-changing-popup").remove();
        permission = true;
        devicePopupPositions[1] = 0;
        if (!device || !language) begin(permission);

        if (variables.language == "english") setENLanguageForHtml();

        localStorage.setItem("device", variables.device);
        localStorage.language = variables.language;
      }
      if (restart) location.reload();
    } else {
      alert(
        variables.language != "english" ? "Щось НЕ ОБРАНЕ" : "Smth is UNCHOSEN"
      );
    }
  });
}
function setENLanguageForHtml() {
  if (variables.language == "english") {
    let info = $("#choose-info").children();
    function select(i: number, TXT: string) {
      info.eq(i).text(TXT);
    }
    select(0, "Choose smth");
    select(1, "Fast acceleration");
    select(2, "What is turn?");
    select(3, "Music used here");
    select(4, "Wanna cheat?");
    select(5, "Change device or lang");
    if (variables.device == "computer") {
      let keyboard = $(".keyboard").children();
      function keyTXT(i: number, TXT: string) {
        keyboard.eq(i).text(TXT);
      }
      keyTXT(0, "Handling (tap to change)");
      keyTXT(1, "Gas");
      keyTXT(3, "Brake");
      keyTXT(5, "Gear Up");
      keyTXT(7, "Gear DOWN");
      keyTXT(9, "Engine");
      keyTXT(11, "Pause");
      keyTXT(13, "Music");
      keyTXT(15, "Default?");
    }
    $(".action-settings span").text("Action level");
    $(".gameplay-headline").text(
      "Congratulations on conquering intro (scroll down)"
    );
    $(".completed-parts h3").text("Completed parts");
    $(".uncompleted-parts h3").text("Uncompleted parts");
    $(".introduction-restart").text("Intro");
    $(".firstRace-begin").text("First race");
    $(".secondRace-begin").text("Second race");
    $(".finalRace-begin").text("Final race");
    $(".contact-link-button").text("Contact me");
    $(".back-to-menu-button").text("Back to menu?");
    $(".music-settings").text("Turn on music?");
    $(".continue-game-button").text("Ready?");
    $(".explanation-content").text("nothing so far");
    $(".save-the-progress-button").text("Save progress?");
    $(".turn-position_useless-span").text("After");
  }
}
export function changeDevice() {
  createDeviceChangingPopup(false, true);
}
import { introduction } from "./story.js";
function begin(permission: boolean) {
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
            variables.language != "english"
              ? "Як швидко минає час... Нижче можна скинути прогрес."
              : "The time elapsed so quickly... you can reset your progress lower."
          );
          break;
      }
      if (variables.totalProgress == "Everything") {
        $(".completed-parts .parts").append($(".finalRace-begin"));
        $(".uncompleted-parts h3").text(
          variables.language != "english"
            ? "Вже все пройдено..."
            : "There is nothing left to pass."
        );
        $(".uncompleted-parts").append(
          `<button>${
            variables.language != "english"
              ? "Скинути прогрес і перезавантажитись?"
              : "Reset progress and reload page?"
          }</button>`
        );
      } else {
        $(".gameplay-headline").text(
          variables.language != "english"
            ? "Знову ганяєте? (гортай донизу)"
            : "Racing again? (scroll down)"
        );
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
      $(".save-the-progress-button").text(
        variables.language != "english"
          ? "Прогрес збережено"
          : "Progress is saved"
      );
    } else {
      introduction.beginning();
    }
  }
}
import { gearFunctions } from "./mechanisms/gearFunctions.js";
import { rpmFunctions } from "./mechanisms/rpmFunctions.js";
function setStylesForPhone(lang: "english" | "ukrainian") {
  $("head").append(`
    <link rel="stylesheet" href="./styles/for-phones/styles.css" />
    `);
  $(
    $(".keyboard")
      .html(
        `
      <button>${
        lang != "english" ? "Зайти в повний екран?" : "Enter fullscreen mode"
      }</button>
      `
      )
      .attr("class", "changeScreen")
      .children()[0]
  ).on("click", function () {
    function fullScreen(element: any) {
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.webkitrequestFullscreen)
        element.webkitRequestFullscreen();
      else if (element.mozRequestFullscreen) element.mozRequestFullScreen();

      $(".changeScreen button").text(
        lang != "english" ? "Вийти з повного екрану?" : "Quit fullscreen mode"
      );
    }
    if (document.fullscreenEnabled) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        $(".changeScreen button").text(
          lang != "english" ? "Зайти в повний екран?" : "Enter fullscreen mode"
        );
      } else fullScreen(document.documentElement);
    } else {
      alert(
        lang != "english"
          ? "Браузер не підтримує цю функцію... сумно"
          : "Browser doesn`t support it... sad"
      );
    }
  });
  $("nav").after($(".handling-settings"));
  function makeAButton(param: string, pos: string) {
    return `<div id="${param}ccelerationPedal" class="playing-btn pedal" style="grid-column:${pos};"><div style="z-index:1;"></div><img draggable="false" src="./icons-and-images/pedals/${param}cceleration.webp"></div>`;
  }
  $(".computer-counters")
    .attr("class", "phone-counters")
    .prepend(
      $(makeAButton("de", "1/2"))
        .add(`<div class="gears-block"></div>`)
        .add(`<div class="counters"></div>`)
    )
    .append(makeAButton("a", "5/6"));
  $(".counters")
    .append($(".rpm").add(".speed"))
    .after(
      `<button id="useTheEngine" class="playing-btn">${
        lang != "english" ? "ДВИГУН" : "ENGINE"
      }</button>`
    );
  let arrow = '<img src="./useless-images/arrow.png"';
  $(".gears-block")
    .append(
      $(".gear-counter").add(
        arrow +
          'style="rotate:180deg" id="gearDownButton" class="playing-btn"/>'
      )
    )
    .prepend(arrow + "id='gearUpButton' class='playing-btn'/>");
  let functions: Array<string> =
    variables.device == "phone"
      ? ["touchstart", "touchend"]
      : ["mousedown", "mouseup"];

  $("#gearUpButton").on(functions[0], () => {
    if (variables.isEngineWorking) gearFunctions.up.mechanism();
  });
  $("#gearDownButton").on(functions[0], () => {
    if (variables.isEngineWorking && myCar.gear != 0)
      gearFunctions.down.mechanism();
  });
  $("#deccelerationPedal")
    .on(functions[0], () => {
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
        )
          myCar.moveDirection = `decceleration`;

        myCar.decceleration = true;
      }
    })
    .on(functions[1], () => {
      if (myCar.decceleration) {
        $("#deccelerationPedal")[0].style.transform = "rotateX(0deg)";
        myCar.decceleration = false;
        if (myCar.moveDirection !== 0) {
          myCar.moveDirection = 0;
          $(".car .vehicle").css("transform", "rotate(0)");
        }
      }
    });
  $("#accelerationPedal")
    .on(functions[0], () => {
      if (!myCar.acceleration && !myCar.decceleration) {
        myCar.acceleration = true;
        $("#accelerationPedal")[0].style.transform = "rotateX(1deg)";
        if (
          myCar.moveDirection != "acceleration" &&
          !variables.isGamePaused &&
          variables.isEngineWorking &&
          permissions.forMoreRpm
        )
          myCar.moveDirection = `acceleration`;
      }
    })
    .on(functions[1], () => {
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
    () => myCar.fns.useTheEngine(),
    false
  );
  let buttons = document.querySelectorAll(".playing-btn");
  buttons.forEach((btn) =>
    btn.addEventListener(`contextmenu`, (e) => e.preventDefault(), false)
  );
}
