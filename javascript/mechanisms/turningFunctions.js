//Функції по створенню поворотів
"use strict";
import { myCar } from "./cars.js";
import { music } from "../otherJs/music.js";
import { chapters, finalRace } from "../story.js";
import { gameOver, announceFn } from "../otherJs/secondary.js";
const turns = {
  randomize: () => {
    turns.array = [];
    let turnAmount;
    switch (progress) {
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
      let turn = {
        type: undefined,
        maxSpeed: undefined,
        distanceToIt: undefined,
        distanceOfTurning: undefined,
        direction: undefined,
        distanceAfterTurn: undefined,
      };
      let difficulty;
      switch (progress) {
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
          turn.type = "Різкий";
          break;
        case 1:
          turn.type = "Середній";
          break;
        case 2:
          turn.type = "Плавний";
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
  start: () => {
    let { maxSpeed, distanceOfTurning, type, direction } =
      turns.array[turns.index];
    if (myCar.spd <= maxSpeed) {
      turns.isRightNow = true;
      music.changeVolume(1);
      car.style.transition = "2s linear";

      turnValue = 10;
      switch (type) {
        case "Різкий":
          turnValue = 15;
          additionalMarginForTurn = window.innerWidth / 6.4;
          break;
        case "Середній":
          turnValue = 11;
          additionalMarginForTurn = window.innerWidth / 9.6;
          break;
        case "Плавний":
          turnValue = 7;
          additionalMarginForTurn = window.innerWidth / 19.2;
          break;
      }
      switch (direction) {
        case "right":
          turnValue *= -1;
          additionalMarginForTurn *= -1;
          break;
      }
      realRoadWidth = window.innerWidth / Math.cos((turnValue * Math.PI) / 180);
      $(".background").css({
        transform: `rotateY(${turnValue}deg) `,
      });
      turns.endPosition =
        backgroundPositionX + distanceOfTurning * distanceRatio;
    } else {
      gameOver("Ти не маєш розганятись в повороті!");
    }
  },
  end: () => {
    additionalMarginForTurn = 0;
    turnValue = 0;
    realRoadWidth = window.innerWidth;
    turns.isRightNow = false;
    turns.index++;
    guideBlockText.textContent = "ЖЕНИ ДАЛІ!";
    car.style.marginLeft = 0;
    $(".background").css({
      translate: "0",
      transform: "rotateY(0) rotateX(0) rotate(0deg)",
    });
    if (turns.index !== turns.array.length && turns.array.length != 0) {
      turns.startPosition =
        backgroundPositionX +
        turns.array[turns.index].distanceAfterTurn * distanceRatio;
    }
  },
  announce: () => {
    if (
      turns.array.length != 0 &&
      !finish &&
      turns.index < turns.array.length
    ) {
      announceFn(
        turns.array[turns.index].type.toUpperCase() + " ПОВОРОТ",
        () => {
          turns.isRightNow = "almost";
          changes.movingPause = true;
          $(".turn-position").css("display", "flex");
          $(".turn-speed").text(`${turns.array[turns.index].maxSpeed}km/h`);
          $(".turn-distance").text(`${turns.array[turns.index].distanceToIt}m`);
          setTimeout(() => {
            announcement.style.opacity = 1;
            announcement.style.zIndex = 10;
            setTimeout(() => {
              $(".pause").css("display", "flex");
              permissions.toPause = true;
              announcement.style.opacity = 0;
              announcement.style.zIndex = 0;
              setTimeout(() => {
                announcement.remove();
                if (changes.firstRace.firstTurnExplanation) {
                  changes.movingPause = false;
                  chapters[progress].startTurning();
                }
              }, 1000);
            }, 2000);
          }, 50);
        }
      );
    }
  },
  manage: () => {
    if (
      turns.array.length != 0 &&
      turns.isRightNow === true &&
      myCar.spd > turns.array[turns.index].maxSpeed &&
      backgroundPositionX > turns.endPosition
    ) {
      myCar.spd = 0;
      gameOver("Ти не маєш розганятись в повороті!");
    } else if (
      turns.isRightNow === true &&
      backgroundPositionX <= turns.endPosition
    ) {
      turns.end();
      turns.endPosition = undefined;
      if (turns.index == turns.array.length) {
        chapters[progress].comingToFinish();
      }
    } else if (
      (turns.isRightNow === false &&
        turns.startPosition == undefined &&
        !finish) ||
      (turns.isRightNow === false && backgroundPositionX <= turns.startPosition)
    ) {
      if (
        (progress == "finalRace" && finalRace.changes.allowedToTurn) ||
        (progress == "secondRace" && changes.secondRace.allowedToTurn) ||
        (changes.firstRace.firstTurnExplanation && progress == "firstRace")
      ) {
        if (chapters[progress].changes.startRace) {
          turns.startPosition = undefined;
          turns.announce();
        }
      }
    }
  },
  array: [],
  index: undefined,
  isRightNow: false,
  endPosition: 0,
  startPosition: 0,
};
export { turns, announceFn };
