//Сюжет гонки
import { turns, announceFn } from "./mechanisms/turningFunctions.js";
import { gameOver } from "./otherJs/secondary.js";
import { music } from "./otherJs/music.js";
import { myCar, enemyCars } from "./mechanisms/cars.js";
import { keyboard } from "./otherJs/keyboard.js";
var introduction, firstRace, secondRace, finalRace, chapters;
class Story {
  constructor(everyTip, name) {
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
  tip(guideInfo = "") {
    music.changeVolume(0.5);
    wrap.style.opacity = ".5";
    guideBlockText.innerText = guideInfo;
    if (this != introduction) {
      changes.movingPause = true;
    }

    action++;
  }
}
class Intro extends Story {
  constructor(everyTip, name) {
    super(everyTip, name);
  }
  beginning() {
    console.clear();
    for (const key in changes) {
      if (changes[key].constructor == StoryChanges) {
        if (changes[key] == changes.introduction) {
          changes[key].getReady(true);
        } else {
          changes[key].getReady();
        }
      }
    }
    $("footer").css({ display: "none", opacity: 0 });
    $("#wrap").css({
      display: "none",
      transform: "scale(2)",
      transition: "3s cubic-bezier(0.65, 0.05, 0.36, 1)",
      marginLeft: "30vw",
    });
    car.style.marginLeft = 0;
    permissions.toPause = true;
    $("body").css("display", "flex");
    guideBlock.style.opacity = 0;
    const h1 = document.createElement("h1");
    h1.className = "intro-words";
    document.body.append(h1);
    h1.textContent = "Настав час...";
    h1.style.opacity = 0;
    setTimeout(() => {
      h1.style.opacity = 1;
      setTimeout(() => {
        h1.style.opacity = 0;
        setTimeout(() => {
          h1.textContent = "...змагатись за першість...";
          h1.style.opacity = 1;
          setTimeout(() => {
            h1.style.opacity = 0;
            setTimeout(() => {
              h1.remove();
              $("#wrap").css({ display: "flex" });
              setTimeout(() => {
                $("#wrap").css({
                  opacity: ".7",
                  transform: "scale(1)",
                  marginLeft: "0",
                });
                $("footer").css({ display: "flex" });
                setTimeout(() => {
                  guideBlock.style.opacity = "1";
                  $("footer").css({ opacity: "1", transition: "1s" });

                  setTimeout(() => {
                    permissions.toPause = true;
                    $(".pause").css("display", "flex");
                    guideBlock.style.transition =
                      "1s cubic-bezier(0.65, 0.05, 0.36, 1)";
                    introduction.tip(`Зараз треба спішити, бо треба доїхати до зустрічі гонщиків.
                      Спершу - запуск двигуна. Нажми "${keyboard.engine}" щоб це зробити`);
                  }, 2000);
                  action = 0;
                  wrap.style.transition = "240ms linear";
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
    introduction.startRace = false;
    $(".gameplay-pause").css("display", "flex");
    guideBlock.style.opacity = "0";
    guideBlockText.innerText = "Mini-car racing";
    wrap.style.transition = "1s cubic-bezier(0.65, 0.05, 0.36, 1)";
    wrap.style.opacity = "0";
    setTimeout(() => {
      changes.rewriteEverything();
      permissions.toSaveProgress = true;
      $(".gameplay-pause").css("opacity", "1");
      $("#wrap").css("display", "none");
      document.body.style.overflowY = "scroll";
    }, 2000);
    music.changeVolume(0.5);
  }
}
class Race extends Story {
  constructor(everyTip, name) {
    super(everyTip, name);
  }
  beginning(someFn = () => {}, append) {
    $(".gameplay-pause").css("display", "none");
    console.clear();
    switch (this) {
      case firstRace:
        for (const key in changes) {
          if (
            changes[key].constructor == StoryChanges &&
            key != "introduction"
          ) {
            if (changes[key] == changes.firstRace) {
              changes[key].getReady(true);
            } else {
              changes[key].getReady();
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
        finish = false;
        break;
    }
    $(".bottom-road-box").prepend(append);
    permissions.toPause = false;
    $(".pause").css("display", "none");
    wrap.style.opacity = 1;
    $(".enemy-position").css("visibility", "hidden");
    $(".turn-position").css("display", "0");
    changes.movingPause = true;
    $("footer").css({ opacity: 0, display: "flex" });
    guideBlock.style.opacity = "0";
    car.style.marginLeft = roadBox.offsetWidth * 3 + "px";
    backgroundPositionX = roadBox.offsetWidth * 3;
    road.style.backgroundPositionX = backgroundPositionX + "px";
    road.style.transition = "unset";
    car.style.transition = "unset";
    setTimeout(() => {
      $(".enemy-wheel").css({
        transition: "4s ease-out",
        transform: "rotate(6000deg)",
      });
      $(".enemy-vehicle").css("transform", "rotate(1deg)");
      wrap.style.transition = "4s ease-out";
      wrap.style.opacity = ".5";
      wrapBackgroundPositionX = -300;
      wrap.style.backgroundPositionX = "-300px";
      guideBlock.style.opacity = "0";
      car.style.transition = "4s ease-out";
      car.style.marginLeft = 0;
      backgroundPositionX = 0;
      road.style.transition = "4s ease-out";
      road.style.backgroundPositionX = backgroundPositionX;
      permissions.forMoreRpm = true;
      permissions.setInertiaInterval = true;
      $("footer").css("display", "flex");
      setTimeout(() => {
        car.style.transition = "unset";
        road.style.transition = "240ms linear";
        $("#wrap").css({
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
        guideBlock.style.opacity = 1;
        someFn();
        action = 10;
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
          wrap.style.transition = "240ms linear";
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
          wrap.style.opacity = 0.7;
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
    announceFn("Фінішна пряма", () => {
      setTimeout(() => {
        announcement.style.opacity = 1;
        announcement.style.zIndex = 10;
        setTimeout(() => {
          announcement.style.opacity = 0;
          announcement.style.zIndex = 0;
          let entry = false;
          let count = 3;
          intervals.finishing = setInterval(() => {
            if (!isGamePaused) {
              switch (count) {
                case 0:
                  announcement.remove();
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
                    gameOver(
                      "Ти не приїхав перший. Почитай підсказки-пояснення в меню"
                    );
                  } else {
                    this.ending();
                    finish = true;
                  }
                  permissions.toPause = true;
                  $(".pause").css("display", "flex");
                  $(".enemy-position").css("visibility", "hidden");
                  clearInterval(intervals.finishing);
                  return;
                case 1:
                  $(".tunnel").css({ right: 0 });
                  break;
              }
              if (!entry) {
                announcementText.innerText = count;
                announcement.style.opacity = 1;
                announcement.style.zIndex = 10;
              } else {
                announcement.style.opacity = 0;
                announcement.style.zIndex = 0;
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
          if (totalProgress != "finalRace" && totalProgress != "Everything") {
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
            totalProgress != "finalRace" &&
            totalProgress != "secondRace" &&
            totalProgress != "Everything"
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
          $(".gameplay-headline").text(
            "Як швидко минає час... Нижче можна скинути прогрес."
          );
          guideBlock.style.opacity = "0";
          guideBlockText.innerText = "Mini-car racing";
          $("#wrap").css({ transition: "3s", opacity: 0 });
          $(".completed-parts .parts").append($(".finalRace-begin"));
          $(".uncompleted-parts h3").text("Вже все пройдено...");
          if (document.querySelector(".uncompleted-parts button") == null) {
            $(".uncompleted-parts").append(
              `<button>Скинути прогрес і перезавантажитись?</button>`
            );
          }
          $(".titres").css({ display: "grid" });
          setTimeout(() => {
            wrap.style.display = "none";
            $(".titres").css({ opacity: 1 });
            document.body.style.overflowY = "scroll";
            changes.rewriteEverything();
            $(".save-the-progress-button").css({
              background: "black",
              color: "white",
              borderBottom: "2px solid white",
            });
            $(".save-the-progress-button").text("Зберегти прогрес?");
            permissions.toSaveProgress = true;
            $(".tunnel").css("right", "-65%");
            setTimeout(AOS.init, 500);
            setTimeout(() => {
              let page = window.document.documentElement,
                position = page.scrollTop;

              let scrolling = setInterval(() => {
                let expression =
                  document.documentElement.offsetHeight == window.innerHeight
                    ? window.document.documentElement.scrollHeight -
                      window.innerHeight
                    : document.documentElement.offsetHeight -
                      window.innerHeight;
                if (
                  position != page.scrollTop ||
                  page.scrollTop == expression
                ) {
                  clearInterval(scrolling);
                }
                position += 2;
                window.scroll({
                  top: page.scrollTop + 2,
                  behavior: "instant",
                });
              }, 10);
            }, 1000);
          }, 2000);
          break;
      }
      switch (this) {
        case secondRace:
        case firstRace:
          this.changes.startRace = false;
          $(".tunnel").css("right", "-65%");
          $(".gameplay-pause").css("display", "flex");
          guideBlock.style.opacity = "0";
          guideBlockText.innerText = "Mini-car racing";
          wrap.style.transition = "1s cubic-bezier(0.65, 0.05, 0.36, 1)";
          wrap.style.opacity = "0";
          setTimeout(() => {
            changes.rewriteEverything();
            if (
              totalProgress != "Everything" &&
              chapters[totalProgress] == this
            ) {
              permissions.toSaveProgress = true;
              $(".save-the-progress-button").css({
                background: "black",
                color: "white",
                borderBottom: "2px solid white",
              });
              $(".save-the-progress-button").text("Зберегти прогрес?");
            }
            finish = false;
            $(".gameplay-pause").css("opacity", "1");
            $("#wrap").css("display", "none");
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
    wrap.style.opacity = 0.7;
    let distance = turns.array[turns.index].distanceToIt * -40;
    let position = backgroundPositionX + distance;
    music.changeVolume(1);
    intervals.turnComing = setInterval(() => {
      if (turns.array.length != 0) {
        if (backgroundPositionX < position && turns.isRightNow == "almost") {
          guideBlockText.innerText = `ЛІМІТ: ${
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
        $(".turn-distance").text(
          Math.round((position - backgroundPositionX) / -40) + "m"
        );
      }
    }, 100);
  }
}
introduction = new Intro(
  {
    engine: () => {
      if (action > 0) {
        music.changeVolume(1);
        wrap.style.opacity = ".7";
        guideBlockText.innerText = "Добре!";
        setTimeout(() => {
          introduction.tip(
            `Далі підніми обороти двигуна хоча б до 6200. Для цього зажми "${keyboard.accelerate}" на клавіатурі і тримай, а  графік оборотів є зліва знизу.`
          );
          permissions.forMoreRpm = true;
          myCar.noClutchMode = true;
        }, 2000);
      }
    },
    gearUpExplanation: () => {
      if (action == 2 && changes.introduction.first == true) {
        myCar.noClutchMode = false;
        introduction.tip(
          `Щоб рушити треба переключити передачу вгору, тому нажми "${keyboard.gearUp}".`
        );
      }
    },
    inMoreRpm: () => {
      if (myCar.rpm < 6000 && action === 2 && !changes.introduction.first) {
        changes.introduction.first = true;
        music.changeVolume(1);
        wrap.style.opacity = ".7";
      }
    },
    inLessRpm: () => {
      if (action === 4 && !changes.introduction.useBrakesAction) {
        changes.introduction.IntroDestionationPause = false;
        changes.introduction.useBrakesAction = true;
        changes.movingPause = false;
        wrap.style.opacity = ".7";
        permissions.forInertia = true;
      } else if (action == 6) {
        changes.movingPause = false;
        permissions.forInertia = true;
        wrap.style.opacity = ".7";
      }
      music.changeVolume(1);
      if (myCar.rpm < 3000 && !changes.introduction.gearDownAction) {
        myCar.noClutchMode = false;
        introduction.tip(
          `Останні штрихи: переключи передачу вниз клавішою "${keyboard.gearDown}". Увага: передачу вниз переключай, КОЛИ ОБОРОТИ МЕНШІ ЗА 6000`
        );
        changes.introduction.gearDownAction = true;
        changes.movingPause = true;
        myCar.noClutchMode = false;
        music.changeVolume(0.5);
      }
    },
    reachTheTarget: () => {
      if (
        action === 3 &&
        backgroundPositionX < -20000 &&
        !changes.reachIntroDestination
      ) {
        music.changeVolume(0.5);
        changes.introduction.reachIntroDestination = true;
        changes.movingPause = true;
        introduction.tip(
          `Ти майже приїхав, пора тормозити! Зажми "${keyboard.deccelerate}".`
        );
        permissions.forInertia = false;
        permissions.forMoreRpm = false;
        permissions.forLessRpm = true;
        clearTimeout(startInertiaMechanismTimeout);
      }
    },
    accelerationExplanation: () => {
      if (action == 3) {
        music.changeVolume(1);
        wrap.style.opacity = ".7";
        guideBlockText.innerText = `Чудово! Тепер, щоб доїхати до першої гонки, піднімай обороти і переключай передачі за допомогою "${keyboard.accelerate}" і "${keyboard.gearUp}".`;
      }
    },
    deccelerationExplanation: () => {
      if (action == 5 && myCar.gear == 1) {
        music.changeVolume(0.5);
        introduction.tip(
          `Зараз, коли передача є першою, а тобі треба зупинитись, притормози до меншої за 20 км/год швидкості кнопкою "${keyboard.deccelerate}" (більше не нагадуватиму), переключи передачу вниз, і тоді заглуши двигун з кнопкою "${keyboard.engine}", якщо не забув)`
        );
        changes.movingPause = true;
        permissions.forInertia = false;
        permissions.toOff_engine = true;
      }
    },
    gearDownExplanation: () => {
      music.changeVolume(1);
      if (changes.movingPause) {
        changes.movingPause = false;
        wrap.style.opacity = ".7";
        guideBlockText.innerText =
          "Як ти вже побачив - коробка передач - справа, тому, з огляду на неї, переключи передачі вниз аж до першої.";
      }
    },
  },
  "intro"
);
firstRace = new Race(
  {
    engine: () => {
      wrap.style.opacity = 0.7;
      music.changeVolume(1);
      guideBlockText.textContent =
        "Готуйся! Набери обороти, а коли натиснеш на цю кнопку → , то запустиш відлік до початку гонки. Коли відлік закінчиться - ПЕРЕКЛЮЧАЙ ПЕРЕДАЧУ ВГОРУ І ЖЕНИ";
      $(".continue-game-button").css("display", "flex");
      changes.movingPause = false;
    },
    continueTurnExplanation: () => {
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
    engine: () => {
      $(".continue-game-button").css("display", "flex");
      wrap.style.opacity = 1;
      permissions.forMoreRpm = true;
      permissions.forLessRpm = true;
      myCar.noClutchMode = true;
    },
  },
  "second"
);
finalRace = new Race(
  {
    engine: () => {
      $(".continue-game-button").css("display", "flex");
      wrap.style.opacity = 1;
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
