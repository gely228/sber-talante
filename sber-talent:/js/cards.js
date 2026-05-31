// Карточки в стиле Tinder

let currentCardIndex = 0;
let cardStack = [];
let isAnimating = false;

function renderCardsPage() {
    // Загружаем непросмотренные карточки (кроме уже лайкнутых)
    const availableCards = swipeCandidates.filter(c => !likedIds.includes(c.id));
    currentCardIndex = 0;
    
    return `
        <div style="margin: 40px 0;" class="animate-in">
            <h2>🔥 Найди тиммейтов</h2>
            <p style="color: var(--sber-gray); margin-bottom: 16px;">Свайпай вправо ❤️ — если хочешь в команду, влево — пропустить</p>
            
            <div id="card-stack-container" style="position: relative; height: 520px; max-width: 420px; margin: 32px auto; display: flex; justify-content: center;">
                ${availableCards.length === 0 ? `
                    <div class="card" style="text-align: center; padding: 60px 40px;">
                        <div style="font-size: 64px;">🎉</div>
                        <h3 style="margin: 20px 0;">Ты посмотрел(а) всех!</h3>
                        <p>Возвращайся позже — появятся новые кандидаты</p>
                        <button class="btn-primary" onclick="navigateTo('team')" style="margin-top: 24px;">Перейти к поиску</button>
                    </div>
                ` : `
                    <div id="card-stack" style="position: relative; width: 100%; height: 100%;"></div>
                `}
            </div>
            
            <div style="display: flex; justify-content: center; gap: 40px; margin-top: 24px;">
                <button class="btn-outline" style="border-color: #FF4B4B; color: #FF4B4B; padding: 14px 28px;" onclick="swipeLeft()">
                    ✖️ Скип
                </button>
                <button class="btn-primary" style="background: linear-gradient(135deg, #FF4B8C, #FF6B9D); box-shadow: none;" onclick="swipeRight()">
                    ❤️ Лайк
                </button>
            </div>
            
            <div id="liked-message" style="text-align: center; margin-top: 24px; color: var(--sber-green); font-weight: 500;"></div>
        </div>
    `;
}

function initCardStack() {
    const container = document.getElementById('card-stack');
    if (!container) return;
    
    const availableCards = swipeCandidates.filter(c => !likedIds.includes(c.id));
    if (availableCards.length === 0) return;
    
    container.innerHTML = '';
    cardStack = [...availableCards];
    currentCardIndex = 0;
    
    renderCurrentCard();
}

