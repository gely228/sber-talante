// Компоненты для отрисовки страниц

function renderHomePage() {
    const statusBadge = getStatusBadge();
    
    return `
        <div class="hero animate-in">
            <h1>Твои достижения <span>работают на тебя</span></h1>
            <p>Стажировки, гранты, хакатоны и команда — в одном окне</p>
            ${statusBadge}
        </div>
        <div class="grid-4">
            <div class="card feature-card" onclick="navigateTo('jobs')">
                <div class="emoji">💼</div>
                <h3>Все стажировки</h3>
                <p>Стажировки Сбера и партнёров</p>
            </div>
            <div class="card feature-card" onclick="window.open('${externalLinks.products}', '_blank')">
                <div class="emoji">📚</div>
                <h3>Продукты Сбера</h3>
                <p>Курсы и обучение от Сбера</p>
            </div>
            <div class="card feature-card" onclick="navigateTo('events')">
                <div class="emoji">🏆</div>
                <h3>Хакатоны</h3>
                <p>Акселераторы и соревнования</p>
            </div>
            <div class="card feature-card" onclick="navigateTo('team')">
                <div class="emoji">🤝</div>
                <h3>Найти команду</h3>
                <p>AI подберёт соучастников</p>
            </div>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <button class="btn-primary" onclick="navigateTo('resume')">📝 Заполнить резюме</button>
        </div>
    `;
}

function getStatusBadge() {
    if (verificationStatus === 'verified') {
        return `<div style="margin-top: 24px;"><span class="status-badge status-verified">✅ Подтверждённый олимпиадник</span></div>`;
    } else if (verificationStatus === 'pending') {
        return `<div style="margin-top: 24px;"><span class="status-badge status-pending">⏳ На верификации</span></div>`;
    } else {
        return `<div style="margin-top: 24px;"><span class="status-badge status-unverified">⚪ Статус не подтверждён</span></div>`;
    }
}

function renderJobsPage() {
    return `
        <div style="margin: 40px 0;" class="animate-in">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 16px;">
                <h2>Стажировки</h2>
                <button class="btn-outline" onclick="navigateTo('resume')">📄 Моё резюме</button>
            </div>
            <div class="tabs">
                <button class="tab-btn active" onclick="switchJobsTab('sber')">Стажировки Сбера</button>
                <button class="tab-btn" onclick="switchJobsTab('partner')">Стажировки партнёров</button>
            </div>
            <div id="jobs-list"></div>
        </div>
    `;
}

function renderJobCards(jobs, type) {
    let html = '';
    jobs.forEach(job => {
        const title = type === 'sber' ? job.title : `${job.title} — ${job.company}`;
        html += `
            <div class="card job-card">
                <div>
                    <h3 style="margin-bottom: 6px;">${title}</h3>
                    <p style="color: var(--sber-gray);">${job.direction || job.company} • Дедлайн: ${job.deadline}</p>
                </div>
                <button class="btn-outline" onclick="applyForJob('${title.replace(/'/g, "\\'")}')">Подать заявку</button>
            </div>
        `;
    });
    return html;
}

