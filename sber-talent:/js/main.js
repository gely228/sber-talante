// Глобальные переменные
let currentPage = 'home';
let currentJobsTab = 'sber';
let selectedSkills = [];
let selectedRoles = [];

// Состояние пользователя
let currentUserResume = null;
let verificationStatus = 'unverified';

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    setupNavigation();
    renderPage('home');
    updateHeaderStatus();
});

function loadUserData() {
    const saved = localStorage.getItem('sberTalentResume');
    if (saved) {
        try {
            currentUserResume = JSON.parse(saved);
            if (currentUserResume.skills) selectedSkills = currentUserResume.skills;
        } catch(e) {}
    }
    const savedStatus = localStorage.getItem('verificationStatus');
    if (savedStatus) {
        verificationStatus = savedStatus;
    }
}

function saveUserData() {
    if (currentUserResume) {
        localStorage.setItem('sberTalentResume', JSON.stringify(currentUserResume));
    }
    localStorage.setItem('verificationStatus', verificationStatus);
}

function updateHeaderStatus() {
    const badge = document.getElementById('status-badge-header');
    if (!badge) return;
    if (verificationStatus === 'verified') {
        badge.innerHTML = '✅ Подтверждён';
        badge.className = 'status-badge-small';
        badge.style.background = '#E6F4EC';
        badge.style.color = '#008C4E';
    } else if (verificationStatus === 'pending') {
        badge.innerHTML = '⏳ На верификации';
        badge.className = 'status-badge-small';
        badge.style.background = '#FFF3E0';
        badge.style.color = '#ED6C02';
    } else if (currentUserResume) {
        badge.innerHTML = '📄 Резюме заполнено';
        badge.className = 'status-badge-small';
    } else {
        badge.innerHTML = '⚪ Войти';
        badge.className = 'status-badge-small';
    }
}

function setupNavigation() {
    const links = document.querySelectorAll('[data-page]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            renderPage(page);
        });
    });
    
    const logo = document.getElementById('logo-link');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            renderPage('home');
        });
    }
}

