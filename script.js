// Изначальное состояние первой сцены
let timeOfDay = 'day';


// Рендер сцены
function renderSceneStep(container, step) {
  container.innerHTML = "";

  const stepEl = document.createElement("div");
  stepEl.className = "scene-step";

  const mediaCol = document.createElement("div");
  mediaCol.className = "media-column";

  step.media.forEach(item => {
    if (item.type === "image") {
      const img = document.createElement("img");
      img.src = item.src;
      mediaCol.appendChild(img);
    }

    if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.src;
      video.controls = true;
      mediaCol.appendChild(video);
    }
  });

  const textCol = document.createElement("div");
  textCol.className = "text-column";

  stepEl.appendChild(mediaCol);
  stepEl.appendChild(textCol);
  container.appendChild(stepEl);

  return textCol; // важно: сюда будем печатать текст
}



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
  }, 10);
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
    // introContainer.innerHTML += "<p>&nbsp;История начинается…</p>";
    introContainer.innerHTML += "<p><br><br><br>История начинается…</p>";
    nextBtn.hidden = false;
    nextBtn.textContent = "Перейти к первому походу";
  }
}

// Первая ходка

// const firstHikeSteps = [
//   "Илья, Никита(Чипик) и Никита(Пого) участвовали в первой ходке на свинарник.",
//   "Нам предостоял нелегкий маршрут. Целых два дня перед походом шел снег. Тропа не была протопатна. На верхушке снега виднелись только следы от лыж.",
//   "Первый отдых мы устроили у Глинки - это тоже небольшой пруд, мы часто плавали в нем. Дальше Чипик решил покататься на дереве. Пого и Илью это очень позабавило!",
//   "А эти кадры были сделаны в непресредственной близости к заветному месту."
// ];

const firstHikeSteps = [
  {
    text: "Илья, Никита (Чипик) и Никита (Пого) участвовали в первой ходке.",
    media: [
      { type: "image", src: "media/first/chair.jpg" }
    ]
  },
  {
    text: "Нам предостоял нелегкий маршрут. Целых два дня перед походом шел снег. Тропа не была протопатна. На верхушке снега виднелись только следы от лыж.",
    media: [
      { type: "image", src: "media/first/1.jpg" }
    ]
  },
  {
    text: "Первый отдых мы устроили у Глинки - это тоже небольшой пруд, мы часто плавали в нем. Дальше Чипик решил покататься на дереве. Пого и Илью это очень позабавило!",
    media: [
      { type: "video", src: "media/first/1.mp4" }
    ]
  },
  {
    text: "А эти кадры были сделаны в непресредственной близости к заветному месту.",
    media: [
      {type: "image", src: "media/first/2.jpg"}
    ]
  },
  {
    text: "Наконец-то мы пришли на глинку, только полюбуйтесь этими видами! Далее мы пытались развести костер, но все наши попытки были тщетны",
    media: [
      {type: "image", src: "media/first/3.jpg"},
      {type: "image", src: "media/first/4.jpg"}
    ]
  }
];


let firstHikeIndex = 0;

const firstContainer = document.querySelector('#first-hike .scene-content');
const firstNextBtn = document.getElementById('first-next');
const finishFirstHikeBtn = document.getElementById('to-evening');

firstNextBtn.addEventListener('click', () => {
  firstHikeIndex++;
  playFirstHikeStep();
});

// firstNextBtn.addEventListener('click', () => {
//   if (firstHikeIndex < firstHikeSteps.length+1) {
//     playFirstHikeStep();
//   }
// });


// function playFirstHikeStep() {
//   firstNextBtn.hidden = true;

//   if (firstHikeIndex < firstHikeSteps.length) {
//     typeText(firstContainer, firstHikeSteps[firstHikeIndex], () => {

//       const mediaColumn = firstContainer.querySelector('.media-column');
//       if (mediaColumn) {
//         mediaColumn.classList.add('visible');
//       }

//       firstNextBtn.hidden = false;

//       firstHikeIndex++;
//     });

