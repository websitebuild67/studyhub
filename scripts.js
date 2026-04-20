const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');
let database = [];

const allSubjects = [
    "Иностранный язык", "Математика", "История", "Литература", 
    "Физика", "Биология", "Информатика", "Русский Язык", 
    "Индивидуальный проект", "Химия", "География", "Обществознание"
];

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

const savedColor = localStorage.getItem('user-neon') || '#ffffff';
setTheme(savedColor);

fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        renderAll(data);
        searchInput.oninput = () => {
            const query = searchInput.value.toLowerCase();
            const filtered = database.filter(i => 
                i.title.toLowerCase().includes(query) || i.subject.toLowerCase().includes(query)
            );
            renderAll(filtered);
        };
    });

function renderAll(items) {
    if (items.length === 0) {
        contentDiv.innerHTML = '<div class="py-20 text-center opacity-20 font-black uppercase italic tracking-widest">Ничего не найдено</div>';
        return;
    }

    let html = '';

    allSubjects.forEach(subject => {
        const subjectItems = items.filter(i => i.subject.toLowerCase() === subject.toLowerCase());
        
        if (subjectItems.length > 0) {
            // Разделяем внутри предмета на лекции и практики
            const lectures = subjectItems.filter(i => i.type.toLowerCase() === 'лекция');
            const practices = subjectItems.filter(i => i.type.toLowerCase() === 'практика');

            html += `
                <div class="subject-block animate__animated animate__fadeIn">
                    <h2 class="subject-title"><span class="neon-text">${subject}</span></h2>
                    
                    ${lectures.length > 0 ? `
                        <div class="type-header">Лекции</div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            ${lectures.map(item => cardTemplate(item)).join('')}
                        </div>
                    ` : ''}

                    ${practices.length > 0 ? `
                        <div class="type-header">Практики</div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${practices.map(item => cardTemplate(item)).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
    });

    contentDiv.innerHTML = html;
}

function cardTemplate(item) {
    return `
        <div class="glass-card">
            <h3>${item.title}</h3>
            <a href="${item.link}" target="_blank" class="btn-open">Открыть материал</a>
        </div>
    `;
}