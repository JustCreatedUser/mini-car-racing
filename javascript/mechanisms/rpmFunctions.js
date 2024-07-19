"use strict";
import { myCar } from "./cars.js";
import { introduction, firstRace, chapters } from "../story.js";
import { gearFunctions } from "./gearFunctions.js";
import { enemyCars } from "./cars.js";
import { turns } from "./turningFunctions.js";
import { variables, changes, permissions, intervals, } from "../other/variables.js";
export const rpmFunctions = {
    moreRpmCounting(car = myCar) {
        let previous_gearMultiplier;
        switch (car.gear) {
            case 2:
                previous_gearMultiplier = 0.013;
                break;
            case 3:
                previous_gearMultiplier = 0.018;
                break;
            case 4:
                previous_gearMultiplier = 0.021;
                break;
            case 5:
                previous_gearMultiplier = 0.025;
        }
        switch (car.gear) {
            case 0:
            case 1:
                car.rpm += 2 * Math.sqrt(car.rpm);
                break;
            default:
                car.rpm +=
                    2 * (Math.sqrt(car.spd / previous_gearMultiplier - car.rpm) / 3);
                break;
        }
        if (car.gear == 0 && car.rpm > 6000) {
            introduction.everyTip.gearUpExplanation();
        }
    },
    conditions(car = myCar, direction) {
        switch (direction) {
            case "more":
                car.rpm > car.maxRpm ? (car.rpm = car.maxRpm) : "";
                car.rpm < 800 ? (car.rpm = 800) : "";
                break;
            case "less":
                car.rpm > 800 ? (car.rpm -= 2 * (2 / 3) * Math.sqrt(car.rpm)) : "";
                car.rpm < 800 ? (car.rpm = 800) : "";
                break;
        }
    },
    handleRpm(car = myCar) {
        if (!variables.isGamePaused &&
            car.noClutchMode &&
            variables.isEngineWorking &&
            !changes.movingPause) {
            if (permissions.forMoreRpm &&
                car.rpm <= car.maxRpm &&
                variables.action > 1 &&
                car.acceleration) {
                if ((car != myCar && turns.isRightNow == false) ||
                    (car != myCar &&
                        turns.isRightNow != false &&
                        car.spd <= turns.array[turns.index].maxSpeed) ||
                    car == myCar) {
                    rpmFunctions.moreRpmCounting(car);
                    rpmFunctions.conditions(car, "more");
                    car.rpm = Math.round(car.rpm);
                    car.spd = Math.round(car.spd);
                    car.wheelsRotation();
                }
                switch (car) {
                    case myCar:
                        permissions.forInertia = false;
                        myCar.fns.setHtmlCounters();
                        rpmFunctions.setHtmlColor(1);
                        break;
                    default:
                        if (car.rpm > car.maxRpm - 300) {
                            if (car.gear == 3) {
                                if (variables.progress == "firstRace" &&
                                    !changes.firstRace.firstTurnExplanation) {
                                    turns.announce();
                                    $(".continue-game-button").css("display", "flex");
                                    $(".continue-game-button").text("Продовжити?");
                                    firstRace.tip(variables.language != "english"
                                        ? `Тепер саме складне - повороти!`
                                        : "Let's...  TURN");
                                }
                                else if ((variables.progress == "secondRace" &&
                                    !changes.secondRace.allowedToTurn) ||
                                    (variables.progress == "finalRace" &&
                                        !changes.finalRace.allowedToTurn)) {
                                    chapters[variables.progress].changes.allowedToTurn =
                                        true;
                                }
                            }
                            gearFunctions.up.mechanism(car);
                        }
                        break;
                }
                switch (car.moveDirection) {
                    case "acceleration":
                        $(`${car.className} .vehicle`).css("transform", `rotate(-1deg)`);
                        break;
                }
                switch (variables.progress) {
                    case "introduction":
                        introduction.everyTip.inMoreRpm();
                        break;
                    case "firstRace":
                        break;
                }
            }
            else if (variables.action > 3 &&
                car.deceleration &&
                permissions.forLessRpm &&
                car.rpm > 800) {
                rpmFunctions.conditions(car, "less");
                car.rpm = Math.round(car.rpm);
                if (car.gear !== 0) {
                    car.spd = car.rpm * car.gearMultiplier;
                    car.rotation = Math.sqrt(car.spd) * 50;
                    switch (car) {
                        case myCar:
                            myCar.fns.setHtmlCounters();
                            break;
                        default:
                            if (car.rpm < car.maxRpm - 3000) {
                                gearFunctions.down.mechanism(car);
                            }
                            break;
                    }
                }
                switch (car.moveDirection) {
                    case "deceleration":
                        $(`${car.className} .vehicle`).css("transform", `rotate(1deg)`);
                        break;
                }
                rpmFunctions.setHtmlColor(1);
            }
        }
    },
    handleAllMoves(car = myCar) {
        rpmFunctions.handleRpm(car);
        if (car == enemyCars.array[enemyCars.index] &&
            !variables.isGamePaused &&
            !changes.movingPause) {
            car.handleBehavior();
        }
        else if (myCar.moveDirection == "deceleration" &&
            variables.progress == "introduction") {
            introduction.everyTip.inLessRpm();
        }
        turns.manage();
    },
    inertiaMechanism() {
        if (permissions.setInertiaInterval) {
            permissions.setInertiaInterval = false;
            intervals.inertia = setInterval(() => {
                if (permissions.forInertia &&
                    myCar.noClutchMode &&
                    myCar.rpm > 815 &&
                    !variables.isGamePaused &&
                    !changes.movingPause) {
                    if (myCar.gear == 0 && myCar.rpm > 800) {
                        myCar.rpm -= Math.round(4 * Math.sqrt(myCar.rpm - 750));
                    }
                    else if (myCar.rpm > 800) {
                        myCar.rpm -= Math.round(1000 * myCar.spd ** -1);
                        myCar.spd = Math.round(myCar.rpm * myCar.gearMultiplier);
                    }
                    else {
                        myCar.rpm = 800;
                    }
                    myCar.fns.setHtmlCounters();
                    rpmFunctions.setHtmlColor(1);
                }
            }, 100);
        }
        variables.startInertiaMechanismTimeout = setTimeout(() => {
            permissions.forInertia = true;
        }, 200);
        if (!permissions.forMoreRpm) {
            clearTimeout(variables.startInertiaMechanismTimeout);
            clearTimeout(variables.flame);
        }
    },
    setHtmlColor(direction) {
        let currentRpm = direction == 1 ? myCar.rpm : Math.round(myCar.spd / myCar.gearMultiplier);
        if (currentRpm < 6000 && gearFunctions.color != "blue") {
            gearFunctions.color = "blue";
            $(".rpm-counter_center").css("background-color", gearFunctions.color);
        }
        else if (currentRpm >= 6000 &&
            currentRpm < 9000 &&
            gearFunctions.color != "green") {
            gearFunctions.color = "green";
            $(".rpm-counter_center").css("background-color", gearFunctions.color);
        }
        else if (currentRpm >= 9000 &&
            currentRpm <= 10000 &&
            gearFunctions.color != "red") {
            gearFunctions.color = "red";
            $(".rpm-counter_center").css("background-color", gearFunctions.color);
        }
    },
    color: "white",
};
//# sourceMappingURL=rpmFunctions.js.map