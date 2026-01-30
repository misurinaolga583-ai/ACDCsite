// Навигация для мобильных устройств
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Инициализация слайдера на главной странице
    initPosterSlider();
    
    // Инициализация аудиоплеера на странице треков
    if (document.querySelector('.player')) {
        initAudioPlayer();
    }
    
    // Инициализация формы покупки билетов
    if (document.getElementById('ticketForm')) {
        initTicketForm();
    }
});

// Слайдер с постерами
function initPosterSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (!sliderContainer || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Функция обновления слайдера
    function updateSlider() {
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Обновление активной точки
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Следующий слайд
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }
    
    // Предыдущий слайд
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    // Переход к конкретному слайду
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }
    
    // События для кнопок
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // События для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Автопрокрутка
    setInterval(nextSlide, 5000);
}

// Аудиоплеер
// Аудиоплеер - ИСПРАВЛЕННАЯ ВЕРСИЯ
function initAudioPlayer() {
    console.log("Инициализация аудиоплеера...");
    
    const audio = new Audio();
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progress');
    const volumeBar = document.getElementById('volumeLevel');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const trackTitle = document.querySelector('.track-title');
    const trackArtist = document.querySelector('.track-artist');
    const trackAlbum = document.querySelector('.track-album');
    
    let isPlaying = false;
    let currentTrackIndex = 0;
    
    // Функция для форматирования времени
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Загрузка трека - ИСПРАВЛЕННАЯ ВЕРСИЯ
    function loadTrack(index) {
        console.log(`Загрузка трека ${index}...`);
        
        // Проверка индекса
        if (index < 0 || index >= playlistItems.length) {
            console.error("Некорректный индекс трека:", index);
            return;
        }
        
        const track = playlistItems[index];
        const src = track.getAttribute('data-src');
        const title = track.getAttribute('data-title');
        const artist = track.getAttribute('data-artist');
        const album = track.getAttribute('data-album');
        
        console.log(`Загружаем: ${src}`);
        
        // Останавливаем текущее воспроизведение
        audio.pause();
        
        // Сбрасываем источник
        audio.src = src;
        
        // Обновляем информацию о треке
        trackTitle.textContent = title;
        trackArtist.textContent = artist;
        trackAlbum.textContent = `Album: ${album}`;
        
        // Обновление активного элемента в плейлисте
        playlistItems.forEach(item => item.classList.remove('active'));
        track.classList.add('active');
        
        // Сброс прогресса
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        durationEl.textContent = '0:00';
        
        // Установка обработчиков события
        audio.onloadedmetadata = function() {
            console.log(`Метаданные загружены. Длительность: ${audio.duration}`);
            durationEl.textContent = formatTime(audio.duration);
        };
        
        audio.onerror = function(e) {
            console.error("Ошибка загрузки аудиофайла:", src, e);
            alert(`Не удалось загрузить трек: ${title}\nПроверьте путь: ${src}`);
        };
        
        audio.oncanplaythrough = function() {
            console.log("Аудио готово к воспроизведению");
        };
        
        // Загружаем аудио
        audio.load();
        
        // Если был режим воспроизведения, запускаем
        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    console.log("Воспроизведение начато");
                }).catch(error => {
                    console.error("Ошибка воспроизведения:", error);
                    isPlaying = false;
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                });
            }
        }
        
        // Обновляем текущий индекс
        currentTrackIndex = index;
    }
    
    // Воспроизведение/пауза
    function togglePlay() {
        if (audio.src === '') {
            loadTrack(currentTrackIndex);
        }
        
        if (isPlaying) {
            audio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(error => {
                    console.error("Ошибка воспроизведения:", error);
                    alert("Не удалось воспроизвести трек. Проверьте консоль для подробностей.");
                });
            }
        }
        isPlaying = !isPlaying;
    }
    
    // Обновление прогресса
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }
    
    // Установка прогресса при клике на прогресс-бар
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        if (!isNaN(duration)) {
            audio.currentTime = (clickX / width) * duration;
        }
    }
    
    // Следующий трек
    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlistItems.length;
        loadTrack(currentTrackIndex);
    }
    
    // Предыдущий трек
    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlistItems.length) % playlistItems.length;
        loadTrack(currentTrackIndex);
    }
    
    // Обновление громкости
    function setVolume(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const volume = Math.min(Math.max(clickX / width, 0), 1);
        
        audio.volume = volume;
        volumeBar.style.width = `${volume * 100}%`;
    }
    
    // Инициализация громкости
    function initVolume() {
        audio.volume = 0.7;
        volumeBar.style.width = '70%';
    }
    
    // События
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    
    const progressBarContainer = document.querySelector('.progress-bar');
    progressBarContainer.addEventListener('click', setProgress);
    
    const volumeBarContainer = document.querySelector('.volume-bar');
    volumeBarContainer.addEventListener('click', setVolume);
    
    // Загрузка треков из плейлиста
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            console.log(`Кликнули на трек ${index}`);
            loadTrack(index);
            if (!isPlaying) {
                togglePlay();
            }
        });
    });
    
    // Инициализация
    console.log(`Всего треков в плейлисте: ${playlistItems.length}`);
    loadTrack(0);
    initVolume();
    
    // Тестовая функция для проверки путей
    window.testAudioPaths = function() {
        console.log("=== Тестирование путей к аудиофайлам ===");
        playlistItems.forEach((item, index) => {
            const src = item.getAttribute('data-src');
            console.log(`Трек ${index + 1}: ${src}`);
            
            // Создаем тестовый запрос
            fetch(src)
                .then(response => {
                    if (response.ok) {
                        console.log(`✓ Трек ${index + 1}: Файл найден`);
                    } else {
                        console.error(`✗ Трек ${index + 1}: Файл не найден (статус: ${response.status})`);
                    }
                })
                .catch(error => {
                    console.error(`✗ Трек ${index + 1}: Ошибка загрузки: ${error.message}`);
                });
        });
    };
    
    // Запускаем тест при инициализации
    setTimeout(() => {
        window.testAudioPaths();
    }, 1000);
}

