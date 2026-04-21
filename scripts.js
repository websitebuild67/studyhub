let database = [];
let currentSection = 'практика';
const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');

const colors = [
    '#bc13fe', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff',
    '#ff00ff', '#ffa500', '#ffc0cb', '#800000', '#008000', '#000080',
    '#808000', '#800080', '#008080', '#c0c0c0', '#808080', '#9999ff',
    '#99ff99', '#ff9999', '#ffff99', '#ff99ff', '#99ffff', '#ffffff'
];

function initTheme() {
    const menu = document.getElementById('color-menu');
    if (menu) {
        menu.innerHTML = colors.map(c => `
            <div class="color-dot" style="background: ${c}" onclick="setTheme('${c}')"></div>
        `).join('');
    }
    const saved = localStorage.getItem('user-neon') || '#bc13fe';
    setTheme(saved);
}

window.toggleMenu = function() {
    const m = document.getElementById('color-menu');
    m.style.display = (m.style.display === 'grid') ? 'none' : 'grid';
}

window.setTheme = function(color) {
    document.documentElement.style.setProperty('--neon-color', color);
    localStorage.setItem('user-neon', color);
}

window.setSection = function(section) {
    currentSection = section;
    document.getElementById('tab-pract').classList.toggle('active', section === 'практика');
    document.getElementById('tab-lect').classList.toggle('active', section === 'лекция');
    render();
}

fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        const stat = document.getElementById('stat-count');
        if (stat) stat.innerText = data.length;
        render();
    });

function render() {
    if (!contentDiv) return;
    const query = searchInput.value.toLowerCase();
    
    const filtered = database.filter(i => {
        const type = i.type.toLowerCase().replace('пратика', 'практика');
        return type === currentSection;
    });

    const unique = [...new Set(filtered.map(i => i.subject))]
        .filter(s => s.toLowerCase().includes(query));

    contentDiv.innerHTML = unique.map(subject => `
        <div class="glass-card animate__animated animate__fadeInUp">
            <div class="subject-name">${subject}</div>
            <button class="btn-open" onclick="goToSubject('${subject}')">Открыть темы</button>
        </div>
    `).join('');
}

window.goToSubject = function(name) {
    window.location.href = `subject.html?name=${encodeURIComponent(name)}&type=${currentSection}`;
}