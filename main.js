// Clock
const hours = document.querySelector(".clock-hours");
const minutes = document.querySelector(".clock-minutes");
const seconds = document.querySelector(".clock-seconds");
const ampm = document.querySelector(".clock-ampm");
const colons = document.querySelectorAll(".clock-colon");

function getTime() {
  function leadingZero(time) {
    return time < 10 ? `0${time}` : time;
  }

  const date = new Date();
  let h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const am = h >= 12 ? "pm" : "am";

  h = h % 12 || 12;

  hours.textContent = leadingZero(h);
  minutes.textContent = leadingZero(m);
  seconds.textContent = leadingZero(s);
  ampm.textContent = am;
}

(function initialize() {
  colons[0].style.animationPlayState = "running";
  colons[1].style.animationPlayState = "running";
  setInterval(getTime, 1000);
  getTime();
})();

// Custom Select
const selectedList = document.querySelectorAll(".selected");
const optionsList = document.querySelectorAll(".option");

function toggleSelect(container) {
  container.classList.toggle("active");
}

function setSelect(e) {
  const option = e.target;
  toggleSelect(option.parentElement);

  const label = option.querySelector("label");
  const selected = option.parentElement.nextElementSibling;
  selected.textContent = label.textContent;

  const radio = option.querySelector("input");
  console.log(radio.getAttribute("name") + ": " + label.textContent);
}

selectedList.forEach((select) =>
  select.addEventListener("click", () => {
    toggleSelect(select.previousElementSibling);
  }),
);

optionsList.forEach((option) => option.addEventListener("click", setSelect));
