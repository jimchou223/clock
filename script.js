const output = document.getElementById("output");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const status = document.getElementById("status");
const left = document.querySelector(".left");

const height = 300;
const width = 300;

setInterval(function () {
    drawClock();
    if (alarmList.length > 0) {
        for (let i = 0; i < alarmList.length; i++) {
            checkAlarm(alarmList[i]);
        }
    }
    ringAlarm(alarmList);
}, 1000);

function drawClock() {
    let d = new Date();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();

    let longSize = 110;
    let shortSize = 80;
    let secondSize = 130;
    let numberPositon = 135;

    let longAngle = minute * 6;
    let shortAngle = hour * 30 + longAngle / 12;
    let secondAngle = second * 6;

    output.innerHTML = `${String(hour).length < 2 ? `0${hour}` : hour} : ${
        String(minute).length < 2 ? `0${minute}` : minute
        } : ${String(second).length < 2 ? `0${second}` : second}`;

    // drawClock()
    ctx.clearRect(0, 0, 300, 300);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "15px Georgia";
    // draw the numbers
    for (let i = 1; i < 13; i++) {
        ctx.rotate((30 * Math.PI) / 180);
        ctx.fillText(i, -5, -numberPositon);
    }
    // long leg
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((longAngle * Math.PI) / 180);
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.lineTo(0, -longSize);
    ctx.lineTo(-10, -100);
    ctx.lineTo(10, -100);
    ctx.lineTo(0, -longSize);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    // short leg
    ctx.save();
    ctx.beginPath();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((shortAngle * Math.PI) / 180);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, -shortSize);
    ctx.lineTo(-10, -70);
    ctx.lineTo(10, -70);
    ctx.lineTo(0, -shortSize);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    //second leg
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
    ctx.translate(width / 2, height / 2);
    ctx.rotate((secondAngle * Math.PI) / 180);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, -secondSize);
    ctx.lineTo(-10, -120);
    ctx.lineTo(10, -120);
    ctx.lineTo(0, -secondSize);
    ctx.stroke();
    ctx.fill();
    ctx.rotate((-secondAngle * Math.PI) / 180);
    ctx.restore();
}

const alarmForm = document.getElementById("alarm-form");
const alarmHour = document.getElementById("alarm-hour");
const alarmMinute = document.getElementById("alarm-minute");
const alarmListUl = document.getElementById("alarm-list-ul");
let count = 0;
let alarmList = [];

function Alarm(hour, minute, id) {
    this.hour = hour;
    this.minute = minute;
    this.activate = false;
    this.noted = false;
    this.on = true;
    this.id = id;
}

alarmForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (hourValidation(alarmHour.value) && minuteValidation(alarmMinute.value)) {
        let newAlarm = new Alarm(alarmHour.value, alarmMinute.value, count);
        alarmList.push(newAlarm);
        const newAlarmEl = document.createElement("li");
        newAlarmEl.textContent = `${alarmHour.value} : ${alarmMinute.value}`;
        alarmListUl.appendChild(newAlarmEl);
        alarmHour.value = "";
        alarmMinute.value = "";
        count++;
    } else {
        alarmHour.value = "";
        alarmMinute.value = "";
    }
    renderAlarmList(alarmList);
});

function renderAlarmList(alarm) {
    alarmListUl.innerHTML = "";
    for (let i = 0; i < alarm.length; i++) {
        const newAlarmEl = document.createElement("div");
        newAlarmEl.innerHTML +=
            `` +
            `<div class="custom-control custom-switch">
        <input type="checkbox" class="custom-control-input" id="customSwitches${
            alarm[i].id
            }">
        <label class="custom-control-label" for="customSwitches${
            alarm[i].id
            }"></label>${
            alarm[i].hour.length < 2 ? `0${alarm[i].hour}` : alarm[i].hour
            } : ${
            alarm[i].minute.length < 2 ? `0${alarm[i].minute}` : alarm[i].minute
            }
        </div>`;
        newAlarmEl.querySelector(".custom-control-input").checked = alarm[i].on;
        alarmListUl.appendChild(newAlarmEl);
    }
    const alarmSwitch = document.querySelectorAll(".custom-control-input");
    alarmSwitch.forEach(function (el) {
        el.addEventListener("change", function () {
            let index = el.id.replace("customSwitches", "");
            alarmList[index].on = el.checked;
            alarmList[index].activate = el.checked;
            console.log(alarmList)
        });
    });
}

function hourValidation(hour) {
    return hour >= 0 && hour < 24 && !isNaN(hour) && hour != "";
}

function minuteValidation(minute) {
    return minute >= 0 && minute < 60 && !isNaN(minute) && minute != "";
}

function checkAlarm(alarm) {
    let d = new Date();
    let hour = d.getHours();
    let minute = d.getMinutes();
    if (
        alarm.hour == hour &&
        alarm.minute == minute &&
        alarm.activate == false &&
        alarm.noted == false
    ) {
        alarm.activate = true;
    }
}

function changeColor() {
    left.style.backgroundColor = `rgb(${Math.floor(
        Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
}

function myInterval() {
    interval = setInterval(changeColor, 300);
}

let colorMode = false;

function ringAlarm(alarm) {
    for (let i = 0; i < alarm.length; i++) {
        if (alarm[i].activate && alarm[i].on && !colorMode && alarm[i].noted == false) {
            colorMode = true;
            status.innerHTML = "Wake up!!!!!";
            myInterval();
            console.log("add interval");
            console.log(alarmList);
        } else if (alarm[i].activate && alarm[i].on) {
            return;
        } else {
            status.innerHTML = "";
            clearInterval(interval);
            left.style.backgroundColor = "#F6CE06";
            colorMode = false;
            console.log("stop");
        }
    }
}

function findActivate(alarmList) {
    let index = alarmList.findIndex(alarm => {
        return alarm.activate == true;
    });
    return index;
}

const turnOffAlarm = document.getElementById("turn-off-alarm");
turnOffAlarm.addEventListener("click", function () {
    let alarmIndex = findActivate(alarmList);
    alarmList[alarmIndex].activate = false;
    alarmList[alarmIndex].noted = true;
    clearInterval(interval);
    left.style.backgroundColor = "#F6CE06";
    colorMode = false;
});

const clearAlarm = document.getElementById("clear-alarm");
clearAlarm.addEventListener("click", function () {
    alarmList = [];
    console.log(alarmList);
    renderAlarmList(alarmList);
});