//   } else {
//     finishFirstHikeBtn.hidden = false;
//   }
// }



function playFirstHikeStep() {
  firstNextBtn.hidden = true;

  if (firstHikeIndex < firstHikeSteps.length) {
    const step = firstHikeSteps[firstHikeIndex];

    const textContainer = renderSceneStep(firstContainer, step);

    const mediaColumn = firstContainer.querySelector('.media-column');
    if (mediaColumn) {
      // Небольшая задержка для синхронизации с началом печати текста
      setTimeout(() => {
        mediaColumn.classList.add('visible');
      }, 100);
    }
  

    typeText(textContainer, step.text, () => {
      
      firstNextBtn.hidden = false;
    });

  } else {
    finishFirstHikeBtn.hidden = false;
  }
}



// function playFirstHikeStep() {
//   firstNextBtn.hidden = true;

//   if (firstHikeIndex < firstHikeSteps.length){
//     typeText(firstContainer, firstHikeSteps[firstHikeIndex], () => {
//      firstNextBtn.hidden = false;
//      firstHikeIndex++;
//     });
//   } else {
//     finishFirstHikeBtn.hidden = false;
//   }
// }

finishFirstHikeBtn.addEventListener('click', () => {
  showScene('second-hike');
});

// Вторая ходка

const secondHikeSteps = [
  "Вечером лес стал совсем другим.",
  "Снег перестал блестеть, вокруг сгущалась тишина.",
  "Мы развели костер, и его треск стал единственным звуком.",
  "Где-то вдали ухала сова, напоминая, что ночь только начинается."
];

let secondHikeIndex = 0;

const secondContainer = document.querySelector('#second-hike .scene-content');
const secondNextBtn = document.getElementById('second-next');
const finishSecondHikeBtn = document.getElementById('finish');


secondNextBtn.addEventListener('click', () => {
  if (secondHikeIndex < secondHikeSteps.length+1) {
    playSecondHikeStep();
  }
});

function playSecondHikeStep() {
  secondNextBtn.hidden = true;

  if (secondHikeIndex < secondHikeSteps.length) {
    typeText(secondContainer, secondHikeSteps[secondHikeIndex], () => {
        secondNextBtn.hidden = false;
        secondHikeIndex++;
    });
  } else {
    finishSecondHikeBtn.hidden = false;
  }
}

// finishSecondHikeBtn.addEventListener('click', () => {
//   showScene('final');
// });

finishSecondHikeBtn.addEventListener('click', () => {
  showScene('final');
  setTime('night');

  renderCredits();
  restartCredits();
  hideCreditsAfterAnimation();
});

// Финальная сцена

const participants = [
  "Илья (Марвел)", 
  "Никита (Чипик)",
  "Никита (Пого)",
  "Матвей (Мотор)",
  "Дима (Курсед)",
  "Артем"
];

function renderCredits() {
  const container = document.getElementById('credits-content');
  container.innerHTML = "";

  const title = document.createElement('h2')
  title.textContent = "Вся братва с тринашки молодец. Мы захватили свинарник!";
  container.appendChild(title)

  participants.forEach( name => {
    const p = document.createElement('p');
    p.textContent = name;
    container.appendChild(p);
  });

  const spacer = document.createElement('div');
  spacer.className = 'spacer';
  container.appendChild(spacer);

  const footer = document.createElement('p');
  footer.textContent = "Зима • Лес • Свинарник";
  container.appendChild(footer);

}

function restartCredits() {
  const credits = document.querySelector('.credits-content');
  credits.style.display = 'block';
  credits.style.animation = 'none';
  credits.offsetHeight;
  credits.style.animation = '';
}

function hideCreditsAfterAnimation() {
  const credits = document.querySelector('.credits-content');

  credits.addEventListener('animationend', () => {
    credits.style.display = 'none';
  }, { once: true });
}

// Установка времени суток

let currentTime = null;

function setTime(time) {
  if (currentTime === time) return;

  currentTime = time;
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