// Форма покупки билетов
function initTicketForm() {
    const ticketButtons = document.querySelectorAll('.btn-ticket');
    const modal = document.getElementById('ticketModal');
    const modalClose = document.getElementById('modalClose');
    const concertInput = document.getElementById('concert');
    const ticketForm = document.getElementById('ticketForm');
    
    // Открытие модального окна
    ticketButtons.forEach(button => {
        button.addEventListener('click', function() {
            const concert = this.getAttribute('data-concert');
            concertInput.value = concert;
            modal.style.display = 'flex';
        });
    });
    
    // Закрытие модального окна
    modalClose.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Закрытие при клике вне модального окна
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Обработка формы
    ticketForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Сбор данных формы
        const formData = new FormData(this);
        const data = {
            concert: formData.get('concert'),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            quantity: formData.get('quantity'),
            category: formData.get('category'),
            date: new Date().toLocaleString()
        };
        
        // В реальном проекте здесь должен быть AJAX запрос к серверу
        // который сохраняет данные в файл tickets.txt
        
        // В данном случае мы просто эмулируем сохранение
        // и показываем сообщение
        console.log('Данные билета:', data);
        
        // Создаем строку для сохранения
        const ticketData = `
Концерт: ${data.concert}
ФИО: ${data.name}
Email: ${data.email}
Телефон: ${data.phone}
Количество билетов: ${data.quantity}
Категория: ${data.category}
Дата заказа: ${data.date}
---------------------------
`;
        
        // В реальном проекте здесь должен быть код для отправки данных на сервер
        // Для демонстрации мы просто сохраняем данные в localStorage
        // и предлагаем пользователю скачать файл
        saveTicketData(ticketData);
        
        // Показать сообщение об успехе
        alert('Билет успешно заказан! Данные сохранены. На вашу почту отправлено подтверждение.');
        
        // Закрыть модальное окно
        modal.style.display = 'none';
        
        // Сброс формы
        ticketForm.reset();
    });
    
    // Функция для сохранения данных о билете
    function saveTicketData(data) {
        // В реальном проекте здесь должен быть AJAX запрос к серверу
        // который добавляет данные в файл tickets.txt
        
        // Для демонстрации мы используем localStorage
        // и предлагаем скачать файл
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ticket_data.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Также сохраняем в localStorage для демонстрации
        const tickets = JSON.parse(localStorage.getItem('acdc_tickets') || '[]');
        tickets.push(data);
        localStorage.setItem('acdc_tickets', JSON.stringify(tickets));
    }
}