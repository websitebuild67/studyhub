let database = [];
let currentSection = 'практика';

// Элементы DOM
const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');

// 1. Переключение между ПРАКТИКОЙ и ЛЕКЦИЕЙ
function setSection(section) {
    currentSection = section;
    
    // Подсветка активной кнопки
    document.getElementById('tab-pract').classList.toggle('active', section === 'практика');
    document.getElementById('tab-lect').classList.toggle('active', section === 'лекция');
    
    render();
}

// 2. Загрузка данных из JSON
fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        render(); // Показываем данные сразу после загрузки
    })
    .catch(err => console.error("Ошибка загрузки данных:", err));

// 3. Функция отрисовки карточек предметов
function render() {
    const query = searchInput.value.toLowerCase();
    
    // Фильтруем записи по типу (с учетом твоей опечатки "пратика")
    const filteredData = database.filter(item => {
        const type = item.type.toLowerCase().replace('пратика', 'практика');
        return type === currentSection;
    });

    // Получаем список уникальных предметов для этого раздела
    const uniqueSubjects = [...new Set(filteredData.map(item => item.subject))]
        .filter(subject => subject.toLowerCase().includes(query));

    // Очищаем контейнер и выводим карточки
    if (uniqueSubjects.length === 0) {
        contentDiv.innerHTML = '<div class="col-span-full py-20 text-center opacity-20 font-black italic text-2xl">НИЧЕГО НЕ НАЙДЕНО</div>';
        return;
    }

    contentDiv.innerHTML = uniqueSubjects.map(subject => `
        <div class="glass-card animate__animated animate__fadeInUp">
            <div class="subject-name">${subject}</div>
            <div class="btn-open" onclick="goToSubject('${subject}')">Открыть темы</div>
        </div>
    `).join('');
}

// 4. Переход на страницу предмета с параметрами
function goToSubject(subjectName) {
    // Кодируем название, чтобы пробелы и символы не сломали ссылку
    const encodedName = encodeURIComponent(subjectName);
    const encodedType = encodeURIComponent(currentSection);
    
    // Перенаправляем пользователя
    window.location.href = `subject.html?name=${encodedName}&type=${encodedType}`;
}

// 5. Обработка ввода в поиск
searchInput.oninput = render;

// Применяем сохраненный цвет неона (если есть)
const savedColor = localStorage.getItem('user-neon') || '#bc13fe';
document.documentElement.style.setProperty('--neon-color', savedColor);