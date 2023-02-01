// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const refs = {
  startBtn: document.querySelector('button[data-start]'),
  daysEl: document.querySelector('span[data-days]'),
  hoursEl: document.querySelector('span[data-hours]'),
  minutesEl: document.querySelector('span[data-minutes]'),
  secondsEl: document.querySelector('span[data-seconds]'),
};

refs.startBtn.addEventListener('click', onStart);
refs.startBtn.disabled = true;

let counter = {};
let timerID = 0;
let selectedDate = [];

flatpickr('input#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0].getTime();
    getDeltaTime();
    clearInterval(timerID);
  },
});

function onStart() {
  timerID = setInterval(updateInterface, 1000);
}

function getDeltaTime() {
  const currentDate = new Date().getTime();
  const deltaTime = selectedDate - currentDate;

  if (deltaTime > 0) {
    refs.startBtn.disabled = false;
    counter = convertMs(deltaTime);
  } else {
    refs.startBtn.disabled = true;
    Notify.failure('Please choose a date in the future');
  }
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateInterface() {
  getDeltaTime();
  refs.daysEl.textContent = addLeadingZero(counter.days);
  refs.hoursEl.textContent = addLeadingZero(counter.hours);
  refs.minutesEl.textContent = addLeadingZero(counter.minutes);
  refs.secondsEl.textContent = addLeadingZero(counter.seconds);
  refs.startBtn.disabled = true;
}
