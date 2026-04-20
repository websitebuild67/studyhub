const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');
const counters = {
    total: document.getElementById('count-total'),
    pract: document.getElementById('count-pract'),
    lect: document.getElementById('count-lect'),
    subj: document.getElementById('count-subj')
};

let database = [];
let currentFilter = 'all'; // Тип: практика/лекция
let currentSubject = 'all'; // Предмет: Физика и т.д.

fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        updateStats(data);
        render(data);

        searchInput.oninput = () => applyFilters();
    });

function updateStats(data) {
    counters.total.innerText = data.length;
    counters.pract.innerText = data.filter(i => i.type.toLowerCase() === 'практика').length;
    counters.lect.innerText = data.filter(i => i.type.toLowerCase() === 'лекция').length;
    counters.subj.innerText = [...new Set(data.map(i => i.subject))].length;
}

function filterByType(type) {
    currentFilter = type;
    document.querySelectorAll('.stat-card').forEach(el => el.classList.remove('stat-active'));
    if(type === 'all') document.getElementById('stat-all').classList.add('stat-active');
    if(type === 'практика') document.getElementById('stat-pract').classList.add('stat-active');
    if(type === 'лекция') document.getElementById('stat-lect').classList.add('stat-active');
    applyFilters();
}

function filterBySubject(subject) {
    currentSubject = subject;
    document.querySelectorAll('.subj-btn').forEach(btn => {
        btn.classList.remove('active-subj');
        if(btn.innerText.toLowerCase() === (subject === 'all' ? 'все' : subject.toLowerCase())) {
            btn.classList.add('active-subj');
        }
    });
    applyFilters();
}

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    let filtered = database;

    if (currentFilter !== 'all') filtered = filtered.filter(i => i.type.toLowerCase() === currentFilter);
    if (currentSubject !== 'all') filtered = filtered.filter(i => i.subject === currentSubject);
    
    filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(query) || i.subject.toLowerCase().includes(query)
    );

    render(filtered);
}

function render(items) {
    if (items.length === 0) {
        contentDiv.innerHTML = '<p class="text-slate-500 text-center col-span-full py-20 animate__animated animate__fadeIn">В этом разделе пока пусто...</p>';
        return;
    }

    contentDiv.innerHTML = items.map((item, idx) => `
        <div class="glass p-6 rounded-3xl card-hover transition-all animate__animated animate__fadeInUp" style="animation-delay: ${idx * 0.05}s">
            <div class="flex justify-between items-start mb-4 text-[10px] font-black uppercase tracking-widest">
                <span class="text-blue-400">${item.subject}</span>
                <span class="${item.type === 'Проект' ? 'text-orange-400' : 'text-slate-500'}">${item.type}</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-6 leading-tight h-12 overflow-hidden">${item.title}</h3>
            <a href="${item.link}" target="_blank" 
               class="block w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-xs text-center transition-all active:scale-95">
                ОТКРЫТЬ ДОСТУП
            </a>
        </div>
    `).join('');
}