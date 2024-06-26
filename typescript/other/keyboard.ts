//Підключення клавіатури
"use strict";
import { music } from "./music.js";
import { myCar } from "../mechanisms/cars.js";
import { gearFunctions } from "../mechanisms/gearFunctions.js";
import { rpmFunctions } from "../mechanisms/rpmFunctions.js";
import { secondaryFunctions } from "./secondary.js";
import { variables, permissions } from "./variables.js";
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
  if (!variables.choosingKeysMode) {
    variables.choosingKeysMode = true;
    variables.keyToChoose = $(this)[0].classList[1] as keyof typeof keyboard;
    $(this).text("Нажми кнопку");
    keyboard[variables.keyToChoose as keyof typeof keyboard] = undefined;
  }
});
$(".reset-keyboard").click(function () {
  let response = confirm("Бажаєте скинути поточне управління до стандарту?");
  if (response) {
    let key: keyof typeof keyboard;
    for (key in keyboard) {
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
        case "listenMusic":
          text = "m";
          break;
      }
      keyboard[key] = text;
      $("." + key).text(text);
    }
  }
  localStorage.setItem("mini-car-racing-keyboard", JSON.stringify(keyboard));
});
function keyDown(e: KeyboardEvent) {
  if (!variables.choosingKeysMode && variables.device == "computer") {
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
        if (!myCar.acceleration && !myCar.decceleration) {
          myCar.acceleration = true;
          if (
            myCar.moveDirection != "acceleration" &&
            !variables.isGamePaused &&
            variables.isEngineWorking &&
            permissions.forMoreRpm
          ) {
            myCar.moveDirection = `acceleration`;
          }
        }
        break;
      case keyboard.deccelerate:
        if (
          variables.isEngineWorking &&
          !myCar.decceleration &&
          !myCar.acceleration
        ) {
          if (
            myCar.moveDirection != "decceleration" &&
            variables.isEngineWorking &&
            permissions.forLessRpm
          ) {
            myCar.moveDirection = `decceleration`;
          }
          myCar.decceleration = true;
        }
        break;
      case keyboard.engine:
        myCar.fns.useTheEngine();
        break;
      case keyboard.gearUp:
        if (variables.isEngineWorking) {
          gearFunctions.up.mechanism();
        }
        break;
      case keyboard.gearDown:
        if (myCar.gear != 0 && variables.isEngineWorking) {
          gearFunctions.down.mechanism();
        }
        break;
      case keyboard.goToMenu:
        secondaryFunctions.pause();
        break;
      case keyboard.listenMusic:
        music.listenToMusic();
        break;
    }
  } else if (variables.device == "computer") {
    let keyExists = Object.values(keyboard).filter(
      (el) => el == e.key.toLowerCase()
    );
    if (keyExists.length != 0) {
      alert("Ця кнопка вже використана");
      return;
    }
    let name;
    if (e.code.includes("Key")) {
      name = e.code.split("Key")[1];
    } else if (e.code == "Space") {
      name = e.code;
    } else {
      name = e.key;
    }
    $("." + variables.keyToChoose).text(name.toLowerCase());
    keyboard[variables.keyToChoose] = name.toLowerCase();
    variables.keyToChoose = undefined;
    variables.choosingKeysMode = false;
    localStorage.setItem("mini-car-racing-keyboard", JSON.stringify(keyboard));
  }
}
function keyUp(e: KeyboardEvent) {
  if (variables.device == "computer") {
    let keyName =
      e.code == "Space" ? e.code.toLowerCase() : e.key.toLowerCase();
    if (
      keyName == keyboard.accelerate &&
      variables.action > 1 &&
      myCar.acceleration
    ) {
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
}
export { keyDown, keyUp };
