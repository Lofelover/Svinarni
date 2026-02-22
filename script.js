// Изначальное состояние первой сцены
let timeOfDay = 'day';

// Добавьте эту переменную вверху файла (например, после объявления sounds)
const finalPhotoPath = '/media/final/final.jpg'; // Замените на ваш путь к фото

// Звук - исправленная версия
let masterVolume = 0.2; // ← НАЧАЛЬНАЯ ГРОМКОСТЬ
let soundEnabled = true; // ← Изначально включен
let currentSound = null;

// Добавьте эти переменные в начало файла (после объявления masterVolume):
let originalVolume = masterVolume;
let playingVideosCount = 0;


const sceneToSoundMap = {
  'intro': 'intro',
  'first-hike': 'day',
  'second-hike': 'night',
  'final': 'final'
};

const sounds = {
  intro: new Audio('/sounds/intro.mp3'),
  day: new Audio('/sounds/first_slowed.mp3'),
  night: new Audio('/sounds/second.mp3'),
  final: new Audio('/sounds/titles.mp3'),
};

// Настройка звуков (делаем это только один раз)
Object.values(sounds).forEach(sound => {
  sound.loop = true;
  sound.volume = masterVolume; // Начинаем с 0
});

const soundToggleBtn = document.getElementById('sound-toggle');
const volumeSlider = document.getElementById('sound-volume');

// Начальное состояние
volumeSlider.value = masterVolume;
// soundToggleBtn.textContent = '🔊'; // Изначально включен!
// Убеждаемся, что класс muted отсутствует (звук включён и громкость > 0)
soundToggleBtn.classList.remove('muted');

// Функция плавного изменения громкости
function fadeIn(audio, target = 0.6, duration = 800) {
  if (!audio || !soundEnabled) return;
  
  audio.volume = 0;
  const step = target / (duration / 50);
  audio.play();

  const interval = setInterval(() => {
    audio.volume = Math.min(target, audio.volume + step);
    if (audio.volume >= target) clearInterval(interval);
  }, 50);
}

function fadeOut(audio, duration = 800) {
  if (!audio) return;
  
  const initialVolume = audio.volume;
  const step = initialVolume / (duration / 50);

  const interval = setInterval(() => {
    audio.volume = Math.max(0, audio.volume - step);
    if (audio.volume <= 0) {
      audio.pause();
      clearInterval(interval);
    }
  }, 50);
}

// Функции для управления звуком при воспроизведении видео
function handleVideoPlay() {
  playingVideosCount++;
  if (playingVideosCount === 1) {
    // Запоминаем текущую громкость
    originalVolume = masterVolume;
    
    // Плавно уменьшаем громкость фоновой музыки
    if (currentSound && soundEnabled) {
      fadeOut(currentSound, 500);
      
      // Устанавливаем громкость для всех звуков на минимум
      Object.values(sounds).forEach(sound => {
        sound.volume = 0;
      });
    }
  }
}

function handleVideoPause() {
  playingVideosCount--;
  if (playingVideosCount <= 0) {
    playingVideosCount = 0;
    
    // Восстанавливаем громкость фоновой музыки
    if (currentSound && soundEnabled) {
      fadeIn(currentSound, originalVolume, 500);
      
      // Восстанавливаем громкость для всех звуков
      Object.values(sounds).forEach(sound => {
        sound.volume = originalVolume;
      });
    }
  }
}


function playSound(name) {
  console.log('playSound вызван с аргументом:', name);
  
  const nextSound = sounds[name];
  if (!nextSound) {
    console.error('Звук не найден:', name);
    return;
  }

  // Если это тот же самый звук, ничего не делаем
  if (currentSound === nextSound) {
    console.log('Этот звук уже играет');
    return;
  }

  // Останавливаем ВСЕ звуки перед воспроизведением нового
  Object.values(sounds).forEach(sound => {
    if (sound !== nextSound) {
      // Плавно выключаем и полностью останавливаем
      sound.pause();
      sound.currentTime = 0;
      sound.volume = 0;
    }
  });

  // Если был текущий звук, плавно его выключаем
   if (currentSound && currentSound !== nextSound) {
    console.log('Плавно выключаем предыдущий звук');
    
    // Создаем копию текущего звука для плавного выключения
    const prevSound = currentSound;
    const prevVolume = prevSound.volume;
    
    // Плавно уменьшаем громкость текущего звука
    const fadeOutInterval = setInterval(() => {
      prevSound.volume = Math.max(0, prevSound.volume - (prevVolume / 20));
      if (prevSound.volume <= 0.01) {
        clearInterval(fadeOutInterval);
        prevSound.pause();
        prevSound.currentTime = 0;
        prevSound.volume = 0;
      }
    }, 50);
  }

  // Плавно включаем новый звук
  currentSound = nextSound;
  
   if (soundEnabled) {
    console.log('Плавно включаем новый звук:', name);
    
    // Сбрасываем время и громкость
    currentSound.currentTime = 0;
    currentSound.volume = 0;
    
    // Начинаем воспроизведение
    currentSound.play().catch(error => {
      console.log('Ошибка воспроизведения:', error);
    });
    
    // Плавное увеличение громкости (немного медленнее)
    const fadeInInterval = setInterval(() => {
      currentSound.volume = Math.min(masterVolume, currentSound.volume + (masterVolume / 20));
      if (currentSound.volume >= masterVolume - 0.01) {
        clearInterval(fadeInInterval);
        currentSound.volume = masterVolume;
      }
    }, 50);
  } else {
    console.log('Звук отключен, не включаем');
    currentSound.volume = 0;
  }
}

