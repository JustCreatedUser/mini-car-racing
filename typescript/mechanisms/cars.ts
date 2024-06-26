// Автомобілі
"use strict";
import { gearFunctions } from "./gearFunctions.js";
import { rpmFunctions } from "./rpmFunctions.js";
import {
  variables,
  intervals,
  permissions,
  changes,
} from "../other/variables.js";
import {
  firstRace,
  finalRace,
  secondRace,
  introduction,
  chapters,
} from "../story.js";
import { turns } from "./turningFunctions.js";
type moveDirection = 0 | "acceleration" | "decceleration";
class Car {
  rpm: number = 0;
  gear: number = 0;
  spd: number = 0;
  maxRpm?: number;
  gearMultiplier: number = 0;
  noClutchMode: boolean = true;
  degrees: number = 0;
  rotation: number = 200;
  moveDirection: moveDirection = 0;
  acceleration: boolean = false;
  decceleration: boolean = false;
  itsFlame?: any;
  constructor() {}
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
  wheel: string = ".my-wheel";
  itsFlame: string = ".my-flame";
  className: string = `.car`;
  maxRpm: number = 10000;
  gearShift: undefined | number = undefined;
  noClutchMode: boolean = false;
  fns = {
    useTheEngine(isForced: boolean | undefined = undefined): void {
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
      if (
        !variables.isEngineWorking &&
        variables.action > 0 &&
        !variables.isGamePaused
      ) {
        myCar.gear > 0
          ? alert("Запуск можливий тільки при нейтральнй передачі")
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
          set240msInterval();
          set60msInterval();
        }
      } else if (!variables.isGamePaused && permissions.toOff_engine) {
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
        } else {
          alert("Двигун можна виключити тільки при нейтральній передачі");
        }
      }
    },
    setHtmlCounters(): void {
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
  constructor(rpm: number, maxRpm: number) {
    super();
    this.rpm = rpm;
    this.maxRpm = maxRpm;
  }
  handleBehaviour() {
    if (turns.array.length != 0) {
      if (
        variables.progress != "introduction" &&
        (chapters as any)[variables.progress].changes.startRace
      ) {
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
        let distanceRatio = window.innerHeight / -27;
        let marginLeft;
        if ($(this.className).css("marginLeft") != undefined) {
          marginLeft = Math.round(
            Number(
              $(this.className)
                .css("margin-left")
                .slice(0, $(this.className).css("margin-left").length - 2)
            )
          );
        }
        if (marginLeft / distanceRatio > 5) {
          $(".enemy-position").css({ left: 0, right: "unset" });
          $(".enemy-position").css({
            display: "flex",
            background: "linear-gradient(green, white)",
          });
          $(".enemy-position").text(
            `!${Math.round(marginLeft / distanceRatio)}m`
          );
        } else if (marginLeft > window.innerWidth) {
          let style = {
            right: "unset",
            left:
              window.innerWidth -
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
        } else {
          $(".enemy-position").css({
            display: "none",
          });
        }
      }
    }
  }
}
const myCar = new MyCar(),
  firstRaceCar = new EnemyCar(2000, 8000);
const secondRaceCar = new EnemyCar(4000, 9000);
const finalRaceCar = new EnemyCar(8000, 10000);
const enemyCars = {
  array: [firstRaceCar, secondRaceCar, finalRaceCar],
  index: 0,
};
function set240msInterval() {
  let myCarPosition = 0;
  let car = myCar;
  intervals.universalMoving = setInterval((): void => {
    if (!changes.movingPause && !variables.isGamePaused) {
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
      } else {
        myCarPosition += myCar.spd * (window.innerHeight / 540);
        $(myCar.className).css({
          transition: "240ms linear",
          "margin-left": `${myCarPosition}px`,
        });
      }
      if (
        (chapters as any)[variables.progress].changes.startRace &&
        variables.progress != "introduction"
      ) {
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
    if (
      (chapters as any)[variables.progress].changes.startRace &&
      variables.progress != "introduction"
    ) {
      rpmFunctions.handleAllMoves(enemyCars.array[enemyCars.index]);
    }
  }, 60);
}
export { myCar, firstRaceCar, secondRaceCar, finalRaceCar, enemyCars };
