(function () {
  // Clock Related Variables
  const hours = document.querySelector(".clock-hours");
  const minutes = document.querySelector(".clock-minutes");
  const seconds = document.querySelector(".clock-seconds");
  const ampm = document.querySelector(".clock-ampm");
  const colons = document.querySelectorAll(".clock-colon");

  // Alarm Related Variables
  const notification = document.querySelector(".timer-notification");
  const imageBlock = document.querySelector(".time-image");
  let paused = false;
  let notificationTimeOut = null;
  const LOCAL_STORAGE_KEY_ALARM_TIME = "app.alarm";
  const alarmTimes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALARM_TIME)) || {};
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
    selectError: {
      text: "Two Events Can't have Same Time!!",
      img: "./assets/images/warning.svg",
      notification: "Select Some Other Time Duration.",
    },
  };

  // Party Variables
  const partyBtn = document.querySelector(".timer-btn");
  partyBtn.addEventListener("click", partyStart);

  // Custom Select Variables
  const selectedList = document.querySelectorAll(".selected");
  const optionsList = document.querySelectorAll(".option");

  selectedList.forEach((select) =>
    select.addEventListener("click", () => {
      toggleSelect(select.previousElementSibling);
    }),
  );
  optionsList.forEach((option) => option.addEventListener("click", setSelect));

  // Initialization
  (function () {
    colons[0].style.animationPlayState = "running";
    colons[1].style.animationPlayState = "running";
    setInterval(getTime, 1000);
    setInterval(timer, 1000);
    getTime();
    timer();
    setSelected();
  })();

  // Clock Functions: Start
  function leadingZero(time) {
    return time < 10 ? `0${time}` : time;
  }

  function getTime() {
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
  // Clock Functions: End

  // Timer Functions: Start
  function setTimeValues(alarmFor, time) {
    const hours = time.split(" ").reduce((h, a) => {
      h = Number(h);
      if (a === "AM") {
        return h === 12 ? 0 : h;
      } else {
        return h === 12 ? 12 : h + 12;
      }
    });

    let valid = true;
    for (let key in alarmTimes) {
      if (key !== alarmFor && alarmTimes[key] === hours && hours !== "default") {
        valid = false;
        break;
      }
    }

    if (valid) {
      alarmTimes[alarmFor] = hours;
      localStorage.setItem(LOCAL_STORAGE_KEY_ALARM_TIME, JSON.stringify(alarmTimes));
    } else {
      clearTimeout(notificationTimeOut);
      displayData("selectError");
      paused = true;
      partyBtn.disabled = true;
      setTimeout(() => {
        paused = false;
        partyBtn.disabled = false;
      }, 5000);
      setSelected();
    }
  }

  function timer() {
    if (alarmTimes === {} || paused) return;

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    let setDefault = true;

    for (let key in alarmTimes) {
      if (currentHour >= alarmTimes[key] && currentHour <= alarmTimes[key] + 1 && currentMinute <= 59) {
        setDefault = false;
        displayData(key);
      }
    }

    if (setDefault) {
      displayData("default");
    }
  }

  function displayData(key) {
    paused = true;

    const textSpan = imageBlock.querySelector(".image-text");
    const img = imageBlock.querySelector("img");
    const notificationSpan = notification.querySelector("span");

    textSpan.textContent = imageData[key].text;
    img.setAttribute("src", imageData[key].img);

    if (key !== "default") {
      notification.classList.remove("hide");
      notificationSpan.textContent = imageData[key].notification;
    } else {
      notification.classList.add("hide");
      notificationTimeOut = setTimeout(() => {
        notificationSpan.textContent = "";
      }, 1000);
    }

    paused = false;
  }

  function setSelected() {
    if (alarmTimes === {}) return;

    for (let key in alarmTimes) {
      const selected = document.querySelector(`div[data-select-for="${key}"]`);
      if (alarmTimes[key] !== null && alarmTimes[key] !== "default") {
        const time1 = leadingZero(alarmTimes[key] % 12 || 12);
        const am1 = alarmTimes[key] >= 12 ? "PM" : "AM";
        const time2 = leadingZero((alarmTimes[key] + 2) % 12 || 12);
        const am2 = alarmTimes[key] + 2 >= 12 ? "PM" : "AM";
        selected.textContent = `${time1} ${am1} - ${time2} ${am2}`;
      } else {
        selected.textContent = "Select a Time";
      }
    }
  }
  // Timer Functions: Start

  // Party Functions: Start
  function partyStart() {
    partyBtn.removeEventListener("click", partyStart);
    partyBtn.addEventListener("click", partyEnd);

    partyBtn.textContent = "End Party!";

    const key = "party";
    clearTimeout(notificationTimeOut);
    displayData(key);
    paused = true;

    function partyEnd() {
      paused = false;

      partyBtn.removeEventListener("click", partyEnd);
      partyBtn.addEventListener("click", partyStart);

      partyBtn.textContent = "Party Time!";
    }
  }
  // Party Functions: End

  // Custom Select Functions: Start
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
    setTimeValues(radio.getAttribute("name"), radio.id);
  }
  // Custom Select Functions: End
})();