// Обработчик громкости
volumeSlider.addEventListener('input', () => {
  masterVolume = parseFloat(volumeSlider.value);

  Object.values(sounds).forEach(sound => {
    sound.volume = masterVolume;
  });

  // Обновляем класс muted
  if (!soundEnabled || masterVolume === 0) {
    soundToggleBtn.classList.add('muted');
  } else {
    soundToggleBtn.classList.remove('muted');
  }
});

// Обработчик кнопки звука
// soundToggleBtn.addEventListener('click', () => {
//   soundEnabled = !soundEnabled;

//   if (soundEnabled) {
//     // При включении звука проверяем громкость
//     if (masterVolume === 0) {
//       soundToggleBtn.classList.add('muted');
//     } else {
//       soundToggleBtn.classList.remove('muted');
//     }
//     if (currentSound) {
//       fadeIn(currentSound, masterVolume);
//     }
//   } else {
//     soundToggleBtn.classList.add('muted');
//     if (currentSound) {
//       fadeOut(currentSound);
//     }
//   }
// });

soundToggleBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    soundToggleBtn.classList.remove('muted');
    if (currentSound) {
      // Если звук уже воспроизводится, но muted? Просто убедимся
      if (currentSound.paused) {
        currentSound.play().catch(e => console.log('Play failed:', e));
      }
      fadeIn(currentSound, masterVolume);
    } else {
      // Если currentSound нет, может быть, стоит создать?
    }
  } else {
    soundToggleBtn.classList.add('muted');
    if (currentSound) {
      fadeOut(currentSound);
    }
  }
});

