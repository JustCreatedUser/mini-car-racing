//Функції по створенню поворотів
"use strict";
import { myCar } from "./cars.js";
import { music } from "../other/music.js";
import { chapters, finalRace } from "../story.js";
import { secondaryFunctions } from "../other/secondary.js";
import { variables, changes, permissions } from "../other/variables.js";
interface Iturn {
  [key: string]: undefined | any;
}
interface Iturns {
  readonly randomize: () => void;
  readonly start: () => void;
  readonly end: () => void;
  readonly announce: () => void;
  readonly manage: () => void;
  array: Array<Iturn>;
  index: number;
  isRightNow: boolean | "almost";
  endPosition: number | undefined;
  startPosition: number | undefined;
}

const turns: Iturns = {
  randomize() {
    turns.array = [];
    let turnAmount;
    switch (variables.progress) {
      case "secondRace":
        turnAmount = 4;
        break;
      case "firstRace":
        turnAmount = 3;
        break;
      case "finalRace":
        turnAmount = 5;
        break;
    }
    for (let i = 0; i < turnAmount; i++) {
      let turn: Iturn = {
        type: false,
        maxSpeed: undefined,
        distanceToIt: undefined,
        distanceOfTurning: undefined,
        direction: undefined,
        distanceAfterTurn: undefined,
      };
      let difficulty: number = 0;
      switch (variables.progress) {
        case "firstRace":
          difficulty = 0;
          break;
        case "secondRace":
          difficulty = 1;
          break;
        case "finalRace":
          difficulty = 2;
          break;
      }
      turn.type = Math.round(Math.random() * 2);
      let minMaxSpeed = 130 - 15 * difficulty + 40 * turn.type,
        minDistanceToIt = 300 - 90 * difficulty,
        minDistanceOfTurning = 300 - 25 * difficulty - 50 * (2 - turn.type),
        minDistanceAfterTurning = 500 - 100 * difficulty;
      turn.distanceToIt = minDistanceToIt + Math.round(Math.random() * 100);
      turn.maxSpeed = minMaxSpeed + Math.round(Math.random() * 20);
      turn.direction = Math.round(Math.random());
      turn.distanceOfTurning = minDistanceOfTurning + 100 * turn.type;
      turn.distanceAfterTurn = minDistanceAfterTurning + 50 * turn.type;
      switch (turn.type) {
        case 0:
          turn.type = variables.language != "english" ? "Різкий" : "Sharp";
          break;
        case 1:
          turn.type = variables.language != "english" ? "Середній" : "Middle";
          break;
        case 2:
          turn.type = variables.language != "english" ? "Плавний" : "Smooth";
          break;
      }
      switch (turn.direction) {
        case 0:
          turn.direction = "left";
          break;
        case 1:
          turn.direction = "right";
          break;
      }
      turns.array.push(turn);
    }
    turns.index = 0;
    $(".turn-speed").text(`${turns.array[turns.index].maxSpeed}km/h`);
  },
  start() {
    let { maxSpeed, distanceOfTurning, type, direction } =
      turns.array[turns.index];
    if (myCar.spd <= maxSpeed) {
      turns.isRightNow = true;
      music.changeVolume(1);
      variables.car.style.transition = "2s linear";
      switch (type) {
        case "Різкий":
        case "Sharp":
          variables.turnValue = 15;
          variables.additionalMarginForTurn = window.innerWidth / 4.8;
          break;
        case "Середній":
        case "Middle":
          variables.turnValue = 11;
          variables.additionalMarginForTurn = window.innerWidth / 6.2;
          break;
        case "Плавний":
        case "Sharp":
          variables.turnValue = 7;
          variables.additionalMarginForTurn = window.innerWidth / 18.9;
          break;
      }
      switch (direction) {
        case "right":
          variables.turnValue *= -1;
          variables.additionalMarginForTurn *= -1;
          break;
      }
      $(".background").css({
        transform: `rotateY(${variables.turnValue}deg) `,
      });
      turns.endPosition =
        variables.backgroundPositionX +
        distanceOfTurning * variables.distanceRatio;
    } else {
      secondaryFunctions.gameOver(
        variables.language != "english"
          ? "Не перевищуй ліміт швидкості в повороті!"
          : "Don't exceed speed limit while turning!"
      );
    }
  },
  end() {
    variables.additionalMarginForTurn = 0;
    variables.turnValue = 0;
    turns.isRightNow = false;
    turns.index++;
    variables.guideBlockText.textContent = "ЖЕНИ ДАЛІ!";
    variables.car.style.marginLeft = "0";
    $(".background").css({
      translate: "0",
      transform: "rotateY(0) rotateX(0) rotate(0deg)",
    });
    if (turns.index !== turns.array.length && turns.array.length != 0) {
      turns.startPosition =
        variables.backgroundPositionX +
        turns.array[turns.index].distanceAfterTurn * variables.distanceRatio;
    }
  },
  announce() {
    if (
      turns.array.length != 0 &&
      !variables.finish &&
      turns.index < turns.array.length
    ) {
      secondaryFunctions.announceFn(
        turns.array[turns.index].type.toUpperCase() +
          (variables.language != "english" ? " ПОВОРОТ" : " TURN"),
        (): void => {
          let allowedToTurn = false;
          if (changes.firstRace.firstTurnExplanation) {
            allowedToTurn = true;
          }
          turns.isRightNow = "almost";
          changes.movingPause = true;
          $(".turn-position").css("display", "flex");
          $(".turn-speed").text(`${turns.array[turns.index].maxSpeed}km/h`);
          $(".turn-distance").text(`${turns.array[turns.index].distanceToIt}m`);
          setTimeout(() => {
            variables.$announcement.style.opacity = "1";
            variables.$announcement.style.zIndex = "10";
            setTimeout(() => {
              $(".pause").css("display", "flex");
              permissions.toPause = true;
              variables.$announcement.style.opacity = "0";
              variables.$announcement.style.zIndex = "0";
              setTimeout(() => {
                variables.$announcement.remove();
                if (allowedToTurn) {
                  changes.movingPause = false;
                  (chapters as any)[variables.progress].startTurning();
                }
              }, 1000);
            }, 2000);
          }, 50);
        }
      );
    }
  },
  manage() {
    if (
      turns.array.length != 0 &&
      turns.endPosition &&
      turns.isRightNow === true &&
      myCar.spd > turns.array[turns.index].maxSpeed &&
      variables.backgroundPositionX > turns.endPosition
    ) {
      myCar.spd = 0;
      secondaryFunctions.gameOver(
        variables.language != "english"
          ? "Не перевищуй ліміт швидкості в повороті!"
          : "Don't exceed speed limit while turning!"
      );
    } else if (
      turns.endPosition &&
      turns.isRightNow === true &&
      variables.backgroundPositionX <= turns.endPosition
    ) {
      turns.end();
      turns.endPosition = undefined;
      if (turns.index == turns.array.length) {
        (chapters as any)[variables.progress].comingToFinish();
      }
    } else if (
      (turns.isRightNow === false &&
        turns.startPosition == undefined &&
        !variables.finish) ||
      (turns.isRightNow === false &&
        turns.startPosition &&
        variables.backgroundPositionX <= turns.startPosition)
    ) {
      if (
        (variables.progress == "finalRace" &&
          finalRace.changes.allowedToTurn) ||
        (variables.progress == "secondRace" &&
          changes.secondRace.allowedToTurn) ||
        (changes.firstRace.firstTurnExplanation &&
          variables.progress == "firstRace")
      ) {
        if ((chapters as any)[variables.progress].changes.startRace) {
          turns.startPosition = undefined;
          turns.announce();
        }
      }
    }
  },
  array: [],
  index: 0,
  isRightNow: false,
  endPosition: undefined,
  startPosition: undefined,
};
export { turns };
