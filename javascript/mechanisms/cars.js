// Автомобілі
"use strict";
import { gearFunctions } from "./gearFunctions.js";
import { rpmFunctions } from "./rpmFunctions.js";
import {
  firstRace,
  finalRace,
  secondRace,
  introduction,
  chapters,
} from "../story.js";
import { turns } from "./turningFunctions.js";
let carStats = {
    rpm: 0,
    gear: 0,
    spd: 0,
    gearMultiplier: 0,
    noClutchMode: true,
    degrees: 0,
    rotation: 200,
    moveDirection: 0,
    acceleration: false,
    decceleration: false,
  },
  enemyStats = {
    itsFlame: ".enemy-flame",
    wheel: ".enemy-wheel",
    className: ".enemy-car",
    maxRpm: 8000,
    position: 0,
    rpm: 2000,
    fns: {
      overtakeFunction: (enemyCar = enemyCars.array[enemyCars.index]) => {
        let move = Math.round(enemyCar.spd - myCar.spd);
        enemyCar.position +=
          device == "computer"
            ? move * (window.innerHeight / 540)
            : move * (window.innerHeight / 540) * 1.54;
        $(enemyCar.className).css("margin-left", `${enemyCar.position}px`);
      },
      start: (car = enemyCars.array[enemyCars.index]) => {
        gearFunctions.up.mechanism(car);
      },
    },
  };
