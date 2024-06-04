"use strict";
import { music } from "./otherJs/music.js";
import {
  enemyCars,
  myCar,
  finalRaceCar,
  firstRaceCar,
  secondRaceCar,
} from "./mechanisms/cars.js";
import {
  selectInfoInMenu,
  saveProgress,
  actionLevelChange,
  pause,
  returnToMenu,
  useGuideBlockButton,
  useLocalStorageAndCookies,
  chooseChapter,
  fastest_speed_cheat,
  restartTheGame,
} from "./otherJs/secondary.js";
import { keyDown, keyUp } from "./otherJs/keyboard.js";
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
  enemyCars.array[enemyCars.index].position = 0;
  enemyCars.array[enemyCars.index].spd = 0;
  enemyCars.array[enemyCars.index].gearMultiplier = 0;
  enemyCars.array[enemyCars.index].noClutchMode = true;
  enemyCars.array[enemyCars.index].gear = 0;
  enemyCars.array[enemyCars.index].moveDirection = 0;
  enemyCars.array[enemyCars.index].rotation = 200;
  enemyCars.array[enemyCars.index].degrees = 0;
  let rpm;
  switch (enemyCars.array[enemyCars.index]) {
    case firstRaceCar:
      rpm = 2000;
      break;
    case secondRaceCar:
      rpm = 5000;
      break;
    case finalRaceCar:
      rpm = 8000;
      break;
  }
  $(".continue-game-button").css("display", "none");
  enemyCars.array[enemyCars.index].rpm = rpm;
  car.style.transition = "0";
  car.style.rotate = "0deg";
  car.style.marginTop = 0;
  hasChanged = undefined;
  action = 0;
  wrapBackgroundPositionX = 0;
  backgroundPositionX = 0;
  $(".turn-position").css("display", "none");
  $(".my-wheel").css("transform", `rotate(0deg)`);
  wrap.style.backgroundPositionX = wrapBackgroundPositionX + "px";
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
$(".save-the-progress-button").click(saveProgress);
$("select").on("input", selectInfoInMenu);
$(".part").click(chooseChapter);
$(".pause").click(pause);
$(".back-to-menu-button").click(returnToMenu);
$(".music-settings").click(music.listenToMusic);
$(".continue-game-button").click(useGuideBlockButton);
$(".action-level-input").on("mousemove", actionLevelChange);
$(".explanation-content").on("click", ".cheat-button", fastest_speed_cheat);
$(".uncompleted-parts").on("click", "button", restartTheGame);
window.document.onload = useLocalStorageAndCookies();
