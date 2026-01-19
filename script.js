// Изначальное состояние первой сцены
let timeOfDay = 'day';

// Вступление
const introSteps = [
  "Свинарник — это не просто пруд.",
  "Когда мы были мелкими, то часто летом приходили сюда купаться. Кто-то с друзьями, кто-то с родителями.",
  "Я помню, что первый раз в жизни увидел здесь стрекозу",
  "Нам было интересно посетить это место зимой, идя по снежному лесу."
];

let introIndex = 0;

const introContainer = document.querySelector("#intro .scene-content");
const startBtn = document.getElementById("intro-start");
const nextBtn = document.getElementById("intro-finish");


function typeText(container, text, onFinish) {
  container.innerHTML = "";
  let i = 0;

  const p = document.createElement("p");
  container.appendChild(p);

  const interval = setInterval(() => {
    p.textContent += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(interval);
      if (onFinish) onFinish();
    }
  }, 40);
}


startBtn.addEventListener("click", () => {
  startBtn.hidden = true;
  playIntroStep();
});

nextBtn.addEventListener("click", () => {
  if (introIndex < introSteps.length) {
    introIndex++;
    playIntroStep();
  } else {
    showScene("first-hike");
  }
});

function playIntroStep() {

  nextBtn.hidden = true;

  if (introIndex < introSteps.length) {
    typeText(introContainer, introSteps[introIndex], () => {
      nextBtn.hidden = false;
    });
  } else {
    introContainer.innerHTML += "<p>История начинается…</p>";
    nextBtn.hidden = false;
    nextBtn.textContent = "Перейти к первому походу";
  }
}

// Первая ходка

const firstHikeSteps = [
  "Илья, Никита(Чипик) и Никита(Пого) участвовали в первой ходке на свинарник.",
  "Нам предостоял нелегкий маршрут. Целых два дня перед походом шел снег. Тропа не была протопатна. На верхушке снега виднелись только следы от лыж.",
  "Первый отдых мы устроили у Глинки - это тоже небольшой пруд, мы часто плавали в нем. Дальше Чипик решил покататься на дереве. Пого и Илью это очень позабавило!",
  "А эти кадры были сделаны в непресредственной близости к заветному месту."
];

let firstHikeIndex = 0;

const firstContainer = document.querySelector('#first-hike .scene-content');
const firstNextBtn = document.getElementById('first-next');
const toEveningBtn = document.getElementById('to-evening');

firstNextBtn.addEventListener('click', () => {
  if (firstHikeIndex < firstHikeSteps.length) {
    firstHikeIndex++;
    playFirstHikeStep();
  } else {
    showScene("second-hike");
  }
});

function playFirstHikeStep() {
  firstNextBtn.hidden = true;

  if (firstHikeIndex < firstHikeSteps.length){
    typeText(firstContainer, firstHikeSteps[firstHikeIndex], () => {
    firstNextBtn.hidden = false;
    });
  } else {
    toEveningBtn.hidden = false;
    toEveningBtn.textContent = "Перейти к первому походу"
  }
}

toEveningBtn.addEventListener('click', () => {
  showScene('second-hike');
});

// Установка времени суток
function setTime(time) {
  document.body.dataset.time = time;

  disableParticles();

  if (time === "day") {
    enableSnow();
    showParticles();
  }

  if (time === "night") {
    showParticles();      // ← ВАЖНО
    enableNightParticles();
  }
}


// Поиск всех сцен
const scenes = document.querySelectorAll('.scene');

// Раскрывает конкретную сцену по передаваемому id
function showScene(id) {
    scenes.forEach(scene => scene.classList.remove('active'));

    const nextScene = document.getElementById(id);
    nextScene.classList.add('active')

    if (id === 'first-hike') {
        setTime('day')
    }

    if (id === 'second-hike') {
        setTime('night')
    }
}


// Эффект снега
function enableSnow() {
  tsParticles.load("particles", {
    particles: {
      number: { value: 120 },
      color: { value: "#ffffff" },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, direction: "bottom", speed: 1, },
      opacity: { value: 0.8 }
    }
  });
}

function showParticles() {
  document.getElementById("particles").style.opacity = "1";
}

function hideParticles() {
  document.getElementById("particles").style.opacity = "0";
}

function disableParticles() {
  tsParticles.dom().forEach(p => p.destroy());
}

// Эффект глаз костра

function enableNightParticles() {
  tsParticles.load("particles", {
    particles: {
      number: {
        value: 80
      },

      color: {
        value: ["#ffcc66", "#ff6600", "#ff3300"]
      },

      shape: {
        type: "circle"
      },

      opacity: {
        value: { min: 0.3, max: 0.9 },
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.2
        }
      },

      size: {
        value: { min: 1, max: 4 }
      },

      move: {
        enable: true,
        direction: "top",
        speed: { min: 0.2, max: 1.2 },
        outModes: {
          default: "out"
        }
      }
    }
  });
}



