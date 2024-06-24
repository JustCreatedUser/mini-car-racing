//Сюжет гонки
import { turns } from "./mechanisms/turningFunctions.js";
import { secondaryFunctions } from "./other/secondary.js";
import { music } from "./other/music.js";
import { myCar, enemyCars } from "./mechanisms/cars.js";
import { keyboard } from "./other/keyboard.js";
import {
  intervals,
  variables,
  changes,
  StoryChanges,
  permissions,
} from "./other/variables.js";
var introduction: Intro,
  firstRace: Race,
  secondRace: Race,
  finalRace: Race,
  chapters: object;
class Story {
  changes: StoryChanges;
  everyTip: any;
  constructor(everyTip: any, name: "intro" | "first" | "second" | "final") {
    this.everyTip = everyTip;
    switch (name) {
      case "intro":
        this.changes = changes.introduction;
        break;
      case "first":
        this.changes = changes.firstRace;
        break;
      case "second":
        this.changes = changes.secondRace;
        break;
      case "final":
        this.changes = changes.finalRace;
        break;
    }
  }
  tip(
    guideInfo: string = "",
    elementToPutAShadow: string | undefined = undefined
  ) {
    music.changeVolume(0.5);
    variables.race.style.opacity = ".5";
    variables.guideBlockText.innerText = guideInfo;
    if (this instanceof Race) {
      changes.movingPause = true;
    }
    if (elementToPutAShadow) {
      $(elementToPutAShadow).css({
        boxShadow: "0 0 100vh 100vw black, inset 0 0 15vh 15vh black",
        zIndex: "100",
      });
    }
    variables.action++;
  }
}
class Intro extends Story {
  constructor(everyTip: any, name: "intro" | "first" | "second" | "final") {
    super(everyTip, name);
  }
  beginning() {
    let key: keyof typeof changes;
    for (key in changes) {
      if (changes[key].constructor == StoryChanges) {
        if (changes[key] == changes.introduction) {
          (changes[key] as StoryChanges).getReady(true);
        } else {
          (changes[key] as StoryChanges).getReady();
        }
      }
    }
    $("footer").css({ display: "none", opacity: 0 });
    $("#race").css({
      display: "none",
      transform: "scale(2)",
      transition: "3s cubic-bezier(0.65, 0.05, 0.36, 1)",
      marginLeft: "30vw",
    });
    variables.car.style.marginLeft = "0";
    permissions.toPause = true;
    $("body").css("display", "flex");
    variables.guideBlock.style.opacity = "0";
    const h1 = document.createElement("h1");
    h1.className = "intro-words";
    document.body.append(h1);
    h1.textContent = "Настав час...";
    h1.style.opacity = "0";
    setTimeout(() => {
      h1.style.opacity = "1";
      setTimeout(() => {
        h1.style.opacity = "0";
        setTimeout(() => {
          h1.textContent = "...змагатись за першість...";
          h1.style.opacity = "1";
          setTimeout(() => {
            h1.style.opacity = "0";
            setTimeout(() => {
              h1.remove();
              $("#race").css({ display: "flex" });
              setTimeout(() => {
                $("#race").css({
                  opacity: ".7",
                  transform: "scale(1)",
                  marginLeft: "0",
                });
                $("footer").css({
                  display: variables.device == "computer" ? "flex" : "grid",
                });
                setTimeout(() => {
                  variables.guideBlock.style.opacity = "1";
                  $("footer").css({
                    opacity: "1",
                    transition: "1s",
                  });

                  setTimeout(() => {
                    permissions.toPause = true;
                    $(".pause").css("display", "flex");
                    variables.guideBlock.style.transition =
                      "1s cubic-bezier(0.65, 0.05, 0.36, 1)";
                    introduction.tip(
                      `Зараз треба спішити, бо треба доїхати до зустрічі гонщиків.
                      Спершу - запуск двигуна.` +
                        (variables.device == "computer"
                          ? ` Нажми "${keyboard.engine}" щоб це зробити`
                          : " Всі потрібні кнопки будуть виділятись за потреби, як і ця - нажми на неї."),
                      "#useTheEngine"
                    );
                  }, 2000);
                  variables.action = 0;
                  variables.race.style.transition = "240ms linear";
                }, 3000);
              }, 1000);
            }, 2000);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 1000);
  }
  ending() {
    console.clear();
    introduction.changes.startRace = false;
    $(".gameplay-pause").css("display", "flex");
    variables.guideBlock.style.opacity = "0";
    variables.guideBlockText.innerText = "Mini-car racing";
    variables.race.style.transition = "1s cubic-bezier(0.65, 0.05, 0.36, 1)";
    variables.race.style.opacity = "0";
    setTimeout(() => {
      changes.rewriteEverything ? changes.rewriteEverything() : "";
      permissions.toSaveProgress = true;
      $(".gameplay-pause").css("opacity", "1");
      $("#race").css("display", "none");
      document.body.style.overflowY = "scroll";
    }, 2000);
    music.changeVolume(0.5);
  }
}
class Race extends Story {
  constructor(everyTip: any, name: "intro" | "first" | "second" | "final") {
    super(everyTip, name);
  }
  beginning(someFn: (param: string) => void, append: string, param: string) {
    $(".gameplay-pause").css("display", "none");
    console.clear();
    switch (this) {
      case firstRace:
        let key: keyof typeof changes;
        for (key in changes) {
          if (
            changes[key].constructor == StoryChanges &&
            key != "introduction"
          ) {
            if (changes[key] == changes.firstRace) {
              (changes[key] as StoryChanges).getReady(true);
            } else {
              (changes[key] as StoryChanges).getReady();
            }
          } else if (key == "introduction") {
            changes.introduction.first = true;
            changes.introduction.useBrakesAction = true;
            changes.introduction.gearDownAction = true;
            changes.introduction.reachIntroDestination = true;
          }
        }
        break;
      case secondRace:
        this.changes.getReady(true);
        finalRace.changes.getReady();
        for (const key in changes.firstRace) {
          changes.firstRace[key] = true;
        }
        changes.firstRace.startRace = false;
        changes.introduction.first = true;
        changes.introduction.useBrakesAction = true;
        changes.introduction.gearDownAction = true;
        changes.introduction.reachIntroDestination = true;
        break;
      case finalRace:
        for (const key in changes.firstRace) {
          changes.firstRace[key] = true;
        }
        this.changes.getReady(true);
        secondRace.changes.getReady();
        changes.firstRace.startRace = false;
        changes.introduction.first = true;
        changes.introduction.useBrakesAction = true;
        changes.introduction.gearDownAction = true;
        changes.introduction.reachIntroDestination = true;
        variables.finish = false;
        break;
    }
    $(".bottom-road-box").prepend(append);
    permissions.toPause = false;
    $(".pause").css("display", "none");
    variables.race.style.opacity = "1";
    $(".enemy-position").css("visibility", "hidden");
    $(".turn-position").css("display", "0");
    changes.movingPause = true;
    $("footer").css({
      opacity: 0,
      display: variables.device == "computer" ? "flex" : "grid",
    });
    variables.guideBlock.style.opacity = "0";
    variables.car.style.marginLeft = variables.roadBox.offsetWidth * 3 + "px";
    variables.backgroundPositionX = variables.roadBox.offsetWidth * 3;
    variables.road.style.backgroundPositionX =
      variables.backgroundPositionX + "px";
    variables.road.style.transition = "unset";
    variables.car.style.transition = "unset";
    setTimeout(() => {
      $(".enemy-wheel").css({
        transition: "4s ease-out",
        transform: "rotate(6000deg)",
      });
      $(".enemy-vehicle").css("transform", "rotate(1deg)");
      variables.race.style.transition = "4s ease-out";
      variables.race.style.opacity = ".5";
      variables.raceBackgroundPositionX = -300;
      variables.race.style.backgroundPositionX = "-300px";
      variables.guideBlock.style.opacity = "0";
      variables.car.style.transition = "4s ease-out";
      variables.car.style.marginLeft = "0";
      variables.backgroundPositionX = 0;
      variables.road.style.transition = "4s ease-out";
      variables.road.style.backgroundPositionX = `${variables.backgroundPositionX}`;
      permissions.forMoreRpm = true;
      permissions.setInertiaInterval = true;
      $("footer").css(
        "display",
        variables.device == "computer" ? "flex" : "grid"
      );
      setTimeout(() => {
        variables.car.style.transition = "unset";
        variables.road.style.transition = "240ms linear";
        $("#race").css({
          transform: "scale(1)",
          transition: "1s",
          marginLeft: 0,
        });
        $(".enemy-vehicle").css("transform", "rotate(0deg)");
        $(".enemy-wheel").css({
          transition: "unset",
          transform: "rotate(0deg)",
        });
        $("footer").css("opacity", 1);
        variables.guideBlock.style.opacity = "1";
        someFn(param);
        variables.action = 10;
        $(".enemy-wheel").css({
          transition: "4s ease-out",
          transform: "rotate(6000deg)",
        });
        setTimeout(() => {
          $(".enemy-wheel").css({
            transition: "240ms linear",
            transform: "rotate(0deg)",
          });
          permissions.toPause = true;
          $(".pause").css("display", "flex");
          variables.race.style.transition = "240ms linear";
          changes.movingPause = false;
        }, 1000);
      }, 4000);
    }, 1000);
  }
  startRace() {
    $(".pause").css("display", "none");
    permissions.toPause = false;
    turns.randomize();
    music.changeVolume(0.5);
    $(".continue-game-button").css("display", "none");
    this.tip("ЖЕНИ!");
    changes.movingPause = false;
    let text = document.createElement("h1");
    text.className = "race-counting";
    text.textContent = "3";
    document.body.append(text);
    setTimeout(() => {
      text.textContent = "2";
      setTimeout(() => {
        text.textContent = "1";
        setTimeout(() => {
          variables.race.style.opacity = "0.7";
          this.changes.startRace = true;
          music.changeVolume(1);
          enemyCars.array[enemyCars.index].fns.start();
          enemyCars.array[enemyCars.index].acceleration = true;
          text.remove();
          $(".enemy-position").css("visibility", "visible");
          $(".enemy-position").css("display", "none");
          $(".pause").css("display", "flex");
          permissions.toPause = true;
        }, 1000);
      }, 1000);
    }, 1000);
  }
  comingToFinish() {
    secondaryFunctions.announceFn("Фінішна пряма", () => {
      variables.device != "computer"
        ? $(".phone-counters").css({ zIndex: 11 })
        : "";
      variables.car.style.boxShadow = "-10px 10px 50px 10px yellow ";
      setTimeout(() => {
        variables.$announcement.style.opacity = "1";
        variables.$announcement.style.zIndex = "10";
        setTimeout(() => {
          variables.$announcement.style.opacity = "0";
          variables.$announcement.style.zIndex = "0";
          let entry = false,
            count = 3;
          intervals.finishing = setInterval(() => {
            if (!variables.isGamePaused) {
              switch (count) {
                case 0:
                  variables.$announcement.remove();
                  if (
                    enemyCars.array[enemyCars.index].position >
                    Number(
                      $(myCar.className)
                        .css("margin-left")
                        .slice(
                          0,
                          $(myCar.className).css("margin-left").length - 2
                        )
                    )
                  ) {
                    secondaryFunctions.gameOver(
                      "Ти не приїхав перший. Почитай підсказки-пояснення в меню"
                    );
                  } else {
                    this.ending();
                    variables.finish = true;
                  }
                  variables.device != "computer"
                    ? $(".phone-counters").css({ zIndex: 0 })
                    : "";
                  permissions.toPause = true;
                  $(".pause").css("display", "flex");
                  $(".enemy-position").css("visibility", "hidden");
                  clearInterval(intervals.finishing);
                  return;
                case 1:
                  $(".tunnel").css({
                    left: "30%",
                  });
                  break;
              }
              if (!entry) {
                variables.$announcementText.innerText = `${count}`;
                variables.$announcement.style.opacity = "1";
                variables.$announcement.style.zIndex = "10";
              } else {
                variables.$announcement.style.opacity = "0";
                variables.$announcement.style.zIndex = "0";
                count--;
              }
              entry = !entry;
            }
          }, 1000);
        }, 2000);
      }, 50);
    });
  }
  ending() {
    setTimeout(() => {
      switch (this) {
        case secondRace:
          if (
            variables.totalProgress != "finalRace" &&
            variables.totalProgress != "Everything"
          ) {
            $(".gameplay-headline").text(
              "Вітаю з другою перемогою! (гортай донизу)"
            );
            $(".finalRace-begin img").remove();
            $(".finalRace-begin").css("color", "white");
            $(".completed-parts .parts").append($(".secondRace-begin"));
          }

          break;
        case firstRace:
          if (
            variables.totalProgress != "finalRace" &&
            variables.totalProgress != "secondRace" &&
            variables.totalProgress != "Everything"
          ) {
            $(".gameplay-headline").text(
              "Вітаю з першою перемогою! (гортай донизу)"
            );
            $(".secondRace-begin img").remove();
            $(".secondRace-begin").css("color", "white");
            $(".completed-parts .parts").append($(".firstRace-begin"));
          }

          break;
        case finalRace:
          variables.guideBlock.style.opacity = "0";
          variables.guideBlockText.innerText = "Mini-car racing";
          $("#race").css({ transition: "3s", opacity: 0 });
          setTimeout(() => {
            location.replace(
              "https://mini-car-racing.netlify.app/credits.html"
            );
          }, 2000);
          break;
      }
      switch (this) {
        case secondRace:
        case firstRace:
          this.changes.startRace = false;
          $(".tunnel").css("left", "100%");
          $(".gameplay-pause").css("display", "flex");
          variables.guideBlock.style.opacity = "0";
          variables.guideBlockText.innerText = "Mini-car racing";
          variables.race.style.transition =
            "1s cubic-bezier(0.65, 0.05, 0.36, 1)";
          variables.race.style.opacity = "0";
          setTimeout(() => {
            changes.rewriteEverything ? changes.rewriteEverything() : "";
            if (
              variables.totalProgress != "Everything" &&
              chapters &&
              chapters[variables.totalProgress as keyof typeof chapters]
            ) {
              permissions.toSaveProgress = true;
              $(".save-the-progress-button").css({
                background: "black",
                color: "white",
                borderBottom: "2px solid white",
              });
              $(".save-the-progress-button").text("Зберегти прогрес?");
            }
            variables.finish = false;
            $(".gameplay-pause").css("opacity", "1");
            $("#race").css("display", "none");
            document.body.style.overflowY = "scroll";
          }, 2000);
          music.changeVolume(0.5);
          break;
      }
    }, 1000);
    turns.array = [];
    turns.isRightNow = false;
    $(".enemy-car").remove();
  }
  startTurning() {
    myCar.acceleration = false;
    $(".continue-game-button").css("display", "none");
    this.tip(`Тормози до ${turns.array[turns.index].maxSpeed}km/h!`);
    $(".turn-speed").text(`${turns.array[turns.index].maxSpeed}km/h`);
    changes.movingPause = false;
    variables.race.style.opacity = "0.7";
    let distance =
      turns.array[turns.index].distanceToIt * variables.distanceRatio;
    let position = variables.backgroundPositionX + distance;
    music.changeVolume(1);
    intervals.turnComing = setInterval(() => {
      if (turns.array.length != 0) {
        if (
          variables.backgroundPositionX < position &&
          turns.isRightNow == "almost"
        ) {
          variables.guideBlockText.innerText = `ЛІМІТ: ${
            turns.array[turns.index].maxSpeed
          } KM/H`;
          turns.start();
          turns.isRightNow = true;
          $(".turn-position").css("display", "none");
          clearInterval(intervals.turnComing);
        }
        if (myCar.spd < turns.array[turns.index].maxSpeed) {
          $(".turn-speed").css("background", "linear-gradient(green,white)");
        } else {
          $(".turn-speed").css("background", "linear-gradient(red,white)");
        }
        if (changes.firstRace.continueFirstTurnExplanation) {
          $(".turn-distance").text(
            Math.round(
              (position - variables.backgroundPositionX) /
                variables.distanceRatio
            ) + "m"
          );
        }
      }
    }, 100);
  }
}
introduction = new Intro(
  {
    engine() {
      if (variables.action > 0) {
        $("#useTheEngine").css({ boxShadow: "unset", zIndex: 0 });
        music.changeVolume(1);
        variables.race.style.opacity = ".7";
        variables.guideBlockText.innerText = "Добре!";
        setTimeout(() => {
          introduction.tip(
            `Далі підніми обороти двигуна хоча б до 6200. Для цього зажми ` +
              (variables.device == "computer"
                ? `"${keyboard.accelerate}" на клавіатурі і тримай,`
                : " виділену кнопку,") +
              ` а  графік оборотів є зліва ` +
              (variables.device == "computer" ? `знизу.` : " по центру."),
            "#accelerationPedal"
          );
          permissions.forMoreRpm = true;
          myCar.noClutchMode = true;
        }, 2000);
      }
    },
    gearUpExplanation() {
      if (variables.action == 2 && changes.introduction.first == true) {
        myCar.noClutchMode = false;
        introduction.tip(
          `Щоб рушити треба переключити передачу вгору, тому нажми ` +
            (variables.device == "computer"
              ? `"${keyboard.gearUp}".`
              : "стрілку вгору."),
          "#gearUpButton"
        );
      }
    },
    inMoreRpm() {
      if (
        myCar.rpm < 6000 &&
        variables.action === 2 &&
        !changes.introduction.first
      ) {
        changes.introduction.first = true;
        music.changeVolume(1);
        variables.race.style.opacity = ".7";
        $("#accelerationPedal").css({ boxShadow: "unset", zIndex: 0 });
      }
    },
    inLessRpm() {
      if (variables.action === 4 && !changes.introduction.useBrakesAction) {
        changes.introduction.IntroDestionationPause = false;
        changes.introduction.useBrakesAction = true;
        changes.movingPause = false;
        variables.race.style.opacity = ".7";
        $("#deccelerationPedal").css({ boxShadow: "unset", zIndex: 0 });
        permissions.forInertia = true;
      } else if (variables.action == 6) {
        changes.movingPause = false;
        permissions.forInertia = true;
        variables.race.style.opacity = ".7";
      }
      music.changeVolume(1);
      if (myCar.rpm < 3000 && !changes.introduction.gearDownAction) {
        myCar.noClutchMode = false;
        introduction.tip(
          `Останні штрихи: переключи передачу вниз ${
            variables.device == "computer"
              ? `клавішою "${keyboard.gearDown}"`
              : " цією стрілкою"
          }. Увага: передачу вниз переключай, КОЛИ ОБОРОТИ МЕНШІ ЗА 6000`,
          "#gearDownButton"
        );
        changes.introduction.gearDownAction = true;
        changes.movingPause = true;
        myCar.noClutchMode = false;
        music.changeVolume(0.5);
      }
    },
    reachTheTarget() {
      if (
        variables.action === 3 &&
        variables.backgroundPositionX <
          (variables.device == "phone" ? -20000 / 1.54 : -20000) &&
        !changes.introduction.reachIntroDestination
      ) {
        music.changeVolume(0.5);
        changes.introduction.reachIntroDestination = true;
        changes.movingPause = true;
        introduction.tip(
          `Ти майже приїхав, пора тормозити! Зажми ${
            variables.device == "computer"
              ? `"${keyboard.deccelerate}"`
              : "тормоз"
          }.`,
          "#deccelerationPedal"
        );
        permissions.forInertia = false;
        permissions.forMoreRpm = false;
        permissions.forLessRpm = true;
        clearTimeout(variables.startInertiaMechanismTimeout);
      }
    },
    accelerationExplanation() {
      if (variables.action == 3) {
        music.changeVolume(1);
        variables.race.style.opacity = ".7";
        $("#gearUpButton").css({ boxShadow: "unset", zIndex: 0 });
        variables.guideBlockText.innerText = `Чудово! Тепер, щоб доїхати до першої гонки, піднімай обороти і переключай передачі за допомогою ${
          variables.device == "computer"
            ? `"${keyboard.accelerate}" і "${keyboard.gearUp}"`
            : "газу і стрілки вгору"
        }.`;
      }
    },
    deccelerationExplanation() {
      if (variables.action == 5 && myCar.gear == 1) {
        music.changeVolume(0.5);
        introduction.tip(
          `Зараз, коли передача є першою, а тобі треба зупинитись, притормози до меншої за 20 км/год швидкості ${
            variables.device == "computer"
              ? `кнопкою "${keyboard.deccelerate}" (більше не нагадуватиму)`
              : ""
          }, переключи передачу вниз і тоді заглуши двигун${
            variables.device == "computer"
              ? ` з кнопкою "${keyboard.engine}", якщо не забув).`
              : "."
          }`
        );
        changes.movingPause = true;
        permissions.forInertia = false;
        permissions.toOff_engine = true;
      }
    },
    gearDownExplanation() {
      music.changeVolume(1);
      if (changes.movingPause) {
        changes.movingPause = false;
        variables.race.style.opacity = ".7";
        variables.guideBlockText.innerText = `Як ти вже побачив - коробка передач - ${
          variables.device == "computer"
            ? `справа в центрі спідометру`
            : "зліва від тахометра (обороти)"
        }, тому, з огляду на неї, переключи передачі вниз аж до першої.`;
        $("#gearDownButton").css({ boxShadow: "unset", zIndex: 0 });
      }
    },
  },
  "intro"
);
firstRace = new Race(
  {
    engine() {
      variables.race.style.opacity = "0.7";
      music.changeVolume(1);
      variables.guideBlockText.textContent =
        "Готуйся! Набери обороти, а коли натиснеш на цю кнопку → , то запустиш відлік до початку гонки. Коли відлік закінчиться - ПЕРЕКЛЮЧАЙ ПЕРЕДАЧУ ВГОРУ І ЖЕНИ";
      $(".continue-game-button").css("display", "flex");
      changes.movingPause = false;
    },
    continueTurnExplanation() {
      $(".continue-game-button").text("Готовий?");
      firstRace.tip(
        `Справа на дорозі буде показник дистанції, через яку буде поворот, і швидкість, до якої треба затормозити. Якщо ти не відтормозишся достатньо або розженешся під часу повороту  - тебе винесе з дороги і ти програєш. Натискай на кнопку і їдь!`
      );
    },
  },
  "first"
);
secondRace = new Race(
  {
    engine() {
      $(".continue-game-button").css("display", "flex");
      variables.race.style.opacity = "1";
      permissions.forMoreRpm = true;
      permissions.forLessRpm = true;
      myCar.noClutchMode = true;
    },
  },
  "second"
);
finalRace = new Race(
  {
    engine() {
      $(".continue-game-button").css("display", "flex");
      variables.race.style.opacity = "1";
      permissions.forMoreRpm = true;
      permissions.forLessRpm = true;
      myCar.noClutchMode = true;
    },
  },
  "final"
);
chapters = {
  introduction: introduction,
  firstRace: firstRace,
  secondRace: secondRace,
  finalRace: finalRace,
};
export { introduction, firstRace, secondRace, finalRace, chapters };
