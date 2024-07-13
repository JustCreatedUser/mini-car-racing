//Оголошення всіх змінних, щоб не вистрілювали ерори!
interface IstoryChanges {
  [key: string]: Function | boolean;
}
type CurrentChanges = {
  [key: string]: boolean;
};
export class StoryChanges implements IstoryChanges {
  [key: string]: Function | boolean;
  constructor(obj: CurrentChanges) {
    for (const key in obj) {
      this[key] = obj[key];
    }
  }
  getReady(changeWeather = false): void {
    for (const key in this) {
      (this[key] as any) = false;
    }
    if (changeWeather) {
      switch (this) {
        case changes.introduction:
        case changes.firstRace:
          variables.race.style.backgroundImage =
            "url(./icons-and-images/background-images/rain.webp)";
          variables.road.style.backgroundImage =
            "url(./icons-and-images/roads/rain.webp)";
          $(".car .vehicle").attr(
            "src",
            "./icons-and-images/cars/myCar-lightened.webp"
          );
          break;
        case changes.secondRace:
          variables.race.style.backgroundImage =
            "url(./icons-and-images/background-images/day.webp)";
          variables.road.style.backgroundImage =
            "url(./icons-and-images/roads/day.webp)";
          $(".car .vehicle").attr(
            "src",
            "./icons-and-images/cars/myCarDay.webp"
          );
          break;
        case changes.finalRace:
          variables.race.style.backgroundImage =
            "url(./icons-and-images/background-images/night.webp)";
          variables.road.style.backgroundImage =
            "url(./icons-and-images/roads/night.webp)";
          $(".car .vehicle").attr(
            "src",
            "./icons-and-images/cars/myCar-lightened.webp"
          );
          break;
      }
    }
  }
}
export type Device = undefined | "mouse" | "phone" | "computer";
interface Intervals {
  [key: string]: undefined | number;
}
export const variables: Ivariables = {
    language: undefined,
    guideBlockText: document.querySelector(".logo"),
    guideBlock: document.querySelector("header"),
    road: document.querySelector(".road"),
    race: document.getElementById("race"),
    roadBox: document.querySelector(".bottom-road-box"),
    car: document.querySelector(".car"),
    finish: false,
    device: undefined,
    distanceRatio: window.innerHeight / -27,
    turnValue: 0,
    additionalMarginForTurn: 0,
    choosingKeysMode: false,
    keyToChoose: undefined,
    $announcement: $('<div class="announcement"></div>')[0],
    $announcementText: $('<h1 class="veryLargeText"></h1>')[0],
    totalProgress: "introduction",
    startInertiaMechanismTimeout: undefined,
    hasChanged: undefined,
    action: 0,
    isEngineWorking: false,
    raceBackgroundPositionX: 0,
    backgroundPositionX: 0,
    flame: undefined,
    isGamePaused: false,
    currentWindows: "race",
    progress: "introduction",
  },
  permissions: Ipermissions = {
    forLessRpm: false,
    forMoreRpm: false,
    forInertia: false,
    toOff_engine: false,
    toSaveProgress: false,
    setInertiaInterval: true,
    toCheat: true,
    toPause: false,
  },
  intervals: Intervals = {
    turnComing: undefined,
    universalMoving: undefined,
    inertia: undefined,
    everyCarMove: undefined,
    rpmIncreaseAnimation: undefined,
    rpmDecreaseAnimation: undefined,
    finishing: undefined,
  },
  changes: Ichanges = {
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
interface Ipermissions {
  [key: string]: boolean;
}
interface Ichanges {
  movingPause: boolean;
  introduction: StoryChanges;
  firstRace: StoryChanges;
  secondRace: StoryChanges;
  finalRace: StoryChanges;
  rewriteEverything?: () => void;
}
export type TotalProgress =
  | "firstRace"
  | "introduction"
  | "secondRace"
  | "finalRace"
  | "Everything";
type Keys =
  | "accelerate"
  | "deccelerate"
  | "gearUp"
  | "gearDown"
  | "goToMenu"
  | "listenMusic"
  | "engine";

interface Ivariables {
  guideBlockText: HTMLElement;
  guideBlock: HTMLElement;
  road: HTMLElement;
  race: HTMLElement;
  roadBox: HTMLElement;
  car: HTMLElement;
  finish: boolean;
  device: undefined | "mouse" | "phone" | "computer";
  distanceRatio: number;
  turnValue: number;
  additionalMarginForTurn: number;
  choosingKeysMode: boolean;
  keyToChoose: Keys | undefined;
  $announcement: HTMLElement;
  $announcementText: HTMLElement;
  totalProgress: TotalProgress;
  startInertiaMechanismTimeout: undefined | number;
  hasChanged: undefined | boolean;
  action: number;
  isEngineWorking: boolean;
  raceBackgroundPositionX: number;
  backgroundPositionX: number;
  flame: undefined | number;
  isGamePaused: boolean;
  currentWindows: string;
  progress: "firstRace" | "introduction" | "secondRace" | "finalRace";
  language: "ukrainian" | "english" | undefined;
}
