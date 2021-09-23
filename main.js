// Clock Related Variables
const hours = document.querySelector(".clock-hours");
const minutes = document.querySelector(".clock-minutes");
const seconds = document.querySelector(".clock-seconds");
const ampm = document.querySelector(".clock-ampm");
const colons = document.querySelectorAll(".clock-colon");

// Alarm Related Variables
const notification = document.querySelector(".timer-notification");
const imageBlock = document.querySelector(".time-image");
const LOCAL_STORAGE_KEY_ALARM_TIME = "app.alarm";
const alarmTimes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALARM_TIME)) || {};
const alarmTimeOuts = {
  wake: null,
  lunch: null,
  sleep: null,
};
const imageData = {
  default: {
    text: "Keep Chilling, Keep Working",
    img: "./assets/images/default.svg",
  },
  wake: {
    text: "Wake Up!!",
    img: "./assets/images/wakeup.svg",
    notification: "Good Morning!!",
  },
  lunch: {
    text: "Let's have some Lunch!!",
    img: "./assets/images/lunch.svg",
    notification: "Eat Healthy!!",
  },
  sleep: {
    text: "Take Some Rest, Sleep!!",
    img: "./assets/images/sleep.svg",
    notification: "Good Night!!",
  },
  party: {
    text: String.fromCodePoint(0x1f639) + "Hamari Party Ho Rahi Hai" + String.fromCodePoint(0x1f639),
    img: "./assets/images/party.svg",
    notification: "Party Hard!!",
  },
};

// Custom Select Related Variables
const selectedList = document.querySelectorAll(".selected");
const optionsList = document.querySelectorAll(".option");

selectedList.forEach((select) =>
  select.addEventListener("click", () => {
    toggleSelect(select.previousElementSibling);
  }),
);
optionsList.forEach((option) => option.addEventListener("click", setSelect));

// Initial Invocations
(function initialize() {
  colons[0].style.animationPlayState = "running";
  colons[1].style.animationPlayState = "running";
  setInterval(getTime, 1000);
  getTime();
  setSelected();
  setAlarm();
})();

// Clock Functions
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

// Party
const partyBtn = document.querySelector(".timer-btn");
partyBtn.addEventListener("click", partyStart);

function partyStart() {
  partyBtn.removeEventListener("click", partyStart);
  partyBtn.addEventListener("click", partyEnd);

  partyBtn.textContent = "End Party!";

  const key = "party";
  const oldKey = imageBlock.dataset.for;
  imageBlock.dataset.for = key;

  const textSpan = imageBlock.querySelector(".image-text");
  const img = imageBlock.querySelector("img");
  const notificationSpan = notification.querySelector("span");

  textSpan.textContent = imageData[key].text;
  img.setAttribute("src", imageData[key].img);

  notificationSpan.textContent = imageData[key].notification;
  notification.classList.toggle("hide");

  function partyEnd() {
    partyBtn.removeEventListener("click", partyEnd);
    partyBtn.addEventListener("click", partyStart);

    partyBtn.textContent = "Party Time!";

    imageBlock.dataset.for = oldKey;

    textSpan.textContent = imageData[oldKey].text;
    img.setAttribute("src", imageData[oldKey].img);

    notification.classList.toggle("hide");
    setTimeout(() => {
      notificationSpan.textContent = "";
    }, 1000);
  }
}

// Alarm Functions
function setTimeValues(alarmFor, time) {
  const hours = time.split(" ").reduce((h, a) => {
    h = Number(h);
    if (a === "AM") {
      return h === 12 ? 0 : h;
    } else {
      return h === 12 ? 12 : h + 12;
    }
  });

  if (alarmFor.trim() === "wake") {
    alarmTimes.wake = hours;
  } else if (alarmFor.trim() === "lunch") {
    alarmTimes.lunch = hours;
  } else {
    alarmTimes.sleep = hours;
  }

  localStorage.setItem(LOCAL_STORAGE_KEY_ALARM_TIME, JSON.stringify(alarmTimes));
  setAlarm();
}

function setAlarm() {
  if (alarmTimes === {}) {
    return;
  }

  for (let key in alarmTimes) {
    if (alarmTimes[key] !== null) {
      const current = new Date();
      const timeToAlarm = new Date();
      timeToAlarm.setHours(alarmTimes[key]);
      timeToAlarm.setMinutes(0);
      timeToAlarm.setSeconds(0);

      const difference = timeToAlarm.getTime() - current.getTime();

      if (difference > 0) {
        if (alarmTimeOuts[key] !== null) {
          clearTimeout(alarmTimeOuts[key]);
        }
        alarmTimeOuts[key] = setTimeout(alarm.bind(null, key), difference);
      }
    }
  }
}

function alarm(key) {
  let timeout = 0;
  if (partyBtn.textContent === "End Party!") {
    partyBtn.click();
    timeout = 1100;
  }
  setTimeout(() => {
    const oldKey = imageBlock.dataset.for;
    imageBlock.dataset.for = key;
    const textSpan = imageBlock.querySelector(".image-text");
    const img = imageBlock.querySelector("img");
    const notificationSpan = notification.querySelector("span");

    textSpan.textContent = imageData[key].text;
    img.setAttribute("src", imageData[key].img);

    notificationSpan.textContent = imageData[key].notification;
    notification.classList.toggle("hide");

    setTimeout(() => {
      imageBlock.dataset.for = oldKey;
      textSpan.textContent = imageData[oldKey].text;
      img.setAttribute("src", imageData[oldKey].img);

      notification.classList.toggle("hide");
      setTimeout(() => {
        notificationSpan.textContent = "";
      }, 1000);
    }, 1000 * 60 * 30); // Set the Image & Text Back to Default after 30 Minutes
  }, timeout);
}

function setSelected() {
  if (alarmTimes === {}) return;

  for (let key in alarmTimes) {
    if (alarmTimes[key] !== null) {
      const selected = document.querySelector(`div[data-select-for="${key}"]`);
      const time = alarmTimes[key] % 12 || 12;
      const am = alarmTimes[key] >= 12 ? "PM" : "AM";
      selected.textContent = `${time} ${am}`;
    }
  }
}

// Custom Select Functions
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

  setTimeValues(radio.getAttribute("name"), label.textContent);
}
