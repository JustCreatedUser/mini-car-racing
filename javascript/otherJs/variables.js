//Оголошення всіх змінних, щоб не вистрілювали ерори
"use strict";
class StoryChanges {
  constructor(obj) {
    for (const key in obj) {
      this[key] = obj[key];
    }
  }
  getReady(changeWeather = false) {
    for (const key in this) {
      this[key] = false;
    }
    if (changeWeather) {
      switch (this) {
        case changes.introduction:
        case changes.firstRace:
          race.style.backgroundImage =
            "url(./icons-and-images/background-images/rain.jpg)";
          road.style.backgroundImage = "url(./icons-and-images/roads/rain.png)";
          $(".car .vehicle").attr(
            "src",
            "./icons-and-images/cars/myCar-lightened.png"
          );
          break;

        case changes.secondRace:
          race.style.backgroundImage =
            "url(./icons-and-images/background-images/day.jpg)";
          road.style.backgroundImage = "url(./icons-and-images/roads/day.png)";
          $(".car .vehicle").attr(
            "src",
            "./icons-and-images/cars/myCarDay.png"
          );
          break;
        case changes.finalRace:
          race.style.backgroundImage =
            "url(./icons-and-images/background-images/night.jpg)";
          road.style.backgroundImage =
            "url(./icons-and-images/roads/night.png)";
          $(".car .vehicle").attr(
            "src",
            "./icons-and-images/cars/myCar-lightened.png"
          );
          break;
      }
    }
  }
}
let guideBlockText = document.querySelector(".logo"),
  guideBlock = document.querySelector("header"),
  road = document.querySelector(".road"),
  roadBox = document.querySelector(".bottom-road-box"),
  car = document.querySelector(".car"),
  finish = false,
  device = undefined,
  introduction,
  distanceRatio = window.innerHeight / -27,
  firstRace,
  turnValue = 0,
  additionalMarginForTurn = 0,
  secondRace,
  finalRace,
  choosingKeysMode = false,
  keyToChoose = undefined,
  announcement,
  announcementText,
  totalProgress = "introduction",
  startInertiaMechanismTimeout,
  hasChanged = undefined,
  action = 0,
  isEngineWorking = false,
  raceBackgroundPositionX = 0,
  backgroundPositionX = 0,
  flame,
  isGamePaused = false,
  progress = "introduction",
  permissions = {
    forLessRpm: false,
    forMoreRpm: false,
    forInertia: false,
    toOff_engine: false,
    toSaveProgress: false,
    setInertiaInterval: true,
    toCheat: true,
    toPause: false,
  },
  intervals = {
    turnComing: undefined,
    universalMoving: undefined,
    inertia: undefined,
    everyCarMove: undefined,
    rpmIncreaseAnimation: undefined,
    rpmDecreaseAnimation: undefined,
    finishing: undefined,
  },
  changes = {
    movingPause: false,
    introduction: new StoryChanges({
      first: true,
      startRace: false,
      useBrakesAction: false,
      IntroDestionationPause: false,
      gearDownAction: false,
      reachIntroDestination: false,
    }),
    firstRace: new StoryChanges({
      startRace: false,
      continueFirstTurnExplanation: false,
      firstTurnExplanation: false,
    }),
    secondRace: new StoryChanges({
      startRace: false,
      allowedToTurn: false,
    }),
    finalRace: new StoryChanges({
      startRace: false,
      allowedToTurn: false,
    }),
  };