// Рендер сцены
function renderSceneStep(container, step) {
  container.innerHTML = "";

  const stepEl = document.createElement("div");
  stepEl.className = "scene-step";
  if (step.textCenter) {
    stepEl.classList.add("text-center");
  }

  const stepContent = document.createElement("div");
  stepContent.className = "scene-step-content";

  const hasMedia = Array.isArray(step.media) && step.media.length > 0;

  if (!hasMedia) {
    stepEl.classList.add("no-media");
  }

  if (hasMedia) {
    const mediaCol = document.createElement("div");
    mediaCol.className = "media-column";

    step.media.forEach(item => {
      if (step.media.length === 2) {
        mediaCol.classList.add("two-media");
      }

      if (item.type === "image") {
        const img = document.createElement("img");
        img.src = item.src;
        mediaCol.appendChild(img);
      }

      if (item.type === "video") {
        // Для круглого видео создаем обертку
        if (item.circle) {
          const wrapper = document.createElement("div");
          wrapper.className = "circle-video-wrapper video-paused";
          
          const video = document.createElement("video");
          video.src = item.src;

          if (item.poster) {
            video.poster = item.poster;   // ← добавляем постер
          }

          video.classList.add('circle-video');
          // video.muted = true; // Для обхода политики автовоспроизведения
          
          // Обновляем класс обертки при изменении состояния видео
          video.addEventListener('play', function() {
            wrapper.classList.remove('video-paused');
          });
          
          video.addEventListener('pause', function() {
            wrapper.classList.add('video-paused');
          });
          
          video.addEventListener('ended', function() {
            wrapper.classList.add('video-paused');
          });
          
          // Обновляем состояние при загрузке
          video.addEventListener('loadeddata', function() {
            if (video.paused) {
              wrapper.classList.add('video-paused');
            } else {
              wrapper.classList.remove('video-paused');
            }
          });
          
          // Обработчик клика для воспроизведения/паузы
          wrapper.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (video.paused) {
              video.play().catch(e => {
                console.log("Ошибка воспроизведения:", e);
              });
            } else {
              video.pause();
            }
          });
          
          // Обработчик клавиши пробел
          wrapper.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
              e.preventDefault();
              if (video.paused) {
                video.play();
              } else {
                video.pause();
              }
            }
          });
          
          // Делаем обертку focusable для клавиатуры
          wrapper.tabIndex = 0;
          
          // Показываем controls только в полноэкранном режиме
          document.addEventListener('fullscreenchange', function() {
            if (document.fullscreenElement === wrapper) {
              video.controls = true;
            } else {
              video.controls = false;
            } 
          });
          
          video.addEventListener("dblclick", function(e) {
            e.stopPropagation();
            e.preventDefault();
          });

          
          // Стандартные обработчики событий для видео
          video.addEventListener('play', handleVideoPlay);
          video.addEventListener('pause', handleVideoPause);
          video.addEventListener('ended', handleVideoPause);
          
          // Обработчик для выхода из полноэкранного режима
          video.addEventListener('fullscreenchange', function() {
            if (!document.fullscreenElement) {
              if (video.paused) {
                handleVideoPause();
              }
            }
          });
          
          wrapper.appendChild(video);
          mediaCol.appendChild(wrapper);

          if (item.caption) {
            mediaCol.classList.add('has-caption');
            const caption = document.createElement('div');
            caption.className = 'video-caption';
            caption.textContent = item.caption;
            mediaCol.appendChild(caption);
          }
          
        } else {
          // Обычное видео с controls
          const video = document.createElement("video");
          video.src = item.src;
          if (item.poster) {
            video.poster = item.poster;     // ← добавляем постер
          }
          video.controls = true;
          
          // Обработчик для выхода из полноэкранного режима
          video.addEventListener('fullscreenchange', function() {
            if (document.fullscreenElement === video) {
              // В полноэкранном режиме — contain
              video.style.objectFit = 'contain';
            } else {
              // При выходе — возвращаем cover (удаляем инлайн-стиль)
              video.style.objectFit = '';
            }
            if (!document.fullscreenElement) {
              if (video.paused) {
                handleVideoPause();
              }
            }
          });

          // Стандартные обработчики событий для видео
          video.addEventListener('play', handleVideoPlay);
          video.addEventListener('pause', handleVideoPause);
          video.addEventListener('ended', handleVideoPause);
          
          mediaCol.appendChild(video);
        }
      }
    });

    stepEl.appendChild(mediaCol);
  }

  const textCol = document.createElement("div");
  textCol.className = "text-column";

  // Создаем контейнер для текстового контента
  const textContainer = document.createElement("div");
  textContainer.className = "text-content-container";

  // Создаем контейнер для текста
  const textInner = document.createElement("div");
  textInner.className = "text-inner";
  
  textContainer.appendChild(textInner);
  textCol.appendChild(textContainer);
  stepContent.appendChild(textCol);
  stepEl.appendChild(stepContent);
  container.appendChild(stepEl);

  return textInner; // Возвращаем контейнер для текста
}


// Вступление

