const hours = document.querySelector(".clock-hours");
const minutes = document.querySelector(".clock-minutes");
const seconds = document.querySelector(".clock-seconds");
const ampm = document.querySelector(".clock-ampm");

function getTime() {
  const date = new Date();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const am = h >= 12 ? "pm" : "am";

  hours.textContent = h%12 < 10 ? `0${h%12}` : h%12;
  minutes.textContent = m < 10 ? `0${m}` : m;
  seconds.textContent = s < 10 ? `0${s}` : s;
  ampm.textContent = am;
}

setInterval(getTime, 1000);
