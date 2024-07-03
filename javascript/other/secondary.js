"use strict";
import { introduction, firstRace, secondRace, finalRace, chapters, } from "../story.js";
import { gearFunctions } from "../mechanisms/gearFunctions.js";
import { rpmFunctions } from "../mechanisms/rpmFunctions.js";
import { enemyCars, myCar } from "../mechanisms/cars.js";
import { music } from "./music.js";
import { turns } from "../mechanisms/turningFunctions.js";
import { keyboard } from "./keyboard.js";
import { variables, permissions, changes } from "./variables.js";
let devicePopupPositions = [
    [0, window.innerWidth, window.innerWidth * 2, window.innerWidth * 3],
    0,
];
export const secondaryFunctions = {
    actionLevelChange() {
        alert(variables.language != "english"
            ? "Ти ж розумієш, що перегони без екшену - не перегони!"
            : "It`s a joke! Racing without action - not a racing!");
    },
    pause() {
        if (!variables.isGamePaused && permissions.toPause) {
            variables.currentWindows += "-menu";
            $(".menu").css("display", "flex");
            $(".pause img").css("visibility", "hidden");
            $(".pause").append("<p>&cross;</p>");
            variables.isGamePaused = true;
            document.body.style.overflowY = "hidden";
        }
        else {
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
            $("#choose-info").val(variables.language != "english" ? "Обери щось" : "Choose smth");
            $(".explanation-content").text(variables.language != "english" ? "поки нічого" : "nothing so far");
        }
    },
    useGuideBlockButton() {
        if (!changes.firstRace.startRace && variables.progress == "firstRace") {
            music.changeVolume(1);
            firstRace.startRace();
        }
        else if (!changes.firstRace.continueFirstTurnExplanation) {
            changes.firstRace.continueFirstTurnExplanation = true;
            firstRace.everyTip.continueTurnExplanation();
        }
        else if (changes.firstRace.startRace &&
            changes.firstRace.continueFirstTurnExplanation) {
            chapters[variables.progress].startTurning();
            music.changeVolume(1);
            changes.firstRace.firstTurnExplanation = true;
        }
        else if ((!changes.secondRace.startRace && variables.progress == "secondRace") ||
            (!changes.finalRace.startRace && variables.progress == "finalRace")) {
            music.changeVolume(1);
            chapters[variables.progress].startRace();
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
            $(this).text(variables.language != "english" ? "Прогрес збережено" : "Progress saved");
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
                music.cheaterSong = new Audio("https://ia600605.us.archive.org/8/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3");
            permissions.toCheat = false;
            if ($("#choose-info").val() == "speedCheat")
                $(".explanation-content").html(variables.language != "english"
                    ? `
    Це пранк, який зменшує обороти до ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">60</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)`
                    : `
    This is a prank, which decrements your car's stats to ${myCar.maxRpm}. Is will affect your game for <span class="cheat-counter">60</span> seconds     ......(You should play fairly!!!)`);
            if (music.isAllowedToPlay)
                music.cheaterSong.play();
            myCar.maxRpm = enemyCars.array[enemyCars.index].maxRpm;
            alert(variables.language != "english"
                ? `ТЕБЕ ЗАРІКРОЛИЛИ! В Тебе тепер ще менше оборотів - ${enemyCars.array[enemyCars.index].maxRpm}`
                : `YOU GOT RICKROLLED! Your car's max RPM was decremented by ${10000 - enemyCars.array[enemyCars.index].maxRpm}RPM`);
            alert(variables.language != "english"
                ? `Цей ефект пройде аж через одну хвилину!`
                : "This will last for a MINUTE");
            let cheatEffectTime = 60;
            $.removeCookie("cheatEffect", { path: "/" });
            $.cookie("cheatEffect", cheatEffectTime, { expires: 0.127, path: "/" });
            localStorage.setItem("cheaterSongWasDiscovered", "true");
            music.hidden.cheaterSongWasDiscovered = true;
            let cheatEffect = setInterval(() => {
                cheatEffectTime--;
                $(".cheat-counter").text(cheatEffectTime);
                $.cookie("cheatEffect", cheatEffectTime, { expires: 0.127, path: "/" });
                if (cheatEffectTime == 10)
                    alert("Ще 10 секунд, і ефект від читів буде скинуто");
                else if (cheatEffectTime <= 0) {
                    alert(variables.language != "english"
                        ? "Все, ефект від читів пройшов і в тебе знову 10000 оборотів. Якщо хочеш, можеш знову натиснути кнопку і твоя машина нарешті отримає максимальну потужність."
                        : "Alright, now you got your 10000 rpm limit back. This time i won`t lie: tap button again and enjoy SUPER-POWER!");
                    if ($("#choose-info").val() == "speedCheat")
                        $(".explanation-content").html(variables.language != "english"
                            ? `нажми <button class="cheat-button">Мене</button>, і все станеться`
                            : 'tap <button class="cheat-button">ME</button>, and get SUPER-POWER');
                    permissions.toCheat = true;
                    clearInterval(cheatEffect);
                    myCar.maxRpm = 10000;
                    $.removeCookie("cheatEffect", { path: "/" });
                }
            }, 1000);
        }
    },
    setStylesForPhone(lang) {
        $("head").append(`
    <link rel="stylesheet" href="./styles/for-phones/styles.css" />
    `);
        $($(".keyboard")
            .html(`
      <button>${lang != "english" ? "Зайти в повний екран?" : "Enter fullscreen mode"}</button>
      `)
            .attr("class", "changeScreen")
            .children()[0]).on("click", function () {
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
                    $(".changeScreen button").text(lang != "english"
                        ? "Зайти в повний екран?"
                        : "Enter fullscreen mode");
                }
                else
                    fullScreen(document.documentElement);
            }
            else {
                alert(lang != "english"
                    ? "Браузер не підтримує цю функцію... сумно"
                    : "Browser doesn`t support it... sad");
            }
        });
        $("nav").after($(".handling-settings"));
        function makeAButton(param, pos) {
            return `<div id="${param}ccelerationPedal" class="playing-btn pedal" style="grid-column:${pos};"><div style="z-index:1;"></div><img draggable="false" src="./icons-and-images/pedals/${param}cceleration.png"></div>`;
        }
        $(".computer-counters")
            .attr("class", "phone-counters")
            .prepend($(makeAButton("de", "1/2"))
            .add(`<div class="gears-block"></div>`)
            .add(`<div class="counters"></div>`))
            .append(makeAButton("a", "5/6"));
        $(".counters")
            .append($(".rpm").add(".speed"))
            .after(`<button id="useTheEngine" class="playing-btn">${lang != "english" ? "ДВИГУН" : "ENGINE"}</button>`);
        let arrow = '<img src="./useless-images/arrow.png"';
        $(".gears-block")
            .append($(".gear-counter").add(arrow +
            'style="rotate:180deg" id="gearDownButton" class="playing-btn"/>'))
            .prepend(arrow + "id='gearUpButton' class='playing-btn'/>");
        let functions = variables.device == "phone"
            ? ["touchstart", "touchend"]
            : ["mousedown", "mouseup"];
        $("#gearUpButton").on(functions[0], () => {
            if (variables.isEngineWorking)
                gearFunctions.up.mechanism();
        });
        $("#gearDownButton").on(functions[0], () => {
            if (variables.isEngineWorking && myCar.gear != 0)
                gearFunctions.down.mechanism();
        });
        $("#deccelerationPedal")
            .on(functions[0], () => {
            if (variables.isEngineWorking &&
                !myCar.decceleration &&
                !myCar.acceleration) {
                $("#deccelerationPedal")[0].style.transform = "rotateX(1deg)";
                if (myCar.moveDirection != "decceleration" &&
                    variables.isEngineWorking &&
                    permissions.forLessRpm)
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
                if (myCar.moveDirection != "acceleration" &&
                    !variables.isGamePaused &&
                    variables.isEngineWorking &&
                    permissions.forMoreRpm)
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
        $("#useTheEngine")[0].addEventListener(functions[0], () => myCar.fns.useTheEngine(), false);
        let buttons = document.querySelectorAll(".playing-btn");
        buttons.forEach((btn) => btn.addEventListener(`contextmenu`, (e) => e.preventDefault(), false));
    },
    changeDevice() {
        secondaryFunctions.createDeviceChangingPopup(false, true);
    },
    useLocalStorageAndCookies() {
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
                secondaryFunctions.createDeviceChangingPopup(startPermission);
            else if (localStorage.getItem("device") &&
                localStorage.getItem("language")) {
                variables.currentWindows = "race";
                variables.device = localStorage.getItem("device");
                variables.language = localStorage.language;
                secondaryFunctions.setENLanguageForHtml();
                startPermission = true;
                if (variables.device != "computer") {
                    secondaryFunctions.setStylesForPhone(variables.language);
                }
            }
        }
        function checkMusic() {
            if (!navigator.cookieEnabled) {
                alert("Cookies are forbidden!");
            }
            else if (localStorage.getItem("listenedCycle")) {
                music.listenedCycle = JSON.parse(localStorage.getItem("listenedCycle"));
                music.checkListenedSongs("localStorage");
            }
            if ($.cookie("cheatEffect") != undefined) {
                permissions.toCheat = false;
                music.cheaterSong = new Audio("https://ia600605.us.archive.org/8/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3");
                myCar.maxRpm = enemyCars.array[enemyCars.index].maxRpm;
                let cheatEffectTime = Math.round(Number($.cookie("cheatEffect")));
                $(".explanation-content").html(variables.language != "english"
                    ? `
      Це пранк, який зменшує обороти до ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">${cheatEffectTime}</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)`
                    : `
      This is a prank, which decrements your car's stats to ${myCar.maxRpm}. Is will affect your game for <span class="cheat-counter">${cheatEffectTime}</span> seconds     ......(You should play fairly!!!)`);
                let cheatEffect = setInterval(() => {
                    cheatEffectTime--;
                    $(".explanation-content .cheat-counter").text(cheatEffectTime);
                    $.cookie("cheatEffect", cheatEffectTime, {
                        expires: 0.127,
                        path: "/",
                    });
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
        checkMusic();
        checkKeyboard();
        secondaryFunctions.begin(startPermission);
    },
    begin(permission) {
        if (permission) {
            if (localStorage.getItem("mini-car-racing-progress") &&
                localStorage.getItem("mini-car-racing-progress") != "introduction") {
                variables.currentWindows = "race-gmpause";
                variables.totalProgress = localStorage.getItem("mini-car-racing-progress");
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
                        $(".gameplay-headline").text(variables.language != "english"
                            ? "Як швидко минає час... Нижче можна скинути прогрес."
                            : "The time passed so quickly... lower you can reset progress");
                        break;
                }
                if (variables.totalProgress == "Everything") {
                    $(".completed-parts .parts").append($(".finalRace-begin"));
                    $(".uncompleted-parts h3").text(variables.language != "english"
                        ? "Вже все пройдено..."
                        : "Nothing left to pass");
                    $(".uncompleted-parts").append(`<button>${variables.language != "english"
                        ? "Скинути прогрес і перезавантажитись?"
                        : "Reset progress and reload page?"}</button>`);
                }
                else {
                    $(".gameplay-headline").text(variables.language != "english"
                        ? "Знову ганяєте? (гортай донизу)"
                        : "Racing again? (scroll down)");
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
                $(".save-the-progress-button").text(variables.language != "english"
                    ? "Прогрес збережено"
                    : "Progress saved");
            }
            else {
                introduction.beginning();
            }
        }
    },
    gameOver(reason) {
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
                $(".explanation-content").html(variables.language != "english"
                    ? "Для Ефективного набирання швидкості треба розганяти обороти до всіх 10000RPM та переключати передачі вгору в самий останній момент"
                    : "In order to efficiently accelerate you need to raise max 10000RPM and shift gear in the last moment");
                break;
            case "turn":
                $(".explanation-content").html(variables.language != "english"
                    ? `Ти повинен бути готовим, що справа на дорозі буде написано: Через "дистанція до поворота" m, "допустима швидкість" km/h. Як тільки це з'явилось - тормози до допустимої швидкості І НЕ РОЗГАНЯЙСЯ, доки не минеш поворот`
                    : `Before a turn on the right side of the road appears this: "After "distance to the turn" m, "max speed" km/h". `);
                break;
            case "speedCheat":
                if (!permissions.toCheat) {
                    $(".explanation-content").html(variables.language != "english"
                        ? `
      Це пранк, який зменшує обороти до ${myCar.maxRpm}. Цей ефект триватиме <span class="cheat-counter">60</span> сек     ......(А НІЧОГО ВИКОРИСТОВУВАТИ ЧИТИ!!!)`
                        : `
      This is a prank, which decrements your car's stats to ${myCar.maxRpm}. Is will affect your game for <span class="cheat-counter">60</span> seconds     ......(You should play fairly!!!)`);
                }
                else {
                    $(".explanation-content").html(variables.language != "english"
                        ? `Цей чит дасть тобі максимальну швидкість, а саме - 100000RPM. Ти просто маєш натиснути на <button class="cheat-button">МЕНЕ</button>`
                        : 'This cheat can give you SUPER POWER - 100000RPM!!! Just press <button class="cheat-button">ME</button>');
                }
                break;
            case "music":
                $(".explanation-content")
                    .html(`1) running in the 90s - Max Coveri; 2) Deja vu - Dave Rodgers; 3) Gas Gas Gas - Manuel; 4) Styles of Beyond - Nine Thou (Superstars Remix); 5) Born too slow - The Crystal Method; 6)The only - StaticX; 7) Broken Promises - Element Eighty; 8) Out of Control - Rancid; 
      <span class='undiscovered-music-left'>${variables.language != "english"
                    ? "Назви решти творів ти отримаєш при проходженні гри"
                    : "Names of other songs will be revealed while playing game"}</span>
        `);
                let number = music.listenedCycle.length + music.songsList.length, numberArray = Object.values(music.hidden).filter((item) => item == true);
                if (music.hidden.cheaterSongWasDiscovered) {
                    number++;
                    $(".undiscovered-music-left").before(` ${number}) Never gonna give you up - Rick Astley; `);
                }
                if (music.hidden.finalSongWasDiscovered) {
                    number++;
                    $(".undiscovered-music-left").before(` ${number}) THE TOP by KEN BLAST; `);
                }
                if (numberArray.length == 2) {
                    $(".undiscovered-music-left").text(variables.language != "english"
                        ? "Ти знайшов всі пісні!"
                        : "You've found all songs!");
                }
                break;
            case "device":
                $(".explanation-content").html(variables.language != "english"
                    ? "Якщо хочеш змінити управління на інший девайс або мову, то нажми на "
                    : 'If you wanna change handling or language, then tap <button class="change-device">ME</button>');
                break;
        }
    },
    chooseChapter() {
        let part = $(this)[0].classList[1], continuing, raceIndex;
        switch (part) {
            case "introduction-restart":
                continuing = confirm(variables.language != "english"
                    ? "Перезапустити вступ?"
                    : "Restart INTRO?");
                raceIndex = 1;
                variables.progress = "introduction";
                break;
            case "firstRace-begin":
                continuing = confirm(variables.language != "english"
                    ? "Почати першу гонку?"
                    : "Start First race?");
                raceIndex = 2;
                variables.progress = "firstRace";
                enemyCars.index = 0;
                break;
            case "secondRace-begin":
                if (variables.totalProgress == "secondRace" ||
                    variables.totalProgress == "finalRace" ||
                    variables.totalProgress == "Everything") {
                    continuing = confirm(variables.language != "english"
                        ? "Почати Другу гонку?"
                        : "Start Second race?");
                    variables.progress = "secondRace";
                    raceIndex = 3;
                    enemyCars.index = 1;
                }
                break;
            case "finalRace-begin":
                if (variables.totalProgress == "finalRace" ||
                    variables.totalProgress == "Everything") {
                    continuing = confirm(variables.language != "english"
                        ? "Почати ОСТАННЮ гонку?"
                        : "Start THE LAST race?");
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
                        firstRace.beginning(firstRace.tip, "<div class='enemy-car firstRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/firstRace.png' alt='car' class='vehicle enemy-vehicle' /></div>", variables.language == "ukrainian"
                            ? `Як Бачиш - пора змагатись! ${variables.device == "computer"
                                ? "Якщо ти забув управління - зайди в меню паузи). Зараз заведи мотор"
                                : ""} `
                            : `As you see, it's time to compete! ${variables.device == "computer"
                                ? "Tips about handling are in menu (just pause the game)"
                                : ""}`);
                        $(".gameplay-pause").css("display", "none");
                        break;
                    case 3:
                        $("#race").css({ transform: "scale(1.5)", marginLeft: "20vw" });
                        secondRace.beginning(secondRace.tip, "<div class='enemy-car secondRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/secondRace.png' alt='car' class='vehicle enemy-vehicle' /></div>", variables.language != "english"
                            ? `Хоч тобі і вдалось пройти першу гонку, але тепер противник швидший, а до поворотів треба швидше тормозити. \n все як минулого разу: двигун => обороти => кнопка => відлік => передача вгору`
                            : `Despite your first victory, don't relax! Your rival is faster and turns are sharper!!!\n However beginning is the same: engine => RPM => guide-button => counting => gear up`);
                        break;
                    case 4:
                        $("#race").css({ transform: "scale(1.5)", marginLeft: "20vw" });
                        finalRace.beginning(secondRace.tip, "<div class='enemy-car finalRace'><img src='./icons-and-images/wheel.png' alt='' class='wheel one enemy-wheel'><img  src='./icons-and-images/flame.png' class='flame enemy-flame'><img src='./icons-and-images/wheel.png' alt='' class='wheel two enemy-wheel'/><img src='./icons-and-images/cars/finalRace.png' alt='car' class='vehicle enemy-vehicle' /></div>", variables.language != "english"
                            ? "Настав час... ...змагатись за першість..."
                            : "Time to fight... ...for being first...");
                        if (music.finalSong === undefined)
                            music.finalSong = new Audio("https://mini-car-racing.netlify.app/additional-music/finalSong.mp3");
                        music.hidden.finalSongWasDiscovered = true;
                        localStorage.setItem("finalSongWasDiscovered", "true");
                        if (music.isAllowedToPlay) {
                            if (music.cheaterSong)
                                music.cheaterSong.pause();
                            else if (music.song)
                                music.song.pause();
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
        variables.race.append(variables.$announcement);
        variables.$announcementText.innerText = text;
        variables.$announcement.append(variables.$announcementText);
        followingFunction();
    },
    restartTheGame() {
        localStorage.clear();
        localStorage.setItem("device", variables.device);
        $.removeCookie("cheatEffect", { path: "/" });
        $.removeCookie("song", { path: "/" });
        setTimeout(location.reload, 500);
    },
    createDeviceChangingPopup(permission, restart = false) {
        !variables.device ||
            (!variables.language && variables.totalProgress == "introduction")
            ? (variables.currentWindows = "race-device")
            : (variables.currentWindows += "-device");
        document.body.style.overflowY = "hidden";
        $(document.body).prepend(`<div class="device-changing-popup">
      <p moveAttr="left" class="go-arrow"><</p>
      <p moveAttr="right" class="go-arrow">></p>
      ${variables.device && variables.language
            ? "<p class='just-exit'>✗</p>"
            : ""}
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
                    if (devicePopupPositions[1] != 0)
                        devicePopupPositions[1]--;
                    break;
                default:
                    if (devicePopupPositions[1] != 3)
                        devicePopupPositions[1]++;
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
                let confirmation = confirm($("#choose-language").val() == "ukrainian"
                    ? "Ви впевнені? Все потім можна буде змінити в меню паузи"
                    : "Are you sure? You can still change it while game is paused");
                if (confirmation) {
                    let { device, language } = variables;
                    if (!device && $("#choose-device").val() != "computer") {
                        secondaryFunctions.setStylesForPhone($("#choose-language").val());
                    }
                    let arr = variables.currentWindows.split("-");
                    arr.pop();
                    variables.currentWindows = arr.join("-");
                    variables.device = $("#choose-device").val();
                    variables.language = $("#choose-language").val();
                    alert(variables.language == "ukrainian"
                        ? "Екран варто тримати лише в горизонтальному положенні!"
                        : "Please, have your device horizontally.");
                    $(".device-changing-popup button").off("click");
                    $(".device-changing-popup").remove();
                    permission = true;
                    devicePopupPositions[1] = 0;
                    if (!device || !language)
                        secondaryFunctions.begin(permission);
                    if (variables.language == "english")
                        secondaryFunctions.setENLanguageForHtml();
                    localStorage.setItem("device", variables.device);
                    localStorage.language = variables.language;
                }
                if (restart)
                    location.reload();
            }
            else {
                alert(variables.language != "english"
                    ? "Щось НЕ ОБРАНЕ"
                    : "Smth is UNCHOSEN");
            }
        });
    },
    setENLanguageForHtml() {
        if (variables.language == "english") {
            let info = $("#choose-info").children();
            function select(i, TXT) {
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
                function keyTXT(i, TXT) {
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
            $(".gameplay-headline").text("Congratulations on conquering intro (scroll down)");
            $(".completed-parts h3").text("Completed parts");
            $(".uncompleted-parts h3").text("Uncompleted parts");
            $(".introduction-restart").text("Intro");
            $(".firstRace-begin").text("First race");
            $(".secondRace-begin").text("Second race");
            $(".finalRace-begin").text("Final race");
            $(".contact-link-button").text("Contact me");
            $(".back-to-menu-button").text("Back to menu?");
            $(".music-settings").text("Switch on music?");
            $(".continue-game-button").text("Ready?");
            $(".explanation-content").text("nothing so far");
            $(".save-the-progress-button").text("Save progress?");
            $(".turn-position_useless-span").text("After");
        }
    },
};
//# sourceMappingURL=secondary.js.map