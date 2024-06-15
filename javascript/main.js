"use strict";
import { music } from "./otherJs/music.js";
import {
  enemyCars,
  myCar,
  finalRaceCar,
  firstRaceCar,
  secondRaceCar,
} from "./mechanisms/cars.js";
import { secondaryFunctions } from "./otherJs/secondary.js";
import { keyDown, keyUp } from "./otherJs/keyboard.js";
import { firstRace } from "./story.js";
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
  car.style.transition = "0";
  car.style.rotate = "0deg";
  car.style.marginTop = 0;
  car.style.boxShadow = "unset";
  hasChanged = undefined;
  action = 0;
  raceBackgroundPositionX = 0;
  backgroundPositionX = 0;
  $(".turn-position").css("display", "none");
  $(".my-wheel").css("transform", `rotate(0deg)`);
  race.style.backgroundPositionX = raceBackgroundPositionX + "px";
  road.style.backgroundPositionX = backgroundPositionX + "px";
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
$(".save-the-progress-button").click(secondaryFunctions.saveProgress);
$("#choose-info").on("input", secondaryFunctions.selectInfoInMenu);
$(".part").click(secondaryFunctions.chooseChapter);
$(".pause").click(secondaryFunctions.pause);
$(".back-to-menu-button").click(secondaryFunctions.returnToMenu);
$(".music-settings").click(music.listenToMusic);
$(".continue-game-button").click(secondaryFunctions.useGuideBlockButton);
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
window.document.onload = secondaryFunctions.useLocalStorageAndCookies();
