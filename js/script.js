"use strict";

class CustomSlider {
  constructor(options) {
    this.track = document.getElementById(options.track);
    this.progress = document.getElementById(options.progress);
    this.thumb = document.getElementById(options.thumb);
    this.valueBox = document.getElementById(options.value);

    this.min = options.min;
    this.max = options.max;
    this.value = this.min;

    this.dragging = false;

    this.onChange = options.onChange || function () {};

    this.bindEvents();

    this.render();
  }

  bindEvents() {
    this.track.addEventListener("mousedown", (e) => {
      this.dragging = true;

      this.move(e.clientX);
    });

    document.addEventListener("mousemove", (e) => {
      if (!this.dragging) return;

      this.move(e.clientX);
    });

    document.addEventListener("mouseup", () => {
      this.dragging = false;
    });

    this.track.addEventListener("click", (e) => {
      this.move(e.clientX);
    });
  }

  move(clientX) {
    const rect = this.track.getBoundingClientRect();

    let x = clientX - rect.left;

    if (x < 0) x = 0;

    if (x > rect.width) x = rect.width;

    const percent = x / rect.width;

    this.value = Math.round(this.min + percent * (this.max - this.min));

    this.render();
  }

  render() {
    const percent = (this.value - this.min) / (this.max - this.min);

    this.thumb.style.left = percent * 100 + "%";

    this.progress.style.width = percent * 100 + "%";

    this.valueBox.textContent = this.value;

    this.onChange(this.value);
  }
}

const DAY_PRICE = 1000;
const VOLUME_PRICE = 4000;

const dayPrice = document.getElementById("dayPrice");
const volumePrice = document.getElementById("volumePrice");
const totalPrice = document.getElementById("totalPrice");

let dayValue = 1;
let volumeValue = 1;

function formatNumber(number) {
  return number.toLocaleString("fa-IR");
}

function updatePrices() {
  const dayCost = dayValue * DAY_PRICE;

  const volumeCost = volumeValue * VOLUME_PRICE;

  const totalCost = dayCost + volumeCost;

  dayPrice.textContent = formatNumber(dayCost);

  volumePrice.textContent = formatNumber(volumeCost);

  totalPrice.textContent = formatNumber(totalCost);
}

const daySlider = new CustomSlider({
  track: "dayTrack",

  progress: "dayProgress",

  thumb: "dayThumb",

  value: "dayValue",

  min: 1,

  max: 60,

  onChange(value) {
    dayValue = value;

    updatePrices();
  },
});

const volumeSlider = new CustomSlider({
  track: "volumeTrack",

  progress: "volumeProgress",

  thumb: "volumeThumb",

  value: "volumeValue",

  min: 1,

  max: 200,

  onChange(value) {
    volumeValue = value;

    updatePrices();
  },
});

updatePrices();

function enableTouch(slider) {
  slider.track.addEventListener(
    "touchstart",
    (e) => {
      slider.dragging = true;

      slider.move(e.touches[0].clientX);
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!slider.dragging) return;

      slider.move(e.touches[0].clientX);
    },
    { passive: true },
  );

  document.addEventListener("touchend", () => {
    slider.dragging = false;
  });
}

enableTouch(daySlider);

enableTouch(volumeSlider);

window.addEventListener("resize", () => {
  daySlider.render();

  volumeSlider.render();
});

daySlider.thumb.addEventListener("dblclick", () => {
  daySlider.value = 1;

  dayValue = 1;

  daySlider.render();
});

volumeSlider.thumb.addEventListener("dblclick", () => {
  volumeSlider.value = 1;

  volumeValue = 1;

  volumeSlider.render();
});

document.addEventListener("selectstart", (e) => {
  if (daySlider.dragging || volumeSlider.dragging) {
    e.preventDefault();
  }
});

document.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

daySlider.render();

volumeSlider.render();

updatePrices();
