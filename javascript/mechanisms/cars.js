"use strict";
import { gearFunctions } from "./gearFunctions.js";
import { rpmFunctions } from "./rpmFunctions.js";
import { variables, intervals, permissions, changes, } from "../other/variables.js";
import { firstRace, finalRace, secondRace, introduction, chapters, } from "../story.js";
import { turns } from "./turningFunctions.js";
let entryFor60ms = 0, entryFor240ms = 0;
export let aniFrame;
class Car {
    rpm = 0;
    gear = 0;
    spd = 0;
    maxRpm;
    gearMultiplier = 0;
    noClutchMode = true;
    degrees = 0;
    rotation = 200;
    moveDirection = 0;
    acceleration = false;
    deceleration = false;
    itsFlame;
    constructor() { }
    exhaust() {
        $(this.itsFlame).css("opacity", "1");
        variables.flame = setTimeout(() => {
            $(this.itsFlame).css({ opacity: "0" });
        }, 500);
    }
    wheelsRotation() {
        if (this.gear !== 0) {
            this.spd = this.rpm * this.gearMultiplier;
            this.rotation = Math.sqrt(this.spd) * 50;
        }
    }
}
class MyCar extends Car {
    wheel = ".my-wheel";
    itsFlame = ".my-flame";
    className = `.car`;
    maxRpm = 10000;
    gearShift = undefined;
    noClutchMode = false;
    fns = {
        useTheEngine(isForced = undefined) {
            if (isForced) {
                if (variables.device != "computer") {
                    $("#useTheEngine").css("background-color", "red");
                }
                variables.isEngineWorking = false;
                gearFunctions.color = "white";
                $(".rpm-counter_center").css("background-color", gearFunctions.color);
                $(".rpm-counter").css({
                    transform: `rotate(-45deg)`,
                });
                $(".speed-counter").css({
                    transform: `rotate(-45deg)`,
                });
                $(".rpm-counter-number").html(``);
                $(".speed-counter-number").html("");
                $(".gear-counter").html("N");
                clearInterval(intervals.universalMoving);
                clearInterval(intervals.everyCarMove);
                return;
            }
            if (!variables.isEngineWorking &&
                variables.action > 0 &&
                !variables.isGamePaused) {
                requestAnimationFrame(animateEverything);
                myCar.gear > 0
                    ? alert(variables.language != "english"
                        ? "Запуск можливий тільки при нейтральній передачі"
                        : "You can switch on the engine ONLY while having neutral gear ")
                    : "";
                if (myCar.gear === 0) {
                    if (variables.device != "computer") {
                        $("#useTheEngine").css("background-color", "green");
                    }
                    gearFunctions.color = "blue";
                    $(".rpm-counter_center").css("background-color", gearFunctions.color);
                    myCar.rpm = 800;
                    myCar.gear = 0;
                    myCar.gearMultiplier = 0;
                    variables.isEngineWorking = true;
                    $(".rpm-counter").css({
                        transform: `rotate(${myCar.rpm * 0.027 - 45}deg)`,
                    });
                    $(".rpm-counter-number").html(`${myCar.rpm}RPM`);
                    $(".speed-counter-number").html(`0KM/H`);
                    switch (variables.progress) {
                        case "introduction":
                            introduction.everyTip.engine();
                            break;
                        case "firstRace":
                            firstRace.everyTip.engine();
                            permissions.forMoreRpm = true;
                            myCar.noClutchMode = true;
                            permissions.forLessRpm = true;
                            break;
                        case "secondRace":
                            secondRace.everyTip.engine();
                            break;
                        case "finalRace":
                            finalRace.everyTip.engine();
                            break;
                    }
                }
            }
            else if (!variables.isGamePaused && permissions.toOff_engine) {
                cancelAnimationFrame(aniFrame);
                if (myCar.gear === 0) {
                    if (variables.device != "computer") {
                        $("#useTheEngine").css("background-color", "red");
                    }
                    variables.isEngineWorking = false;
                    gearFunctions.color = "white";
                    myCar.rpm = 0;
                    $(".rpm-counter_center").css("background-color", gearFunctions.color);
                    $(".rpm-counter").css({
                        transform: `rotate(-45deg)`,
                    });
                    $(".rpm-counter-number").html(``);
                    $(".speed-counter-number").html("");
                    if (variables.action === 6) {
                        introduction.ending();
                    }
                    clearInterval(intervals.universalMoving);
                    clearInterval(intervals.everyCarMove);
                }
                else {
                    alert(variables.language != "english"
                        ? "Двигун можна виключити тільки при нейтральній передачі"
                        : "Engine can be switched off ONLY while having neutral gear");
                }
            }
        },
        setHtmlCounters() {
            myCar.spd = Math.round(myCar.spd);
            $(".rpm-counter-number").html(`${myCar.rpm}RPM`);
            $(".speed-counter-number").html(`${myCar.spd}KM/H`);
            $(".rpm-counter").css({
                transform: `rotate(${myCar.rpm * 0.027 - 45}deg)`,
            });
            $(".speed-counter").css({
                transform: `rotate(${myCar.spd - 45}deg)`,
            });
        },
    };
    constructor() {
        super();
    }
}
class EnemyCar extends Car {
    itsFlame = ".enemy-flame";
    wheel = ".enemy-wheel";
    className = ".enemy-car";
    position = 0;
    fns = {
        overtakeFunction(enemyCar = enemyCars.array[enemyCars.index]) {
            let move = Math.round(enemyCar.spd - myCar.spd);
            enemyCar.position +=
                variables.device == "computer"
                    ? move * (window.innerHeight / 540)
                    : (move * (window.innerHeight / 540)) / 1.54;
            $(enemyCar.className).css("margin-left", `${enemyCar.position}px`);
        },
        start(car = enemyCars.array[enemyCars.index]) {
            gearFunctions.up.mechanism(car);
        },
    };
    constructor(rpm, maxRpm) {
        super();
        this.rpm = rpm;
        this.maxRpm = maxRpm;
    }
    handleBehavior() {
        if (turns.array.length != 0) {
            if (variables.progress != "introduction" &&
                chapters[variables.progress].changes.startRace) {
                if (turns.isRightNow != false &&
                    this.spd < turns.array[turns.index].maxSpeed &&
                    this.spd > turns.array[turns.index].maxSpeed - 3) {
                    this.acceleration = false;
                    this.deceleration = false;
                    this.moveDirection = 0;
                    $(`${this.className} .vehicle`).css("transform", `rotate(0deg)`);
                }
                else if (turns.isRightNow != false &&
                    this.spd > turns.array[turns.index].maxSpeed - 3) {
                    enemyCars.array[enemyCars.index].deceleration = true;
                    enemyCars.array[enemyCars.index].acceleration = false;
                }
                else if ((turns.isRightNow == true &&
                    this.spd < turns.array[turns.index].maxSpeed - 3) ||
                    turns.isRightNow == false ||
                    (turns.isRightNow == "almost" &&
                        this.spd < turns.array[turns.index].maxSpeed - 3)) {
                    enemyCars.array[enemyCars.index].acceleration = true;
                    enemyCars.array[enemyCars.index].deceleration = false;
                }
                let distanceRatio = window.innerHeight / -27;
                let marginLeft;
                if ($(this.className).css("marginLeft") != undefined) {
                    marginLeft = Math.round(Number($(this.className)
                        .css("margin-left")
                        .slice(0, $(this.className).css("margin-left").length - 2)));
                }
                if (marginLeft / distanceRatio > 5) {
                    $(".enemy-position").css({ left: 0, right: "unset" });
                    $(".enemy-position").css({
                        display: "flex",
                        background: "linear-gradient(green, white)",
                    });
                    $(".enemy-position").text(`!${Math.round(marginLeft / distanceRatio)}m`);
                }
                else if (marginLeft > window.innerWidth) {
                    let style = {
                        right: "unset",
                        left: window.innerWidth -
                            $(".enemy-position")[0].offsetWidth -
                            (turns.isRightNow == true &&
                                turns.array[turns.index].direction == "right"
                                ? 300
                                : 0) +
                            "px",
                        display: "flex",
                        background: "linear-gradient(red, white)",
                    };
                    $(".enemy-position").css(style);
                    $(".enemy-position").text(`${Math.round(marginLeft / 40)}m!`);
                }
                else {
                    $(".enemy-position").css({
                        display: "none",
                    });
                }
            }
        }
    }
}
export const myCar = new MyCar(), firstRaceCar = new EnemyCar(2000, 8000), secondRaceCar = new EnemyCar(4000, 9000), finalRaceCar = new EnemyCar(8000, 10000), enemyCars = {
    array: [firstRaceCar, secondRaceCar, finalRaceCar],
    index: 0,
};
function set240msInterval(currentEntry) {
    let myCarPosition = 0;
    let car = myCar;
    if (!changes.movingPause && !variables.isGamePaused) {
        if (entryFor240ms == 0) {
            entryFor240ms = currentEntry;
        }
        else if (currentEntry - entryFor240ms < 240)
            return;
        entryFor240ms = currentEntry;
        if (myCar.gear != 0) {
            car.degrees += car.rotation;
            $(car.wheel).css("transform", `rotate(${car.degrees}deg)`);
        }
        if (!variables.finish) {
            variables.backgroundPositionX -= myCar.spd * (window.innerHeight / 540);
            variables.raceBackgroundPositionX -=
                myCar.spd / (window.innerHeight / 135);
            variables.race.style.backgroundPositionX =
                variables.raceBackgroundPositionX + "px";
            variables.road.style.backgroundPositionX =
                variables.backgroundPositionX + "px";
            switch (variables.progress) {
                case "introduction":
                    introduction.everyTip.reachTheTarget();
                    break;
            }
        }
        else {
            myCarPosition += myCar.spd * (window.innerHeight / 540);
            $(myCar.className).css({
                transition: "240ms linear",
                translate: `${myCarPosition}px`,
            });
        }
        if (chapters[variables.progress].changes.startRace &&
            variables.progress != "introduction") {
            let enemyCar = enemyCars.array[enemyCars.index];
            enemyCar.degrees += enemyCar.rotation;
            $(enemyCar.wheel).css("transform", `rotate(${enemyCar.degrees}deg)`);
            enemyCar.fns.overtakeFunction();
        }
    }
}
function set60msInterval(currentEntry) {
    if (entryFor60ms == 0) {
        entryFor60ms = currentEntry;
    }
    else if (currentEntry - entryFor60ms < 60)
        return;
    entryFor60ms = currentEntry;
    rpmFunctions.handleAllMoves(myCar);
    if (chapters[variables.progress].changes.startRace &&
        variables.progress != "introduction") {
        rpmFunctions.handleAllMoves(enemyCars.array[enemyCars.index]);
    }
}
export function animateEverything(currentEntry) {
    aniFrame = requestAnimationFrame(animateEverything);
    set60msInterval(currentEntry);
    if (permissions.toMove) {
        set240msInterval(currentEntry);
    }
}
//# sourceMappingURL=cars.js.map