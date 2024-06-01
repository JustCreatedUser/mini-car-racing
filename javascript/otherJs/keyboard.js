//Підключення клавіатури
"use strict";
import { music } from "./music.js";
import { myCar } from "../mechanisms/cars.js";
import { gearFunctions } from "../mechanisms/gearFunctions.js";
import { rpmFunctions } from "../mechanisms/rpmFunctions.js";
import { pause } from "./secondary.js";
export const keyboard = {
  accelerate: "arrowup",
  deccelerate: "arrowdown",
  engine: "enter",
  gearUp: "shift",
  gearDown: "control",
  goToMenu: "escape",
  listenMusic: "m",
};
$(".keyName").click(function () {
  if (!choosingKeysMode) {
    choosingKeysMode = true;
    keyToChoose = $(this)[0].classList[1];
    $(this).text("Нажми кнопку");
    console.log(keyToChoose);
    keyboard[keyToChoose] = undefined;
  }
});
$(".reset-keyboard").click(function () {
  let response = confirm("Бажаєте скинути поточне управління до стандарту?");
  if (response) {
    for (const key in keyboard) {
      let text;
      switch (key) {
        case "accelerate":
          text = "arrowup";
          break;
        case "deccelerate":
          text = "arrowdown";
          break;
        case "gearDown":
          text = "control";
          break;
        case "gearUp":
          text = "shift";
          break;
        case "engine":
          text = "enter";
          break;
        case "goToMenu":
          text = "escape";
          break;
        case "music":
          text = "m";
          break;
      }
      keyboard[key] = text;
      $("." + key).text(text);
    }
  }
  localStorage.setItem("mini-car-racing-keyboard", JSON.stringify(keyboard));
});
function keyDown(e) {
  if (!choosingKeysMode) {
    let keyName;
    if (e.code.includes("Key")) {
      keyName = e.code.split("Key")[1].toLowerCase();
    } else if (e.code == "Space") {
      keyName = "space";
    } else {
      keyName = e.key.toLowerCase();
    }
    switch (keyName) {
      case keyboard.accelerate:
        if (!myCar.acceleration) {
          myCar.decceleration = false;
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
        break;
      case keyboard.deccelerate:
        if (isEngineWorking && !myCar.decceleration) {
          if (
            myCar.moveDirection != "decceleration" &&
            isEngineWorking &&
            permissions.forLessRpm
          ) {
            myCar.moveDirection = `decceleration`;
          }
          myCar.decceleration = true;
          myCar.acceleration = false;
        }
        break;
      case keyboard.engine:
        myCar.fns.useTheEngine();
        break;
      case keyboard.gearUp:
        if (isEngineWorking) {
          gearFunctions.up.mechanism();
        }
        break;
      case keyboard.gearDown:
        if (myCar.gear != 0 && isEngineWorking) {
          gearFunctions.down.mechanism();
        }
        break;
      case keyboard.goToMenu:
        pause();
        break;
      case keyboard.listenMusic:
        music.listenToMusic();
        break;
    }
  } else {
    let keyExists = Object.values(keyboard).filter(
      (el) => el == e.key.toLowerCase()
    );
    if (keyExists.length != 0) {
      alert("Ця кнопка вже використана");
      return;
    }
    let name;
    switch (e.code) {
      case "Space":
        name = "code";
        break;
      default:
        name = "key";
        break;
    }
    $("." + keyToChoose).text(e[name].toLowerCase());
    keyboard[keyToChoose] = e[name].toLowerCase();
    keyToChoose = undefined;
    choosingKeysMode = false;
    localStorage.setItem("mini-car-racing-keyboard", JSON.stringify(keyboard));
  }
}
function keyUp(e) {
  let keyName = e.code == "Space" ? e.code.toLowerCase() : e.key.toLowerCase();
  if (keyName == keyboard.accelerate && action > 1 && myCar.acceleration) {
    myCar.acceleration = false;
    rpmFunctions.inertiaMechanism();
    myCar.exhaust();
    if (myCar.moveDirection !== 0) {
      myCar.moveDirection = 0;
      $(".car .vehicle").css("transform", "rotate(0)");
    }
  } else if (keyName == keyboard.deccelerate && myCar.decceleration) {
    myCar.decceleration = false;
    if (myCar.moveDirection !== 0) {
      myCar.moveDirection = 0;
      $(".car .vehicle").css("transform", "rotate(0)");
    }
  }
}
export { keyDown, keyUp };
