const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');
let database = [];
let currentSection = 'практика';

function toggleMenu() {
    const menu = document.getElementById('color-menu');
    menu.style.display = (menu.style.display === 'grid') ? 'none' : 'grid';
}

function setTheme(color) {
    document.documentElement.style.setProperty('--neon-color', color);
    localStorage.setItem('user-neon', color);
    document.getElementById('color-menu').style.display = 'none';
    const mainBtn = document.getElementById('main-theme-btn');
    mainBtn.style.borderColor = color;
    mainBtn.style.boxShadow = `0 0 15px ${color}`;
}

// ПЕРЕКЛЮЧЕНИЕ СЕКЦИЙ
function setSection(section) {
    currentSection = section;
    document.getElementById('tab-pract').classList.toggle('active', section === 'практика');
    document.getElementById('tab-lect').classList.toggle('active', section === 'лекция');
    applyFilters();
}

const savedColor = localStorage.getItem('user-neon') || '#ffffff';
setTheme(savedColor);

fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        applyFilters();
        searchInput.oninput = () => applyFilters();
    });

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    
    // 1. Фильтруем строго: или Лекции, или Практики
    let filtered = database.filter(i => i.type.toLowerCase() === currentSection);
    
    // 2. Поиск
    if (query) {
        filtered = filtered.filter(i => i.subject.toLowerCase().includes(query));
    }
    
    render(filtered);
}

function render(items) {
    if (items.length === 0) {
        contentDiv.innerHTML = '<div class="col-span-full py-20 text-center opacity-20 font-black italic">ПУСТО</div>';
        return;
    }

    contentDiv.innerHTML = items.map(item => `
        <div class="glass-card animate__animated animate__fadeInUp">
            <div class="subject-name neon-text">${item.subject}</div>
            <a href="${item.link}" target="_blank" class="btn-open">Открыть</a>
        </div>
    `).join('');
}