const introSteps = [
  {
    text: "Свинарник — это не просто пруд. Теперь для тринашки это особое место. ",
    media: [
      { type: "image", src: "/media/intro/map.jpg" }
    ]
  },
  {
    text: "Когда мы были мелкими, то часто летом приходили сюда купаться. Кто-то с друзьями, кто-то с родителями.",
    media: [
      { type: "image", src: "/media/intro/pool.jpg" }
    ]
  },
  {
    text: "Я помню, что первый раз в жизни увидел здесь стрекозу.",
    media: [
      { type: "image", src: "media/intro/dragonfly.jpg" }
    ]
  },
  {
    text: "Нам(тринашке) было интересно посетить это место зимой, идя по снежному лесу.",
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
          <p>   
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

// <p style="font-size: 36px;"></p>


let introIndex = 0;

const introSection = document.getElementById("intro");
const introContainer = document.querySelector("#intro .scene-content");
const startBtn = document.getElementById("intro-start");
const nextBtn = document.getElementById("intro-finish");



function typeText(container, text, onFinish) {
  container.innerHTML = "";
  
  const p = document.createElement("p");
  p.style.cssText = "margin: 0; padding: 0; width: 100%;";
  
  container.appendChild(p);
  
  let i = 0;
  const interval = setInterval(() => {
    p.innerHTML += text[i];
    i++;
    
    if (i >= text.length) {
      clearInterval(interval);
      if (onFinish) onFinish();
    }
  }, 10);
}

startBtn.addEventListener("click", () => {
  // // Включаем звук для вступления
  // playSound('intro');

  introSection.classList.add("started");
  startBtn.hidden = true;

  introContainer.style.display = "flex";
  const logo = document.querySelector(".intro-logo");
  if (logo) {
    logo.style.opacity = "0";
    logo.style.transform = "scale(0.95)";
  }

  if (soundEnabled) {
    playSound('intro');
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
    text: "Илья(Марвел), Никита(Чипик) и Никита(Пого) участвовали в первой ходке.",
    media: [
      { type: "image", src: "media/first/chair.jpg" }
    ]
  },
  {
    text: "Нам предостоял нелегкий маршрут. Целых два дня перед походом шел снег. Тропа не была протопатна. На верхушке снежного наста виднелись только следы от лыж.",
    media: [
      { type: "image", src: "media/first/1.jpg" }
    ]
  },
  {
    text: "Первый отдых мы устроили у Глинки - это тоже небольшой пруд, мы часто плавали в нем. Дальше Чипик решил покататься на дереве. Пого и Илью это очень позабавило!",
    media: [
      { type: "video", src: "media/first/1.mp4", poster: "media/first/1_poster.jpg"}
    ]
  },
  {
    text: "А этот кадр был сделан в относительной близости к заветному месту, когда Илья забрался на упавшие деревья.",
    media: [
      { type: "image", src: "media/first/2.jpg"}
    ]
  },
  {
    text: "Наконец-то мы пришли на свинарник. Помню как мы катались в школе на физкультуре на лыжах вниз по этому склону.",
    media: [
      { type: "image", src: "media/first/3.jpg"}
    ]
  },
  {
    text: "Далее мы пытались развести костер, в ход шло всё: зажигалки, бумага, береста. Однако все наши попытки были тщетны. Природа взяла верх над нами.",
    media: [
      { type: "image", src: "media/first/4.jpg"}
    ]
  },
  {
    text: "Мы поняли, что должны вернуться в это место ночью и развести огонь. Для этого мы созвали всю тринашку. Поставленная задача будет выполнена!",
    media: [
      { type: "video", src: "media/first/circle_tg.mp4", circle: true, caption: "Нажми на кружок, чтобы просмотреть его", poster: "media/first/circle_tg_poster.jpg"}
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
  console.log('playFirstHikeStep вызван, индекс:', firstHikeIndex); // Для отладки

  firstNextBtn.hidden = true;

  if (firstHikeIndex < firstHikeSteps.length) {
    const step = firstHikeSteps[firstHikeIndex];

    console.log('Шаг для отображения:', step); // Для отладки

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
    text: "И вот наступила ночь... К нам присоединились: Матвей(Мотор), Дима(Курсед) и Артем.",
  },
  {
    text: "Мы собрались на вторую ходку. Более подготовленные и с боевым настроем. КОСТЕР БУДЕТ РАЗВЕДЕН!",
  },
  {
    text: "Прямо перед полянкой нас встретил Хранитель Свинарника. Мы предподнесли ему дань(винстон икстайл), после чего он пропустил нас к нужному месту.",
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
    text: "Мы общались, пили жидкий хлеб, ели свиные ушки ^_^ и наслаждались этим приятным моментом! ",
    media: [
      { type: "video", src: "media/second/1_second.mov", poster: "media/second/1_second_poster.jpg" }
    ]
  },
  {
    text: "Чипик",
    media: [
      { type: "image", src: "media/second/chipik_second.jpg"}
    ],
    textCenter: true
  },
  {
    text: "Так наше уютное место выглядело издалека. Там Тема и Курсед едят сосиски, которые стоят по 40р за упаковку. Потом их ели все(",
    media: [
      { type: "image", src: "media/second/eat_second.jpg" }
    ]
    
  },
  {
    text: "Когда мы решили уже уходить, то поняли, что у нас осталась бутылка с розжигом и ее надо утилизировать. ",
    media: [
      { type: "video", src: "media/second/burn_second.mov", poster: "media/second/burn_second_poster.jpg" }
    ]
  },
   {
    text: "Напоследок получилось такое мощное пламя! И на этой прекрасной ноте мы заканчиваем наш поход.",
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

finishSecondHikeBtn.addEventListener('click', () => {

  scenes.forEach(scene => scene.classList.remove('active'));
  const finalScene = document.getElementById('final');
  finalScene.classList.add('active');
  
  // Устанавливаем ночное время
  setTime('night');
  
  // Включаем финальную музыку
  playSound('final');
  
  // Показываем титры
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
  "Артем (Артем)"
];

function renderCredits() {
  const container = document.getElementById('credits-content');
  container.innerHTML = "";

  const title = document.createElement('h2')
  title.textContent = "Вся братва с тринашки молодец. Мы захватили свинарник!";
  container.appendChild(title);

  // Добавляем пробел после заголовка
  const spacerAfterTitle = document.createElement('div');
  spacerAfterTitle.className = 'spacer';
  container.appendChild(spacerAfterTitle);

  participants.forEach( name => {
    const p = document.createElement('p');
    p.textContent = name;
    container.appendChild(p);
  });

  const spacer = document.createElement('div');
  spacer.className = 'spacer';
  container.appendChild(spacer);

  const footer = document.createElement('p');
  footer.textContent = "Тринашка • Лес • Свинарник";
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
  const finalPhotoContainer = document.getElementById('final-photo-container');
  const finalPhoto = document.getElementById('final-photo');
  const restartButton = document.getElementById('restart-button');

  // Загружаем финальное фото
  finalPhoto.src = finalPhotoPath;

  // Используем более точное событие для определения, когда титры закончились
  let animationEnded = false;
  
  const checkIfCreditsFinished = () => {
    if (animationEnded) return;
    
    // Получаем текущую позицию титров
    const creditsRect = credits.getBoundingClientRect();
    
    // Если верхний край титров достиг верха экрана (или выше)
    if (creditsRect.bottom <= 0) {
      animationEnded = true;
      
      // Скрываем титры
      credits.style.display = 'none';
      credits.style.animation = 'none'; // Останавливаем анимацию
      
      // Показываем контейнер для фото
      finalPhotoContainer.style.display = 'flex';
      
      // Запускаем анимацию появления через небольшой промежуток времени
      setTimeout(() => {
        finalPhotoContainer.classList.add('show');
        
        // Показываем кнопку перезапуска через 3 секунды
        setTimeout(() => {
          restartButton.style.display = 'block';
        }, 3000);
      }, 500);
    }
  };

  // Проверяем каждые 100ms, достигли ли титры верха экрана
  const checkInterval = setInterval(checkIfCreditsFinished, 100);

  // Также слушаем событие окончания анимации как fallback
  credits.addEventListener('animationend', () => {
    clearInterval(checkInterval);
    if (!animationEnded) {
      // Если анимация закончилась, но мы еще не скрыли титры
      credits.style.display = 'none';
      finalPhotoContainer.style.display = 'flex';
      setTimeout(() => {
        finalPhotoContainer.classList.add('show');
        setTimeout(() => {
          restartButton.style.display = 'block';
        }, 3000);
      }, 500);
    }
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
    showParticles();
    enableNightParticles();
  }
}


// Поиск всех сцен
const scenes = document.querySelectorAll('.scene');

function showScene(id) {
  // Останавливаем все видео перед переходом на новую сцену
  document.querySelectorAll('video').forEach(video => {
    video.pause();
  });
  // Сбрасываем счетчик воспроизводящихся видео
  playingVideosCount = 0;

  // Если есть звук, приглушаем его перед переходом
  if (currentSound) {
    currentSound.volume = 0;
  }

  // Восстанавливаем громкость фоновой музыки
  if (currentSound && soundEnabled) {
    fadeIn(currentSound, originalVolume, 300);
  }

  scenes.forEach(scene => scene.classList.remove('active'));

  const nextScene = document.getElementById(id);
  nextScene.classList.add('active');

  // Воспроизводим звук для текущей сцены
  const soundToPlay = sceneToSoundMap[id];
  if (soundToPlay) {
    playSound(soundToPlay);
  }

  if (id === 'first-hike') {
    setTime('day');
    firstHikeIndex = 0;
    firstContainer.innerHTML = "";
    const toEveningBtn = document.getElementById('to-evening');
    const firstNextBtn = document.getElementById('first-next');
    if (toEveningBtn) toEveningBtn.hidden = true;
    if (firstNextBtn) firstNextBtn.hidden = false;
    playFirstHikeStep();
  }

  if (id === 'second-hike') {
    setTime('night');
    secondHikeIndex = 0;
    secondContainer.innerHTML = "";
    const finishBtn = document.getElementById('finish');
    const secondNextBtn = document.getElementById('second-next');
    if (finishBtn) finishBtn.hidden = true;
    if (secondNextBtn) secondNextBtn.hidden = false;
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


// Определение мобильного устройства (сенсорный экран)
function isTouchDevice() {
  return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
}

// Если устройство сенсорное – скрываем ползунок громкости
if (isTouchDevice()) {
  const volumeSlider = document.getElementById('sound-volume');
  if (volumeSlider) {
    volumeSlider.style.display = 'none';
  }
}