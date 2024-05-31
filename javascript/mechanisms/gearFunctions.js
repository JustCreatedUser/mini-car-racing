//Функції по перемиканню передач авто
"use strict";
import { myCar } from "../mechanisms/cars.js";
import { rpmFunctions } from "../mechanisms/rpmFunctions.js";
import { chapters, introduction } from "../story.js";
export const gearFunctions = {
  up: {
    gearUp: (car = myCar) => {
      let currentRpm = Math.round(car.spd / car.gearMultiplier);
      if (currentRpm > 800) {
        switch (car) {
          case myCar:
            let averageRpmDiminishing = Math.round(
              (myCar.rpm - currentRpm) / 10
            );
            $(".rpm-counter").css({
              transition: ".5s",
              transform: `rotate(${currentRpm * 0.027 - 45})`,
            });
            intervals.rpmDecreaseAnimation = setInterval(() => {
              myCar.rpm -= averageRpmDiminishing;
              myCar.fns.setHtmlCounters();
            }, 50);
            myCar.gearShift = setTimeout(() => {
              clearInterval(intervals.rpmDecreaseAnimation);
              myCar.noClutchMode = true;
              if (myCar.acceleration) {
                myCar.moveDirection = "acceleration";
              } else if (myCar.decceleration) {
                myCar.moveDirection = "decceleration";
              }
              $(".rpm-counter").css("transition", "60ms");
            }, 500);
            $(".gear-counter").html(myCar.gear);
            rpmFunctions.setHtmlColor(2);
            break;

          default:
            car.rpm = currentRpm;
            setTimeout(() => {
              car.noClutchMode = true;
              if (car.acceleration) {
                car.moveDirection = "acceleration";
              } else if (car.decceleration) {
                car.moveDirection = "decceleration";
              }
            }, 500);
            break;
        }
      } else {
        car.rpm = 800;
        car.spd = car.rpm * car.gearMultiplier;
        car.fns.setHtmlCounters();
        $(".gear-counter").html(car.gear);
        car.noClutchMode = true;
      }
    },
    startMoving: (car = myCar) => {
      let currentRpm = car.rpm / 4 > 800 ? car.rpm / 4 : 800;
      switch (progress) {
        case "introduction":
          changes.introduction.startRace = true;
          break;
      }
      switch (car) {
        case myCar:
          $(".rpm-counter").css({
            transition: "0.5s",
            transform: `rotate(${currentRpm * 0.027 - 45})`,
          });
          let averageRpmDiminishing = Math.round((car.rpm - currentRpm) / 10);
          if (car == myCar) {
            intervals.rpmDecreaseAnimation = setInterval(() => {
              myCar.rpm -= averageRpmDiminishing;
              $(".rpm-counter-number").html(`${myCar.rpm}RPM`);
              myCar.fns.setHtmlCounters();
            }, 50);
          }

          setTimeout(() => {
            $(".rpm-counter").css("transition", "60ms");
            if (car == myCar) {
              clearInterval(intervals.rpmDecreaseAnimation);
            }
            car.spd = Math.round(car.gearMultiplier * car.rpm);
            $(".speed-counter-number").html(`${car.spd}KM/H`);
            myCar.noClutchMode = true;
            if (car.acceleration) {
              car.moveDirection = "acceleration";
            } else if (car.decceleration) {
              car.moveDirection = "decceleration";
            }
          }, 500);
          rpmFunctions.setHtmlColor(2);
          $(".gear-counter").html(myCar.gear);
          break;
        default:
          car.rpm = currentRpm;
          setTimeout(() => {
            car.noClutchMode = true;
            if (car.acceleration) {
              car.moveDirection = "acceleration";
            } else if (car.decceleration) {
              car.moveDirection = "decceleration";
            }
          }, 500);
          break;
      }
    },
    callOtherFunctions: (car = myCar) => {
      if (car.gear !== 1) {
        gearFunctions.up.gearUp(car);
      } else {
        gearFunctions.up.startMoving(car);
        switch (progress) {
          case "introduction":
            introduction.everyTip.accelerationExplanation();
            break;

          case "firstRace":
            break;
        }
      }
    },
    mechanism: (car = myCar) => {
      if (car.gear !== 5 && action > 2 && !isGamePaused) {
        if (
          progress != "introduction" &&
          !chapters[progress].changes.startRace
        ) {
          return;
        }
        switch (car) {
          case myCar:
            clearInterval(intervals.rpmIncreaseAnimation);
            clearTimeout(myCar.gearShift);
            clearInterval(intervals.rpmDecreaseAnimation);
            break;

          default:
            break;
        }

        car.noClutchMode = false;
        car.moveDirection = 0;
        $(`${car.className} .vehicle`).css("transform", "rotate(0)");
        gearFunctions.gearMultiplierSetting(2, car);
        gearFunctions.up.callOtherFunctions(car);
        car.exhaust();
      }
    },
  },
  down: {
    mechanism: (car = myCar) => {
      if (action > 4 && !isGamePaused) {
        if (car == myCar) {
          clearInterval(intervals.rpmDecreaseAnimation);
          clearInterval(intervals.rpmIncreaseAnimation);
          clearTimeout(myCar.gearShift);
        }
        car.noClutchMode = false;
        car.moveDirection = 0;
        $(`${car.className} .vehicle`).css("transform", "rotate(0)");
        car.exhaust();
        gearFunctions.gearMultiplierSetting(1, car);
        gearFunctions.down.callOtherFunctions(car);
        switch (progress) {
          case "introduction":
            introduction.everyTip.deccelerationExplanation();
            break;
        }
      }
    },
    callOtherFunctions: (car) => {
      if (hasChanged) {
        gearFunctions.down.gearDown(car);
        switch (progress) {
          case "introduction":
            introduction.everyTip.gearDownExplanation();
            break;

          case "firstRace":
            break;
        }
      } else {
        if (car == myCar && myCar.spd < 20) {
          gearFunctions.down.endMoving(car);
        } else if (car == myCar) {
          alert("Нейтральна передача вмикається тільки на швидкості <20 px/s");
        }
        car.noClutchMode = true;
      }
    },
    endMoving: (car) => {
      car.gear = 0;
      car.gearMultiplier = 0;
      car.spd = 0;
      switch (car) {
        case myCar:
          myCar.fns.setHtmlCounters();
          $(".gear-counter").html("N");
          break;
      }
    },
    gearDown: (car) => {
      let currentRpm = Math.round(car.spd / car.gearMultiplier);
      if (currentRpm < car.maxRpm) {
        let averageRpmIncrease = Math.round((currentRpm - car.rpm) / 10);
        switch (car) {
          case myCar:
            intervals.rpmIncreaseAnimation = setInterval(() => {
              myCar.rpm += averageRpmIncrease;
              switch (car) {
                case myCar:
                  rpmFunctions.setHtmlColor(2);
                  myCar.fns.setHtmlCounters();
                  $(".rpm-counter-number").html(`${myCar.rpm}RPM`);
                  break;
              }
            }, 50);
            myCar.gearShift = setTimeout(() => {
              if (car == myCar) {
                clearInterval(intervals.rpmIncreaseAnimation);
              }
              myCar.noClutchMode = true;
              if (myCar.acceleration) {
                myCar.moveDirection = "acceleration";
              } else if (myCar.decceleration) {
                myCar.moveDirection = "decceleration";
              }
            }, 510);
            break;

          default:
            setTimeout(() => {
              car.noClutchMode = true;
              if (car.acceleration) {
                car.moveDirection = "acceleration";
              } else if (car.decceleration) {
                car.moveDirection = "decceleration";
              }
            }, 510);
            break;
        }
      } else {
        car.rpm = car.maxRpm;
        car.spd = car.rpm * car.gearMultiplier;
        car.noClutchMode = true;
      }
      switch (car) {
        case myCar:
          $(".gear-counter").html(myCar.gear);
          break;
      }
    },
  },
  gearMultiplierSetting: (direction, car = myCar) => {
    switch (direction) {
      case 1:
        if (car.gear > 1) {
          car.gear--;
          hasChanged = true;
        } else {
          hasChanged = false;
        }
        switch (car.gear) {
          case 1:
            car.gearMultiplier = 0.013;
            break;
          case 2:
            car.gearMultiplier = 0.018;
            break;
          case 3:
            car.gearMultiplier = 0.021;
            break;
          case 4:
            car.gearMultiplier = 0.025;
            break;
        }
        break;
      case 2:
        car.gear++;
        switch (car.gear) {
          case 1:
            car.gearMultiplier = 0.013;
            break;
          case 2:
            car.gearMultiplier = 0.018;
            break;
          case 3:
            car.gearMultiplier = 0.021;
            break;
          case 4:
            car.gearMultiplier = 0.025;
            break;
          case 5:
            car.gearMultiplier = 0.028;
            break;
        }
        break;
    }
  },
};
