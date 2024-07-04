"use strict";
import { music } from "./other/music.js";
import {
  enemyCars,
  myCar,
  finalRaceCar,
  firstRaceCar,
  secondRaceCar,
} from "./mechanisms/cars.js";
import { secondaryFunctions } from "./other/secondary.js";
import { keyDown, keyUp } from "./other/keyboard.js";
import {
  changes,
  variables,
  intervals,
  permissions,
} from "./other/variables.js";
window.document.onkeydown = keyDown;
window.document.onkeyup = keyUp;
changes.rewriteEverything = () => {
  myCar.rpm = 0;
  myCar.spd = 0;
  myCar.gear = 0;
  myCar.gearMultiplier = 0;
  myCar.rotation = 200;
  myCar.degrees = 0;
  myCar.acceleration = false;
  myCar.decceleration = false;
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
    car.decceleration = false;
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
  myCar.decceleration = false;
  for (let i in intervals) {
    clearInterval(intervals[i]);
  }
  for (let i in permissions) {
    if (i != "toCheat" && i != "toPause") {
      permissions[i] = false;
    }
  }
  myCar.fns.useTheEngine(true);
};
$(".save-the-progress-button").on("click", secondaryFunctions.saveProgress);
$("#choose-info").on("input", secondaryFunctions.selectInfoInMenu);
$(".part").on("click", secondaryFunctions.chooseChapter);
$(".pause").on("click", secondaryFunctions.pause);
$(".back-to-menu-button").on("click", secondaryFunctions.returnToMenu);
$(".music-settings").on("click", music.listenToMusic);
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
$(".explanation-content").on(
  "click",
  ".change-device",
  secondaryFunctions.changeDevice
);
window.onload = secondaryFunctions.useLocalStorageAndCookies;