function renderCurrentCard() {
    const container = document.getElementById('card-stack');
    if (!container) return;
    
    if (currentCardIndex >= cardStack.length) {
        // Все карточки просмотрены
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: 60px 40px;">
                <div style="font-size: 64px;">🎉</div>
                <h3 style="margin: 20px 0;">Ты посмотрел(а) всех!</h3>
                <p>Возвращайся позже — появятся новые кандидаты</p>
                <button class="btn-primary" onclick="navigateTo('team')" style="margin-top: 24px;">Перейти к поиску</button>
            </div>
        `;
        return;
    }
    
    const card = cardStack[currentCardIndex];
    const isVerified = card.status === 'verified';
    
    container.innerHTML = `
        <div id="swipe-card" class="card" style="position: absolute; top: 0; left: 0; right: 0; margin: 0 auto; cursor: grab; transform-origin: center; transition: transform 0.1s ease-out; z-index: 10;">
            <div style="text-align: center;">
                <div style="font-size: 72px; margin-bottom: 16px;">${card.photo}</div>
                <h2>${card.name}, ${card.age} лет</h2>
                <div style="margin: 8px 0;">
                    ${isVerified ? '<span class="status-badge status-verified">✅ Подтверждён</span>' : '<span class="status-badge status-unverified">⚡ Не подтверждён</span>'}
                </div>
                <p style="margin: 12px 0;"><strong>📍 ${card.city}</strong></p>
                <p style="color: var(--sber-gray); margin: 12px 0;">${card.bio}</p>
                <div style="margin: 16px 0;">
                    <strong>🏆 Достижения:</strong><br>
                    ${card.achievements}
                </div>
                <div style="margin: 12px 0;">
                    <strong>🔧 Навыки:</strong><br>
                    ${card.skills.map(s => `<span style="background: #E6F4EC; padding: 4px 12px; border-radius: 20px; margin: 4px; display: inline-block;">${s}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Добавляем обработчики для свайпа/перетаскивания
    setupDragEvents();
}

function setupDragEvents() {
    const card = document.getElementById('swipe-card');
    if (!card) return;
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTime = 0;
    
    const onStart = (e) => {
        if (isAnimating) return;
        e.preventDefault();
        const clientX = e.clientX ?? e.touches?.[0]?.clientX;
        if (!clientX) return;
        startX = clientX;
        currentX = 0;
        isDragging = true;
        startTime = Date.now();
        card.style.transition = 'none';
        card.style.cursor = 'grabbing';
    };
    
    const onMove = (e) => {
        if (!isDragging || isAnimating) return;
        const clientX = e.clientX ?? e.touches?.[0]?.clientX;
        if (!clientX) return;
        const diff = clientX - startX;
        currentX = diff;
        const rotation = diff * 0.02;
        card.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
        card.style.opacity = Math.min(1, 1 - Math.abs(diff) / 400);
    };
    
    const onEnd = (e) => {
        if (!isDragging || isAnimating) return;
        isDragging = false;
        card.style.cursor = 'grab';
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        const velocity = Math.abs(currentX) / Math.max(1, duration);
        const isSwipe = Math.abs(currentX) > 120 || (Math.abs(currentX) > 50 && velocity > 0.5);
        
        if (isSwipe && currentX > 0) {
            // Свайп вправо - лайк
            animateCardOut(200, 'right', () => {
                likeCurrentCard();
            });
        } else if (isSwipe && currentX < 0) {
            // Свайп влево - скип
            animateCardOut(-200, 'left', () => {
                skipCurrentCard();
            });
        } else {
            // Возвращаем карточку на место
            card.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            card.style.transform = 'translateX(0px) rotate(0deg)';
            card.style.opacity = '1';
            setTimeout(() => {
                card.style.transition = '';
            }, 300);
        }
        currentX = 0;
    };
    
    card.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    card.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
}

function animateCardOut(xOffset, direction, callback) {
    const card = document.getElementById('swipe-card');
    if (!card) return;
    isAnimating = true;
    card.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    card.style.transform = `translateX(${xOffset * 1.5}px) rotate(${direction === 'right' ? 20 : -20}deg)`;
    card.style.opacity = '0';
    setTimeout(() => {
        callback();
        isAnimating = false;
    }, 300);
}

function likeCurrentCard() {
    if (currentCardIndex >= cardStack.length) return;
    const likedCard = cardStack[currentCardIndex];
    if (likedCard && !likedIds.includes(likedCard.id)) {
        likedIds.push(likedCard.id);
        localStorage.setItem('swipeLiked', JSON.stringify(likedIds));
        const msgDiv = document.getElementById('liked-message');
        if (msgDiv) {
            msgDiv.innerHTML = `❤️ Ты лайкнул(а) ${likedCard.name}! Если взаимно — мы предложим объединиться.`;
            setTimeout(() => {
                if (msgDiv) msgDiv.innerHTML = '';
            }, 2000);
        }
    }
    currentCardIndex++;
    renderCurrentCard();
}

function skipCurrentCard() {
    if (currentCardIndex >= cardStack.length) return;
    currentCardIndex++;
    renderCurrentCard();
}

function swipeLeft() {
    if (isAnimating) return;
    animateCardOut(-200, 'left', () => {
        skipCurrentCard();
    });
}

function swipeRight() {
    if (isAnimating) return;
    animateCardOut(200, 'right', () => {
        likeCurrentCard();
    });
}