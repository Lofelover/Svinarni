// Изначальное состояние первой сцены
let timeOfDay = 'day';

// Рендер сцены

function renderSceneStep(container, step) {
  container.innerHTML = "";

  const stepEl = document.createElement("div");
  stepEl.className = "scene-step";

  const hasMedia = Array.isArray(step.media) && step.media.length > 0;

  if (!hasMedia) {
    stepEl.classList.add("no-media");
  }

  if (hasMedia) {
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

    stepEl.appendChild(mediaCol);
  }

  const textCol = document.createElement("div");
  textCol.className = "text-column";

  stepEl.appendChild(textCol);
  container.appendChild(stepEl);

  return textCol;
}



// Вступление

const introSteps = [
  {
    text: "Свинарник — это не просто пруд.",
    media: [
      { type: "image", src: "/media/intro/map.png" }
    ]
  },
  {
    text: "Когда мы были мелкими, то часто летом приходили сюда купаться. Кто-то с друзьями, кто-то с родителями.",
    media: [
      { type: "image", src: "/media/intro/pool.jpg" },
    ]
  },
  {
    text: "Я помню, что первый раз в жизни увидел здесь стрекозу",
  },
  {
    text: "Нам(13) было интересно посетить это место зимой, идя по снежному лесу.",
    isLast: true
  }
];

function playIntroStep() {
  nextBtn.hidden = true;

  if (introIndex < introSteps.length) {
    const step = introSteps[introIndex];

    const textContainer = renderSceneStep(introContainer, step);

    typeText(textContainer, step.text, () => {
      nextBtn.hidden = false;
      introIndex++;
    });

  } else {
    introContainer.innerHTML = `
      <div class="scene-step no-media">
        <div class="text-column">
          <p style="font-size: 36px;">
            История начинается…
          </p>
        </div>
      </div>
    `;

    nextBtn.hidden = false;
    nextBtn.textContent = "Перейти к первому походу";

    introIndex = introSteps.length + 1;
  }
}



let introIndex = 0;

const introSection = document.getElementById("intro");
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
  introSection.classList.add("started");
  startBtn.hidden = true;


  introContainer.style.display = "flex";
  const logo = document.querySelector(".intro-logo");
  if (logo) {
    logo.style.opacity = "0";
    logo.style.transform = "scale(0.95)";
  }

  playIntroStep();
});

nextBtn.addEventListener("click", () => {
  if (introIndex < introSteps.length + 1) {
    playIntroStep();
  } else {
    showScene("first-hike");
  }
});

