"use strict";
const CACHE_NAME = "v1";
self.addEventListener("install", (/**@type {ExtendableEvent} */ event) => {
  const filesInPath = (
    /**@type {string} */ path,
    /**@type {string[]} */ arr,
    /**@type {string} */ end = ""
  ) => {
    return arr.map((el) => path + el + end);
  };
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      let array = [
        "/",
        "/index.html",
        "/contact.html",
        "/credits.html",
        "https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap",
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js",
        "https://ia801400.us.archive.org/27/items/need-for-speed-underground-soundtrack-2003-gamerip/06.%20Static-X%20-%20The%20Only%20%28NFS%20Underground%20Edition%29.mp3",
        "https://ia801400.us.archive.org/27/items/need-for-speed-underground-soundtrack-2003-gamerip/03.%20Rancid%20-%20Out%20of%20Control%20%28NFS%20Underground%20Edition%29.mp3",
        "https://ia601400.us.archive.org/27/items/need-for-speed-underground-soundtrack-2003-gamerip/02.%20The%20Crystal%20Method%20-%20Born%20Too%20Slow%20%28NFS%20Underground%20Edition%29.mp3",
        "https://ia801400.us.archive.org/27/items/need-for-speed-underground-soundtrack-2003-gamerip/07.%20Element%20Eighty%20-%20Broken%20Promises%20%28NFS%20Underground%20Edition%29.mp3",
        ...filesInPath(
          "/styles/",
          ["race", "for-phones", "contact", "credits"],
          "/styles.css"
        ),
        ...filesInPath("/javascript/", ["start", "story"], ".js"),
        ...filesInPath(
          "/javascript/mechanisms/",
          ["cars", "turningFunctions", "rpmFunctions", "gearFunctions"],
          ".js"
        ),
        ...filesInPath(
          "/javascript/other/",
          ["variables", "music", "secondary", "keyboard"],
          ".js"
        ),

        ...filesInPath(
          "/icons-and-images/background-images/",
          ["rain", "day", "night"],
          ".webp"
        ),
        ...filesInPath(
          "/icons-and-images/cars/",
          [
            "finalRace",
            "firstRace",
            "myCar-lightened",
            "myCarDay",
            "secondRace",
            "sedan",
          ],
          ".webp"
        ),
        ...filesInPath(
          "/icons-and-images/parts-back-images/",
          ["rain", "day", "night"],
          ".webp"
        ),
        ...filesInPath(
          "/icons-and-images/roads/",
          ["rain", "day", "night"],
          ".webp"
        ),
        ...filesInPath(
          "/icons-and-images/pedals/",
          ["acceleration", "deceleration"],
          ".webp"
        ),
        ...filesInPath("/icons-and-images/tunnel/", ["left", "right"], ".webp"),
        ...filesInPath(
          "/icons-and-images/",
          ["disabled-race", "engine2", "warning", "wheel"],
          ".webp"
        ),
        ...filesInPath("/useless-images/", ["arrow.png", "car1dark.webp"]),
        ...filesInPath("/icons-and-images/", ["flame.png", "pause.svg"]),
      ];
      cache.addAll(array);
      array = null;
    })
  );
});
// Оновлення кешу
self.addEventListener("activate", (/**@type {ExtendableEvent} */ event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
self.addEventListener("fetch", (/**@type {FetchEvent} */ event) => {
  event.respondWith(
    caches
      .match(event.request, { cacheName: CACHE_NAME, ignoreVary: true })
      .then((response) => {
        return (
          response ||
          fetch(event.request).then((response) => {
            return caches.open("v1").then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
        );
      })
      .catch(() => {
        return fetch(event.request);
      })
  );
});
