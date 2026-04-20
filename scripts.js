const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');
let database = [];
let currentSection = 'практика';

// Твой полный список предметов
const allSubjects = [
    "Иностранный язык", "Математика", "История", "Литература", 
    "Физика", "Биология", "Информатика", "Русский Язык", 
    "Индивидуальный проект", "Химия", "География", "Обществознание"
];

// Управление меню стилей
function toggleMenu() {
    const menu = document.getElementById('color-menu');
    menu.style.display = (menu.style.display === 'grid') ? 'none' : 'grid';
}

// Смена темы и сохранение
function setTheme(color) {
    document.documentElement.style.setProperty('--neon-color', color);
    localStorage.setItem('user-neon', color);
    
    // Закрываем меню
    document.getElementById('color-menu').style.display = 'none';
    
    // Обновляем саму кнопку выбора
    const mainBtn = document.getElementById('main-theme-btn');
    mainBtn.style.borderColor = color;
    mainBtn.style.boxShadow = `0 0 15px ${color}`;
}

// Переключение между Лекциями и ПРАКТИКАМИ
function setSection(section) {
    currentSection = section;
    
    document.getElementById('tab-pract').classList.toggle('active', section === 'практика');
    document.getElementById('tab-lect').classList.toggle('active', section === 'лекция');
    
    applyFilters();
}

// Инициализация темы при загрузке
const savedColor = localStorage.getItem('user-neon') || '#ffffff';
setTheme(savedColor);

// Загрузка данных из JSON
fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        applyFilters();
        searchInput.oninput = () => applyFilters();
    })
    .catch(err => {
        console.error("Ошибка загрузки data.json:", err);
        contentDiv.innerHTML = '<div class="text-center text-red-500">Ошибка: Создай файл data.json</div>';
    });

// Фильтрация и поиск
function applyFilters() {
    const query = searchInput.value.toLowerCase();
    
    // Фильтруем по разделу (лекция/практика)
    let filtered = database.filter(i => i.type.toLowerCase() === currentSection);
    
    // Фильтруем по поисковому запросу
    if (query) {
        filtered = filtered.filter(i => 
            i.title.toLowerCase().includes(query) || i.subject.toLowerCase().includes(query)
        );
    }
    
    renderGrouped(filtered);
}

// Рендер с группировкой по предметам
function renderGrouped(items) {
    if (items.length === 0) {
        contentDiv.innerHTML = '<div class="py-20 text-center opacity-20 font-black uppercase italic tracking-widest">Ничего не найдено</div>';
        return;
    }

    let html = '';
    
    allSubjects.forEach(subject => {
        // Ищем работы конкретно для этого предмета
        const subjectItems = items.filter(i => i.subject.toLowerCase() === subject.toLowerCase());
        
        if (subjectItems.length > 0) {
            html += `
                <div class="animate__animated animate__fadeIn mb-16">
                    <h2 class="subject-group-title">${subject}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${subjectItems.map(item => `
                            <div class="glass-card">
                                <div class="text-[9px] uppercase tracking-[0.2em] opacity-40 mb-4 font-black">
                                    ${item.type}
                                </div>
                                <h3>${item.title}</h3>
                                <a href="${item.link}" target="_blank" class="btn-open">
                                    Открыть материал
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });

    contentDiv.innerHTML = html || '<div class="py-20 text-center opacity-20 font-black uppercase italic tracking-widest">В этом разделе пока нет материалов</div>';
}