// Первая ходка
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
      { type: "image", src: "media/first/2.jpg"}
    ]
  },
  {
    text: "Наконец-то мы пришли на глинку, только полюбуйтесь этими видами! Далее мы пытались развести костер, но все наши попытки были тщетны",
    media: [
      { type: "image", src: "media/first/3.jpg"},
      { type: "image", src: "media/first/4.jpg"}
    ]
  },
  {
    text: "Мы поняли, что должны вернуться в этом место ночью и развести огонь. Для этого мы созвали всю тринашку. Поставленная задача должна быть выполнена",
    media: [
      { type: "video", src: "media/first/circle_tg.MP4"}
    ],
    isLast: true
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

function playFirstHikeStep() {
  firstNextBtn.hidden = true;

  if (firstHikeIndex < firstHikeSteps.length) {
    const step = firstHikeSteps[firstHikeIndex];

    const textContainer = renderSceneStep(firstContainer, step);


    // GSAP анимация текста
    const mediaItems = firstContainer.querySelectorAll(
      '.media-column img, .media-column video'
    );

    if (mediaItems.length) {
      gsap.fromTo(
        mediaItems,
        {
          opacity: 0,
          scale: 0.96
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: mediaItems.length > 1 ? 0.15 : 0
        }
      );
    }
    
    // Печать текста
    typeText(textContainer, step.text, () => {
      if (step.isLast) {
        firstNextBtn.hidden = true;
        finishFirstHikeBtn.hidden = false;
      } else {
        firstNextBtn.hidden = false;
      }
    });

  } else {
    finishFirstHikeBtn.hidden = false;
  }
}


finishFirstHikeBtn.addEventListener('click', () => {
  showScene('second-hike');
});

// Вторая ходка 

const secondHikeSteps = [
  {
    text: "И вот наступила ночь, мы собрались на вторую ходку. Более подготовленные и с боевым настроем. МЫ ДОЛЖНЫ РАЗВЕСТИ КОСТЕР!",
  },
  {
    text: "Прямо перед полянкой нас встретил Хранитель Свинарника. Мы дали ему дань(винстон икстайл), после чего он пропустил нас к нужному месту.",
    media: [
      { type: "image", src: "media/second/keeper_second.jpg" }
    ]
  },
  {
    text: "Дойдя до места, мы перебрались на другую полянку рядом и начали собирать палки. Жидкость для розжига выступила нашим ультиматумом и костер начал разгораться!",
    media: [
      { type: "image", src: "media/second/1_second.jpg" }
    ]
  },
  {
    text: "Мы общались, пили пиво и наслаждались этим приятным моментом! ",
    media: [
      { type: "video", src: "media/second/1_second.mov" }
    ]
  },
  {
    text: "Чипик",
    media: [
      { type: "image", src: "media/second/chipik_second.jpg"}
    ]
  },
  {
    text: "Так наше уютное место выглядело из далека. Это Тема и Курсед едят сосиски, которые стоят по 40р за упаковку",
    media: [
      { type: "image", src: "media/second/eat_second.jpg" }
    ]
    
  },
  {
    text: "Когда мы решили уже уходить, то поняли, что у нас осталась бутылка с розжигом и ее надо сжечь. Получилось такое мощное пламя!",
    media: [
      { type: "video", src: "media/second/burn_second.MOV" }
    ]
  },
   {
    text: "Четкий огонь!",
    media: [
      { type: "image", src: "media/second/burn.jpg" }
    ],
    isLast: true
  }
];

let secondHikeIndex = 0;

const secondContainer = document.querySelector('#second-hike .scene-content');
const secondNextBtn = document.getElementById('second-next');
const finishSecondHikeBtn = document.getElementById('finish');

secondNextBtn.addEventListener('click', () => {
  secondHikeIndex++;
  playSecondHikeStep();
});

function playSecondHikeStep() {
  secondNextBtn.hidden = true;

  if (secondHikeIndex < secondHikeSteps.length) {
    const step = secondHikeSteps[secondHikeIndex];

    const textContainer = renderSceneStep(secondContainer, step);

    // GSAP анимация для медиа
    const mediaItems = secondContainer.querySelectorAll(
      '.media-column img, .media-column video'
    );

    if (mediaItems.length) {
      gsap.fromTo(
        mediaItems,
        {
          opacity: 0,
          scale: 0.96
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: mediaItems.length > 1 ? 0.15 : 0
        }
      );
    }
    
    // Печать текста
    typeText(textContainer, step.text, () => {
       if (step.isLast) {
        // Скрываем кнопку "Далее" и показываем "Подвести итоги"
        secondNextBtn.hidden = true;
        finishSecondHikeBtn.hidden = false;
      } else {
        secondNextBtn.hidden = false;
      }
    });

  } else {
    finishSecondHikeBtn.hidden = false;
  }
}

// Автоматический запуск первой сцены при переходе
// function showScene(id) {
//     scenes.forEach(scene => scene.classList.remove('active'));

//     const nextScene = document.getElementById(id);
//     nextScene.classList.add('active');

//     if (id === 'first-hike') {
//         setTime('day');
//         // Сброс индекса при переходе
//         secondHikeIndex = 0;
//     }

//     if (id === 'second-hike') {
//         setTime('night');
//         // Сброс индекса при переходе
//         secondHikeIndex = 0;
//         // Очистка контента при переходе на сцену
//         secondContainer.innerHTML = "";
//         // Скрываем кнопку "Подвести итоги" при начале сцены
//         finishSecondHikeBtn.hidden = true;
//         // Показываем кнопку "Далее"
//         secondNextBtn.hidden = false;
//     }
// }

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
// function showScene(id) {
//     scenes.forEach(scene => scene.classList.remove('active'));

//     const nextScene = document.getElementById(id);
//     nextScene.classList.add('active')

//     if (id === 'first-hike') {
//         setTime('day')
//     }

//     if (id === 'second-hike') {
//         setTime('night')
//     }
// }

// Раскрывает конкретную сцену по передаваемому id
function showScene(id) {
    scenes.forEach(scene => scene.classList.remove('active'));

    const nextScene = document.getElementById(id);
    nextScene.classList.add('active');

    if (id === 'first-hike') {
        setTime('day');
        // Сброс индекса при переходе
        firstHikeIndex = 0;
        // Очистка контента
        firstContainer.innerHTML = "";
        // Скрываем кнопку перехода
        finishFirstHikeBtn.hidden = true;
        // Показываем кнопку "Далее"
        firstNextBtn.hidden = false;
        // Автоматически начинаем первую сцену
        playFirstHikeStep();
    }

    if (id === 'second-hike') {
        setTime('night');
        // Сброс индекса при переходе
        secondHikeIndex = 0;
        // Очистка контента при переходе на сцену
        secondContainer.innerHTML = "";
        // Скрываем кнопку "Подвести итоги" при начале сцены
        finishSecondHikeBtn.hidden = true;
        // Показываем кнопку "Далее"
        secondNextBtn.hidden = false;
        // Автоматически начинаем вторую сцену
        playSecondHikeStep();
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



