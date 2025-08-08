// ==UserScript==
// @name         Bilibili Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes advertisement cards on Bilibili
// @author       You
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  function removeAds() {
    const videoCards = document.querySelectorAll(".bili-video-card.is-rcmd");

    videoCards.forEach((card) => {
      const adText = card.querySelector(".bili-video-card__stats--text");

      const svgPaths = card.querySelectorAll("svg path");
      let hasRocketIcon = false;

      svgPaths.forEach((path) => {
        const pathData = path.getAttribute("d");
        if (
          pathData &&
          pathData.includes("M16.9122 1.50323C17.4366 1.48358 17.99745 1.54938")
        ) {
          hasRocketIcon = true;
        }
      });

      const links = card.querySelectorAll("a");
      let hasAdParams = false;

      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (
          href &&
          (href.includes("creative_id=") || href.includes("native_mode="))
        ) {
          hasAdParams = true;
        }
      });

      if (
        (adText && adText.textContent.includes("广告")) ||
        hasRocketIcon ||
        hasAdParams
      ) {
        card.remove();
      }
    });
  }

  removeAds();

  const observer = new MutationObserver((mutations) => {
    removeAds();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("unload", () => {
    observer.disconnect();
  });
})();
