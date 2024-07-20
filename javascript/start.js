import { variables, changes, permissions, intervals, } from "./other/variables.js";
import { music } from "./other/music.js";
import { myCar, enemyCars, firstRaceCar, secondRaceCar, finalRaceCar, } from "./mechanisms/cars.js";
import { keyboard } from "./other/keyboard.js";
const Loading = new Promise((resolve) => {
    window.onload = () => {
        resolve("loading finished");
    };
});
let devicePopupPositions = [
    [0, window.innerWidth, window.innerWidth * 2, window.innerWidth * 3],
    0,
];
(function useLocalStorageAndCookies() {
    let startPermission = false;
    function checkLocalStorageForIssues() {
        let wrongArray = Object.entries(localStorage).filter((save) => save[1] == "undefined" || save[1] == "null");
        wrongArray.forEach((wrongSave) => {
            localStorage.removeItem(wrongSave[0]);
        });
        localStorage.removeItem("touchEvents");
    }
    function checkDeviceAndLanguage() {
        if (!localStorage.getItem("device") || !localStorage.getItem("language"))
            createDeviceChangingPopup(startPermission);
        else if (localStorage.getItem("device") &&
            localStorage.getItem("language")) {
            variables.currentWindows = "race";
            variables.device = localStorage.getItem("device");
            variables.language = localStorage.language;
            setENLanguageForHtml();
            startPermission = true;
            if (variables.device != "computer") {
                setStylesForPhone(variables.language, variables.device);
            }
        }
    }
    function checkMusic() {
        if (localStorage.getItem("listenedCycle")) {
            music.listenedCycle = JSON.parse(localStorage.getItem("listenedCycle"));
            music.checkListenedSongs("localStorage");
        }
        if (sessionStorage["cheatEffect"] != undefined) {
            permissions.toCheat = false;
            music.cheaterSong = new Audio("https://ia600605.us.archive.org/8/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3");
            myCar.maxRpm = enemyCars.array[enemyCars.index].maxRpm;
            let cheatEffectTime = Math.round(Number(sessionStorage["cheatEffect"]));
            $(".explanation-content").html(variables.language != "english"
                ? `
      Це пранк, який зменшує обороти до ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">${cheatEffectTime}</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)`
                : `
      This is a prank, which decrements your car's stats to ${myCar.maxRpm}. It will affect your game for <span class="cheat-counter">${cheatEffectTime}</span> seconds     ......(You should play fair!!!)`);
            let cheatEffect = setInterval(() => {
                cheatEffectTime--;
                $(".explanation-content .cheat-counter").text(cheatEffectTime);
                sessionStorage["cheatEffectTime"] = cheatEffectTime;
                if (cheatEffectTime == 10) {
                    alert(variables.language != "english"
                        ? "Ще 10 секунд, і ефект від читів буде скинуто"
                        : "10 seconds more, and effect for cheating will vanish");
                }
                else if (cheatEffectTime <= 0) {
                    alert(variables.language != "english"
                        ? "Все, ефект від читів пройшов і в тебе знову 10000 оборотів. Якщо хочеш, можеш знову натиснути кнопку і твоя машина нарешті отримає максимальну потужність."
                        : "Alright, now you got your 10000 rpm limit back. This time i won`t lie: tap button again and enjoy SUPER-POWER!");
                    $(".explanation-content").html(variables.language != "english"
                        ? `нажми <button class="cheat-button">Мене</button>, і все станеться`
                        : 'tap <button class="cheat-button">ME</button>, and get SUPER-POWER');
                    myCar.maxRpm = 10000;
                    permissions.toCheat = true;
                    clearInterval(cheatEffect);
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
        if (localStorage.getItem("mini-car-racing-keyboard") &&
            variables.device == "computer") {
            let savedKeyboard = JSON.parse(localStorage.getItem("mini-car-racing-keyboard"));
            let key;
            for (key in keyboard) {
                keyboard[key] = savedKeyboard[key];
                $("." + key).text(keyboard[key]);
            }
        }
    }
    checkLocalStorageForIssues();
    checkDeviceAndLanguage();
    Loading.then(() => {
        checkMusic;
        begin(startPermission);
    });
    checkKeyboard();
})();
function createDeviceChangingPopup(permission, restart = false) {
    !variables.device ||
        (!variables.language && variables.totalProgress == "introduction")
        ? (variables.currentWindows = "race-device")
        : (variables.currentWindows += "-device");
    document.body.style.overflowY = "hidden";
    let devChangePopup = document.createElement("div");
    devChangePopup.className = "device-changing-popup";
    devChangePopup.innerHTML = `
  <p moveAttr="left" class="go-arrow"><</p>
  <p moveAttr="right" class="go-arrow">></p>
  ${variables.device && variables.language ? "<p class='just-exit'>✗</p>" : ""}
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
  `;
    document.body.prepend(devChangePopup);
    if (localStorage.getItem("device"))
        document.getElementById("choose-device").value =
            localStorage.getItem("device");
    if (localStorage.getItem("language"))
        document.getElementById("choose-language").value =
            localStorage.getItem("language");
    const Event = function (e) {
        devicePopupPositions[0] = [
            0,
            window.innerWidth,
            window.innerWidth * 2,
            window.innerWidth * 3,
        ];
        switch (e.target.attributes["moveattr"].value) {
            case "left":
                if (devicePopupPositions[1] != 0)
                    devicePopupPositions[1]--;
                break;
            default:
                if (devicePopupPositions[1] != 3)
                    devicePopupPositions[1]++;
                break;
        }
        document.querySelector(".device-changing-popup").scrollLeft =
            devicePopupPositions[0][devicePopupPositions[1]];
    };
    for (const iterator of document.getElementsByClassName("go-arrow")) {
        iterator.addEventListener("click", Event);
    }
    let exit = document.querySelector(".just-exit");
    exit
        ? (exit.onclick = function () {
            let arr = variables.currentWindows.split("-");
            arr.pop();
            variables.currentWindows = arr.join("-");
            document.querySelector(".device-changing-popup").remove();
            devicePopupPositions[1] = 0;
            for (const iterator of document.getElementsByClassName("go-arrow")) {
                iterator.removeEventListener("click", Event);
            }
        })
        : "";
    devChangePopup.children[devChangePopup.children.length - 1]
        .children[0].onclick = function () {
        const deviceSelect = document.getElementById("choose-device");
        const langSelect = document.getElementById("choose-language");
        if (deviceSelect.value != "undefined" && langSelect.value != "undefined") {
            let confirmation = confirm(langSelect.value == "ukrainian"
                ? "Ви впевнені? Все потім можна буде змінити в меню паузи"
                : "Are you sure? You can still change it while the game is paused.");
            if (confirmation) {
                let { device, language } = variables;
                if (!device && deviceSelect.value != "computer") {
                    setStylesForPhone(langSelect.value, deviceSelect.value);
                }
                let arr = variables.currentWindows.split("-");
                arr.pop();
                variables.currentWindows = arr.join("-");
                variables.device = deviceSelect.value;
                variables.language = langSelect.value;
                alert(variables.language == "ukrainian"
                    ? "Екран варто тримати лише в горизонтальному положенні!"
                    : "Please, hold your device horizontally.");
                for (const iterator of document.getElementsByClassName("go-arrow")) {
                    iterator.removeEventListener("click", Event);
                }
                devChangePopup.remove();
                permission = true;
                devicePopupPositions[1] = 0;
                if (!device || !language)
                    begin(permission);
                if (variables.language == "english")
                    setENLanguageForHtml();
                localStorage.setItem("device", variables.device);
                localStorage.language = variables.language;
            }
            if (restart)
                location.reload();
        }
        else {
            alert(variables.language != "english" ? "Щось НЕ ОБРАНЕ" : "Smth is UNCHOSEN");
        }
    };
}
function setENLanguageForHtml() {
    if (variables.language == "english") {
        let info = document.getElementById("choose-info").children;
        function select(i, TXT) {
            info[i].innerHTML = TXT;
        }
        select(0, "Choose smth");
        select(1, "Fast acceleration");
        select(2, "What is turn?");
        select(3, "Music used here");
        select(4, "Wanna cheat?");
        select(5, "Change device or lang");
        if (variables.device == "computer") {
            let keyboard = document.querySelector(".keyboard").children;
            function keyTXT(i, TXT) {
                keyboard[i].innerHTML = TXT;
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
        document.querySelector(".action-settings span").innerHTML = "Action level";
        document.querySelector(".gameplay-headline").innerHTML =
            "Congratulations on conquering intro (scroll down)";
        document.querySelector(".completed-parts h3").innerHTML = "Completed parts";
        document.querySelector(".uncompleted-parts h3").innerHTML =
            "Uncompleted parts";
        document.querySelector(".introduction-restart").innerHTML = "Intro";
        document.querySelector(".firstRace-begin").innerHTML = "First race";
        document.querySelector(".secondRace-begin").innerHTML = "Second race";
        document.querySelector(".finalRace-begin").innerHTML = "Final race";
        document.querySelector(".contact-link-button").innerHTML = "Contact me";
        document.querySelector(".back-to-menu-button").innerHTML = "Back to menu?";
        document.querySelector(".music-settings").innerHTML = "Turn on music?";
        document.querySelector(".continue-game-button").innerHTML = "Ready?";
        document.querySelector(".explanation-content").innerHTML = "nothing so far";
        document.querySelector(".save-the-progress-button").innerHTML =
            "Save progress?";
        document.querySelector(".turn-position_useless-span").innerHTML = "After";
    }
}
$(".explanation-content").on("click", ".change-device", function () {
    createDeviceChangingPopup(false, true);
});
import { introduction } from "./story.js";
function begin(permission) {
    if (permission) {
        if (localStorage.getItem("mini-car-racing-progress") &&
            localStorage.getItem("mini-car-racing-progress") != "introduction") {
            variables.currentWindows = "race-gmpause";
            variables.totalProgress = localStorage.getItem("mini-car-racing-progress");
            switch (variables.totalProgress) {
                case "Everything":
                case "finalRace":
                case "secondRace":
                    document.querySelector(".secondRace-begin").style.color = "white";
                    document
                        .querySelector(".completed-parts .parts")
                        .appendChild(document.querySelector(".firstRace-begin"));
                    break;
            }
            switch (variables.totalProgress) {
                case "Everything":
                case "finalRace":
                    document.querySelector(".finalRace-begin").style["color"] = "white";
                    document
                        .querySelector(".completed-parts .parts")
                        .append(document.querySelector(".secondRace-begin"));
                    document.querySelector(".gameplay-headline").innerHTML =
                        variables.language != "english"
                            ? "Як швидко минає час... Нижче можна скинути прогрес."
                            : "The time elapsed so quickly... you can reset your progress lower.";
                    break;
            }
            if (variables.totalProgress == "Everything") {
                document
                    .querySelector(".completed-parts .parts")
                    .appendChild(document.querySelector(".finalRace-begin"));
                document.querySelector(".uncompleted-parts h3").innerHTML =
                    variables.language != "english"
                        ? "Вже все пройдено..."
                        : "There is nothing left to pass.";
                let btn = document.createElement("button");
                btn.innerHTML = `${variables.language != "english"
                    ? "Скинути прогрес і перезавантажитись?"
                    : "Reset progress and reload page?"}`;
                document.querySelector(".uncompleted-parts").append(btn);
            }
            else {
                document.querySelector(".gameplay-headline").innerHTML =
                    variables.language != "english"
                        ? "Знову ганяєте? (гортай донизу)"
                        : "Racing again? (scroll down)";
            }
            permissions.toSaveProgress = false;
            permissions.toPause = true;
            document.querySelector(".gameplay-pause").style["opacity"] = "1";
            document.querySelector(".gameplay-pause").style.display =
                "flex";
            document.body.style.overflowY = "scroll";
            document.querySelector(".save-the-progress-button").style.cssText = `
        background: white;
        color: black;
        border-bottom: 2px solid black;
      `;
            document.querySelector(".save-the-progress-button").innerHTML =
                variables.language != "english"
                    ? "Прогрес збережено"
                    : "Progress is saved";
        }
        else {
            introduction.beginning();
        }
    }
}
import { gearFunctions } from "./mechanisms/gearFunctions.js";
function setStylesForPhone(lang, device) {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./styles/for-phones/styles.css";
    document.getElementsByTagName("head")[0].appendChild(link);
    const keyboard = document.querySelector(".keyboard");
    keyboard.innerHTML = `
      <button>${lang != "english" ? "Зайти в повний екран?" : "Enter fullscreen mode"}</button>
  `;
    keyboard.className = "changeScreen";
    keyboard.children[0].onclick = function () {
        function fullScreen(element) {
            if (element.requestFullscreen)
                element.requestFullscreen();
            else if (element.webkitrequestFullscreen)
                element.webkitRequestFullscreen();
            else if (element.mozRequestFullscreen)
                element.mozRequestFullScreen();
            $(".changeScreen button").text(lang != "english" ? "Вийти з повного екрану?" : "Quit fullscreen mode");
        }
        if (document.fullscreenEnabled) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
                $(".changeScreen button").text(lang != "english" ? "Зайти в повний екран?" : "Enter fullscreen mode");
            }
            else
                fullScreen(document.documentElement);
        }
        else {
            alert(lang != "english"
                ? "Браузер не підтримує цю функцію... сумно"
                : "Browser doesn`t support it... sad");
        }
    };
    document
        .querySelector("nav")
        .after(document.querySelector(".handling-settings"));
    function makeAButton(param, pos) {
        const button = document.createElement("div");
        button.id = `${param}celerationPedal`;
        button.classList.add("playing-btn", "pedal");
        button.style.cssText = `grid-column:${pos};`;
        button.innerHTML = `<div style="z-index:1;"></div>
    <img draggable="false" src="./icons-and-images/pedals/${param}cceleration.webp">`;
        return button;
    }
    const footer = document.querySelector(".computer-counters");
    footer.className = "phone-counters";
    const gearsBlock = document.createElement("div");
    gearsBlock.className = "gears-block";
    const counters = document.createElement("div");
    counters.className = "counters";
    footer.prepend(makeAButton("de", "1/2"), gearsBlock, counters);
    footer.append(makeAButton("ac", "5/6"));
    counters.append(document.querySelector(".rpm"), document.querySelector(".speed"));
    const ENGINE = document.createElement("button");
    ENGINE.id = "useTheEngine";
    ENGINE.className = "playing-btn";
    ENGINE.innerText = lang != "english" ? "ДВИГУН" : "ENGINE";
    counters.after(ENGINE);
    const arrow = document.createElement("img");
    arrow.src = "./useless-images/arrow.png";
    arrow.className = "playing-btn";
    const arrowDown = arrow;
    arrowDown.style.cssText = "rotate:180deg";
    arrowDown.id = "gearDownButton";
    const arrowUp = arrow;
    arrowUp.id = "gearUpButton";
    gearsBlock.append(document.querySelector(".gear-counter"), arrowDown);
    gearsBlock.prepend(arrowUp);
    let functions = device == "phone" ? ["touchstart", "touchend"] : ["mousedown", "mouseup"];
    ENGINE.addEventListener(functions[0], () => myCar.fns.useTheEngine(), false);
    arrowUp.addEventListener(functions[0], () => {
        if (variables.isEngineWorking)
            gearFunctions.up.mechanism();
    });
    arrowDown.addEventListener(functions[0], () => {
        if (variables.isEngineWorking && myCar.gear != 0)
            gearFunctions.down.mechanism();
    });
    const brakes = document.querySelector("#decelerationPedal");
    brakes.addEventListener(functions[0], () => {
        if (variables.isEngineWorking &&
            !myCar.deceleration &&
            !myCar.acceleration) {
            $("#decelerationPedal")[0].style.transform = "rotateX(1deg)";
            if (myCar.moveDirection != "deceleration" &&
                variables.isEngineWorking &&
                permissions.forLessRpm)
                myCar.moveDirection = `deceleration`;
            myCar.deceleration = true;
        }
    });
    brakes.addEventListener(functions[1], () => {
        if (myCar.deceleration) {
            $("#decelerationPedal")[0].style.transform = "rotateX(0deg)";
            myCar.deceleration = false;
            if (myCar.moveDirection !== 0) {
                myCar.moveDirection = 0;
                $(".car .vehicle").css("transform", "rotate(0)");
            }
        }
    });
    const accelerator = document.querySelector("#accelerationPedal");
    accelerator.addEventListener(functions[0], () => {
        if (!myCar.acceleration && !myCar.deceleration) {
            myCar.acceleration = true;
            $("#accelerationPedal")[0].style.transform = "rotateX(1deg)";
            if (myCar.moveDirection != "acceleration" &&
                !variables.isGamePaused &&
                variables.isEngineWorking &&
                permissions.forMoreRpm)
                myCar.moveDirection = `acceleration`;
        }
    });
    accelerator.addEventListener(functions[1], () => {
        if (variables.action > 1 && myCar.acceleration) {
            $("#accelerationPedal")[0].style.transform = "rotateX(0deg)";
            myCar.acceleration = false;
            if (permissions.forMoreRpm) {
                variables.startInertiaMechanismTimeout = setTimeout(() => {
                    permissions.forInertia = true;
                }, 200);
                myCar.exhaust();
            }
            if (myCar.moveDirection !== 0) {
                myCar.moveDirection = 0;
                $(".car .vehicle").css("transform", "rotate(0)");
            }
        }
    });
    let buttons = document.querySelectorAll(".playing-btn");
    buttons.forEach((btn) => btn.addEventListener(`contextmenu`, (e) => e.preventDefault(), false));
}
changes.rewriteEverything = () => {
    myCar.rpm = 0;
    myCar.spd = 0;
    myCar.gear = 0;
    myCar.gearMultiplier = 0;
    myCar.rotation = 200;
    myCar.degrees = 0;
    myCar.acceleration = false;
    myCar.deceleration = false;
    myCar.noClutchMode = true;
    myCar.moveDirection = 0;
    enemyCars.array.forEach((car) => {
        car.position = 0;
        car.spd = 0;
        car.gearMultiplier = 0;
        car.noClutchMode = true;
        car.gear = 0;
        car.moveDirection = 0;
        car.rotation = 200;
        car.degrees = 0;
        car.acceleration = false;
        car.deceleration = false;
    });
    firstRaceCar.rpm = 2000;
    secondRaceCar.rpm = 5000;
    finalRaceCar.rpm = 8000;
    $(".continue-game-button").css("display", "none");
    $(".car").css({
        transition: "0",
        marginTop: "0",
        rotate: "0deg",
        boxShadow: "unset",
    });
    variables.hasChanged = undefined;
    variables.action = 0;
    variables.raceBackgroundPositionX = 0;
    variables.backgroundPositionX = 0;
    $(".turn-position").css("display", "none");
    $(".my-wheel").css("transform", `rotate(0deg)`);
    variables.race.style.backgroundPositionX =
        variables.raceBackgroundPositionX + "px";
    variables.road.style.backgroundPositionX =
        variables.backgroundPositionX + "px";
    $(".enemy-wheel").css("transform", `rotate(0deg)`);
    myCar.acceleration = false;
    myCar.deceleration = false;
    for (let i in intervals) {
        clearInterval(intervals[i]);
    }
    let i;
    for (i in permissions) {
        if (i != "toCheat" && i != "toPause") {
            permissions[i] = false;
        }
    }
    myCar.fns.useTheEngine(true);
};
//# sourceMappingURL=start.js.map