function renderPage(page) {
    currentPage = page;
    const app = document.getElementById('app');
    if (!app) return;
    
    switch(page) {
        case 'home':
            app.innerHTML = renderHomePage();
            break;
        case 'jobs':
            app.innerHTML = renderJobsPage();
            renderJobsList();
            break;
        case 'events':
            app.innerHTML = renderEventsPage();
            break;
        case 'resume':
            app.innerHTML = renderResumePage();
            break;
        case 'team':
            app.innerHTML = renderTeamPage();
            break;
        case 'cards':
            app.innerHTML = renderCardsPage();
            setTimeout(() => {
                initCardStack();
            }, 100);
            break;
        default:
    }
    
    // Обновляем активную ссылку
    document.querySelectorAll('[data-page]').forEach(link => {
        if (link.getAttribute('data-page') === page) {
            link.style.color = '#00A35E';
            link.style.fontWeight = '600';
        } else {
            link.style.color = '#1A1A1A';
            link.style.fontWeight = '500';
        }
    });
    
    updateHeaderStatus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderJobsList() {
    const container = document.getElementById('jobs-list');
    if (!container) return;
    
    if (currentJobsTab === 'sber') {
        container.innerHTML = renderJobCards(sberJobs, 'sber');
    } else {
        container.innerHTML = renderJobCards(partnerJobs, 'partner');
    }
}

function switchJobsTab(tab) {
    currentJobsTab = tab;
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach((btn, idx) => {
        if ((tab === 'sber' && btn.innerText.includes('Сбера')) || (tab === 'partner' && btn.innerText.includes('партнёров'))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderJobsList();
}

function navigateTo(page) {
    renderPage(page);
}

function applyForJob(jobTitle) {
    if (!currentUserResume) {
        alert('Сначала заполните резюме в разделе "Моё резюме"');
        renderPage('resume');
        return;
    }
    alert(`✅ Заявка на стажировку "${jobTitle}" отправлена!\n\nМы свяжемся с вами в ближайшее время.`);
}

function toggleSkill(skill) {
    const tags = document.querySelectorAll('.skill-tag');
    tags.forEach(tag => {
        if (tag.innerText === skill) {
            tag.classList.toggle('selected');
        }
    });
    
    if (selectedSkills.includes(skill)) {
        selectedSkills = selectedSkills.filter(s => s !== skill);
    } else {
        selectedSkills.push(skill);
    }
    
    if (currentUserResume) {
        currentUserResume.skills = selectedSkills;
        saveUserData();
    }
}

function saveResumeFromForm() {
    const fullname = document.getElementById('fullname')?.value || '';
    const grade = document.getElementById('grade')?.value || '';
    const city = document.getElementById('city')?.value || '';
    const achievements = document.getElementById('achievements')?.value || '';
    const projects = document.getElementById('projects')?.value || '';
    
    if (!fullname) {
        alert('Пожалуйста, заполните ФИО');
        return;
    }
    
    currentUserResume = {
        fullname,
        grade,
        city,
        achievements,
        projects,
        skills: selectedSkills
    };
    
    saveUserData();
    updateHeaderStatus();
    alert('Резюме сохранено!');
}

function requestVerification() {
    if (!currentUserResume) {
        alert('Сначала заполните резюме');
        return;
    }
    if (!currentUserResume.achievements || currentUserResume.achievements.trim() === '') {
        alert('Укажите ваши достижения (олимпиады, проекты) для верификации');
        return;
    }
    
    verificationStatus = 'pending';
    saveUserData();
    updateHeaderStatus();
    alert('✅ Заявка на верификацию отправлена. Данные проверяются через Госуслуги. Обычно это занимает до 3 рабочих дней.');
    renderPage('resume');
}

function toggleRole(role) {
    const tags = document.querySelectorAll(`[data-role="${role}"]`);
    tags.forEach(tag => {
        tag.classList.toggle('selected');
    });
    
    if (selectedRoles.includes(role)) {
        selectedRoles = selectedRoles.filter(r => r !== role);
    } else {
        selectedRoles.push(role);
    }
}

function findTeamHandler() {
    if (!currentUserResume) {
        alert('Сначала заполните паспорт достижений, чтобы мы могли подобрать вам команду');
        renderPage('resume');
        return;
    }
    
    const projectName = document.getElementById('projectName')?.value || 'Проект';
    const requirements = document.getElementById('requirements')?.value || '';
    
    let filtered = [...candidates];
    filtered.sort((a, b) => {
        if (a.status === 'verified' && b.status !== 'verified') return -1;
        if (a.status !== 'verified' && b.status === 'verified') return 1;
        return 0;
    });
    
    if (selectedRoles.length > 0) {
        filtered = filtered.filter(c => 
            c.skills.some(skill => selectedRoles.includes(skill))
        );
    }
    
    if (currentUserResume.achievements) {
        const userAchieve = currentUserResume.achievements.toLowerCase();
        filtered.forEach(c => {
            const cAchieve = c.achievements.toLowerCase();
            if ((userAchieve.includes('высшая проба') && cAchieve.includes('высшая проба')) ||
                (userAchieve.includes('всош') && cAchieve.includes('всош'))) {
                c.matchBonus = '🎯 Совпадает олимпиада';
            } else {
                c.matchBonus = '';
            }
        });
        
        filtered.sort((a, b) => {
            if (a.matchBonus && !b.matchBonus) return -1;
            if (!a.matchBonus && b.matchBonus) return 1;
            return 0;
        });
    }
    
    const resultsHtml = `
        <div class="card">
            <h3>Результаты подбора для проекта «${escapeHtml(projectName)}»</h3>
            <p style="color: var(--sber-gray); margin-bottom: 20px;">${escapeHtml(requirements) || 'Подобраны кандидаты по вашим критериям'}</p>
            ${filtered.length === 0 ? '<p>По вашему запросу никого не найдено. Попробуйте изменить роли.</p>' : ''}
            ${filtered.map(c => `
                <div class="candidate-card">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
                        <div style="flex: 1;">
                            <h3>${escapeHtml(c.name)} ${c.matchBonus ? `<span style="color: var(--sber-green); font-size: 13px;">${c.matchBonus}</span>` : ''}</h3>
                            <p style="margin: 6px 0;">Навыки: ${c.skills.join(', ')}</p>
                            <p style="margin: 6px 0;">Достижения: ${escapeHtml(c.achievements)}</p>
                            <p>Город: ${escapeHtml(c.city)}</p>
                        </div>
                        <div style="text-align: right;">
                            <div><span class="status-badge ${c.status === 'verified' ? 'status-verified' : 'status-unverified'}">
                                ${c.status === 'verified' ? '✅ Подтверждён' : '⚡ Не подтверждён'}
                            </span></div>
                            <button class="btn-outline" style="margin-top: 12px;" onclick="alert('Приглашение отправлено пользователю ${escapeHtml(c.name)}')">Пригласить в команду</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    const container = document.getElementById('teamResults');
    if (container) {
        container.innerHTML = resultsHtml;
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}