function renderEventsPage() {
    let html = `
        <div style="margin: 40px 0;" class="animate-in">
            <h2>Хакатоны и акселераторы</h2>
            <p style="color: var(--sber-gray); margin-bottom: 32px;">Участвуй в проектах Сбера — создавай, побеждай, развивайся</p>
            <div class="grid-3">
    `;
    
    events.forEach(event => {
        html += `
            <div class="card event-card" onclick="window.open('${event.link}', '_blank')">
                <div class="event-icon" style="font-size: 48px;">${event.icon}</div>
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <div style="margin-top: 16px;">
                    <span class="status-badge status-verified" style="background: #E8F3FF;">Перейти →</span>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            <div style="margin-top: 40px; text-align: center;">
                <p style="color: var(--sber-gray);">Ещё больше возможностей — в разделе <a href="#" onclick="navigateTo('jobs'); return false;" style="color: var(--sber-green);">«Стажировки»</a></p>
            </div>
        </div>
    `;
    
    return html;
}

function renderResumePage() {
    const saved = currentUserResume || {};
    const skillsHtml = availableSkills.map(skill => 
        `<span class="skill-tag ${saved.skills?.includes(skill) ? 'selected' : ''}" onclick="toggleSkill('${skill}')">${skill}</span>`
    ).join('');
    
    let verificationHtml = '';
    if (verificationStatus === 'verified') {
        verificationHtml = `<div class="verification-box"><span class="status-badge status-verified">✅ Статус: Подтверждённый олимпиадник</span><p style="margin-top: 16px;">Ваши достижения верифицированы через Госуслуги</p></div>`;
    } else if (verificationStatus === 'pending') {
        verificationHtml = `<div class="verification-box"><span class="status-badge status-pending">⏳ Статус: На верификации</span><p style="margin-top: 16px;">Ваша заявка обрабатывается</p></div>`;
    } else {
        verificationHtml = `<div class="verification-box"><p style="margin-bottom: 16px;">Подтвердите свои достижения через Госуслуги</p><button class="btn-primary" onclick="requestVerification()">Верифицировать достижения</button></div>`;
    }
    
    return `
        <div style="margin: 40px 0;" class="animate-in">
            <h2>Паспорт достижений</h2>
            <p style="color: var(--sber-gray); margin-bottom: 28px;">Заполните информацию — это ваше резюме для работодателей</p>
            
            <div class="card">
                <form id="resumeForm" class="resume-form">
                    <div class="form-group">
                        <label>ФИО</label>
                        <input type="text" id="fullname" value="${escapeHtml(saved.fullname || '')}" placeholder="Иванов Иван Иванович">
                    </div>
                    <div class="form-group">
                        <label>Класс</label>
                        <select id="grade">
                            <option value="9" ${saved.grade === '9' ? 'selected' : ''}>9 класс</option>
                            <option value="10" ${saved.grade === '10' ? 'selected' : ''}>10 класс</option>
                            <option value="11" ${saved.grade === '11' ? 'selected' : ''}>11 класс</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Город</label>
                        <input type="text" id="city" value="${escapeHtml(saved.city || '')}" placeholder="Москва">
                    </div>
                    <div class="form-group">
                        <label>Олимпиады и достижения</label>
                        <textarea id="achievements" rows="3" placeholder="Например: призёр ВсОШ по информатике 2025, победитель хакатона Сбера...">${escapeHtml(saved.achievements || '')}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Проекты и опыт</label>
                        <textarea id="projects" rows="2" placeholder="Например: разработал телеграм-бота для школы...">${escapeHtml(saved.projects || '')}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Навыки</label>
                        <div class="skills-container">${skillsHtml}</div>
                    </div>
                    <div>
                        <button type="button" class="btn-primary" onclick="saveResumeFromForm()">Сохранить резюме</button>
                    </div>
                </form>
            </div>
            
            ${verificationHtml}
        </div>
    `;
}

function renderTeamPage() {
    return `
        <div style="margin: 40px 0;" class="animate-in">
            <h2>Поиск команды</h2>
            <p style="color: var(--sber-gray); margin-bottom: 28px;">AI подберёт соучастников под ваш проект</p>
            
            <div class="card">
                <div class="form-group">
                    <label>Название проекта / идея</label>
                    <input type="text" id="projectName" placeholder="Например: Чат-бот для школьной библиотеки">
                </div>
                <div class="form-group">
                    <label>Какие роли нужны</label>
                    <div class="skills-container" id="rolesContainer">
                        ${availableSkills.map(skill => 
                            `<span class="skill-tag" onclick="toggleRole('${skill}')" data-role="${skill}">${skill}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="form-group">
                    <label>Описание требований к команде</label>
                    <textarea id="requirements" rows="2" placeholder="Кого ищем, какие задачи предстоят..."></textarea>
                </div>
                <button class="btn-primary" onclick="findTeamHandler()">Подобрать команду</button>
            </div>
            
            <div id="teamResults" style="margin-top: 40px;"></div>
        </div>
    `;
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