class Car {
  constructor() {
    for (const key in carStats) {
      this[key] = carStats[key];
    }
  }
  exhaust() {
    $(this.itsFlame).css("opacity", "1");
    flame = setTimeout(() => {
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
  constructor(otherStats) {
    super();
    for (const key in otherStats) {
      this[key] = otherStats[key];
    }
  }
}
class EnemyCar extends Car {
  constructor(otherStats) {
    super();
    for (const key in otherStats) {
      this[key] = otherStats[key];
    }
  }
  handleBehaviour() {
    if (turns.array.length != 0) {
      if (progress != "introduction" && chapters[progress].changes.startRace) {
        if (
          turns.isRightNow != false &&
          this.spd < turns.array[turns.index].maxSpeed &&
          this.spd > turns.array[turns.index].maxSpeed - 3
        ) {
          this.acceleration = false;
          this.decceleration = false;
          this.moveDirection = 0;
          $(`${this.className} .vehicle`).css("transform", `rotate(0deg)`);
        } else if (
          turns.isRightNow != false &&
          this.spd > turns.array[turns.index].maxSpeed - 3
        ) {
          enemyCars.array[enemyCars.index].decceleration = true;
          enemyCars.array[enemyCars.index].acceleration = false;
        } else if (
          (turns.isRightNow == true &&
            this.spd < turns.array[turns.index].maxSpeed - 3) ||
          turns.isRightNow == false ||
          (turns.isRightNow == "almost" &&
            this.spd < turns.array[turns.index].maxSpeed - 3)
        ) {
          enemyCars.array[enemyCars.index].acceleration = true;
          enemyCars.array[enemyCars.index].decceleration = false;
        }
        let marginLeft;
        if ($(this.className).css("marginLeft") != undefined) {
          marginLeft = Math.round(
            Number(
              $(this.className)
                .css("marginLeft")
                .slice(0, $(this.className).css("marginLeft").length - 2)
            )
          );
        }

        if (marginLeft / -40 > 5) {
          if (
            turns.isRightNow == true &&
            turns.array[turns.index].direction == "right"
          ) {
            $(".enemy-position").css({
              left: "20%",
              right: 0,
            });
          } else {
            $(".enemy-position").css({ left: "10%", right: 0 });
          }
          $(".enemy-position").css({
            display: "flex",
            background: "linear-gradient(green, white)",
          });
          $(".enemy-position").text(`!${Math.round(marginLeft / -40)}m`);
        } else if (marginLeft > document.body.offsetWidth - 50) {
          if (turns.isRightNow == true) {
            $(".enemy-position").css({
              right: "20%",
              left: "unset",
            });
          } else {
            $(".enemy-position").css({
              right: "10%",
              left: "unset",
            });
          }
          $(".enemy-position").css({
            display: "flex",
            background: "linear-gradient(red, white)",
          });
          $(".enemy-position").text(`${Math.round(marginLeft / 40)}m!`);
        } else {
          $(".enemy-position").css({
            display: "none",
          });
        }
      }
    }
  }
}
const myCar = new MyCar({
    wheel: ".my-wheel",
    itsFlame: ".my-flame",
    className: `.car`,
    maxRpm: 10000,
    gearShift: undefined,
    noClutchMode: false,
    fns: {
      useTheEngine: (isForced = undefined) => {
        if (isForced) {
          isEngineWorking = false;
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
        if (!isEngineWorking && action > 0 && !isGamePaused) {
          myCar.gear > 0
            ? alert("Запуск можливий тільки при нейтральнй передачі")
            : "";
          if (myCar.gear === 0) {
            gearFunctions.color = "blue";
            $(".rpm-counter_center").css(
              "background-color",
              gearFunctions.color
            );
            myCar.rpm = 800;
            myCar.gear = 0;
            myCar.gearMultiplier = 0;
            isEngineWorking = true;
            $(".rpm-counter").css({
              transform: `rotate(${myCar.rpm * 0.027 - 45}deg)`,
            });
            $(".rpm-counter-number").html(`${myCar.rpm}RPM`);
            $(".speed-counter-number").html(`0KM/H`);

            switch (progress) {
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
            set240msInterval();
            set60msInterval();
          }
        } else if (!isGamePaused && permissions.toOff_engine) {
          if (myCar.gear === 0) {
            isEngineWorking = false;
            gearFunctions.color = "white";
            myCar.rpm = 0;
            $(".rpm-counter_center").css(
              "background-color",
              gearFunctions.color
            );
            $(".rpm-counter").css({
              transform: `rotate(-45deg)`,
            });
            $(".rpm-counter-number").html(``);
            $(".speed-counter-number").html("");
            if (action === 6) {
              introduction.ending();
            }
            clearInterval(intervals.universalMoving);
            clearInterval(intervals.everyCarMove);
          } else {
            alert("Двигун можна виключити тільки при нейтральній передачі");
          }
        }
      },
      setHtmlCounters: () => {
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
    },
  }),
  firstRaceCar = new EnemyCar(enemyStats);
enemyStats.maxRpm = 9000;
enemyStats.rpm = 4000;
const secondRaceCar = new EnemyCar(enemyStats);
enemyStats.maxRpm = 10000;
enemyStats.rpm = 8000;
const finalRaceCar = new EnemyCar(enemyStats);
const enemyCars = {
  array: [firstRaceCar, secondRaceCar, finalRaceCar],
  index: 0,
};
function set240msInterval() {
  let myCarPosition = 0;
  let car = myCar;
  intervals.universalMoving = setInterval(() => {
    if (!changes.movingPause && !isGamePaused) {
      if (myCar.gear != 0) {
        car.degrees += car.rotation;
        $(car.wheel).css("transform", `rotate(${car.degrees}deg)`);
      }
      if (!finish) {
        backgroundPositionX -=
          device == "computer"
            ? myCar.spd / (window.innerHeight / 540)
            : myCar.spd / (window.innerHeight / 540) / 1.54;
        raceBackgroundPositionX -=
          device == "computer"
            ? myCar.spd / (window.innerHeight / 135)
            : myCar.spd / (window.innerHeight / 135) / 1.54;
        race.style.backgroundPositionX = raceBackgroundPositionX + "px";
        road.style.backgroundPositionX = backgroundPositionX + "px";
        switch (progress) {
          case "introduction":
            introduction.everyTip.reachTheTarget();
            break;
        }
      } else {
        myCarPosition +=
          device == "computer"
            ? myCar.spd / (window.innerHeight / 540)
            : myCar.spd / (window.innerHeight / 540) / 1.54;
        $(myCar.className).css({
          transition: "240ms linear",
          "margin-left": `${myCarPosition}px`,
        });
      }
      if (chapters[progress].changes.startRace && progress != "introduction") {
        let enemycar = enemyCars.array[enemyCars.index];
        enemycar.degrees += enemycar.rotation;
        $(enemycar.wheel).css("transform", `rotate(${enemycar.degrees}deg)`);
        enemycar.fns.overtakeFunction();
      }
    }
  }, 240);
}
function set60msInterval() {
  intervals.everyCarMove = setInterval(() => {
    rpmFunctions.handleAllMoves(myCar);
    if (chapters[progress].changes.startRace && progress != "introduction") {
      rpmFunctions.handleAllMoves(enemyCars.array[enemyCars.index]);
    }
  }, 60);
}
export { myCar, firstRaceCar, secondRaceCar, finalRaceCar, enemyCars };
