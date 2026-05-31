// Данные для платформы

// Стажировки Сбера
const sberJobs = [
    { title: "Стажировка для победителей ВсОШ по информатике", direction: "AI / ML", deadline: "Лето 2026", status: "open" },
    { title: "Школьная стажировка в SberDevices", direction: "Разработка", deadline: "2026–2027", status: "soon" },
    { title: "Грант на обучение в МФТИ (призёры 9–10 кл)", direction: "Обучение", deadline: "2026", status: "open" },
    { title: "Летняя школа по анализу данных", direction: "Data Science", deadline: "Июль 2026", status: "open" }
];

// Стажировки партнёров
const partnerJobs = [
    { title: "Junior Data Analyst", company: "X5 Group", deadline: "Июнь 2026", status: "open" },
    { title: "IT-стажировка", company: "Альфа-Банк", deadline: "Сентябрь 2026", status: "open" },
    { title: "Разработка на Python", company: "ПСБ", deadline: "Август 2026", status: "soon" },
    { title: "AI-проекты на транспорте", company: "РЖД", deadline: "Осень 2026", status: "open" }
];

// Хакатоны и акселераторы (с реальными ссылками)
const events = [
    { 
        name: "Акселератор Сбера", 
        description: "Программа для школьных проектов и стартапов", 
        link: "https://schoolaccel.sberclass.ru",
        icon: "🚀",
        color: "#00A35E"
    },
    { 
        name: "СберОбразование", 
        description: "Курсы, лекции и мастер-классы от экспертов Сбера", 
        link: "https://sbereducation.ru",
        icon: "📚",
        color: "#0052CC"
    },
    { 
        name: "AI Academy Сбера", 
        description: "Обучение искусственному интеллекту и Data Science", 
        link: "https://ai-academy.ru",
        icon: "🧠",
        color: "#7B3FE4"
    },
    { 
        name: "Сбер Студент", 
        description: "Образовательные программы и партнёрства", 
        link: "https://sberstudent.ru/educational-programs/",
        icon: "🎓",
        color: "#FF6B00"
    }
];

// База кандидатов для поиска команды
let candidates = [
    { id: 1, name: "Анна Смирнова", status: "verified", achievements: "Высшая проба по информатике", skills: ["Python", "ML"], city: "Москва" },
    { id: 2, name: "Максим Орлов", status: "verified", achievements: "ВсОШ по математике", skills: ["Python", "Аналитика"], city: "Москва" },
    { id: 3, name: "Екатерина Козлова", status: "unverified", achievements: "Призёр хакатона Сбера", skills: ["Дизайн", "Frontend"], city: "СПб" },
    { id: 4, name: "Дмитрий Волков", status: "verified", achievements: "Высшая проба по экономике", skills: ["Аналитика", "Data Science"], city: "Москва" },
    { id: 5, name: "Полина Морозова", status: "verified", achievements: "Призёр ВсОШ по информатике", skills: ["Python", "Backend"], city: "Казань" }
];

const availableSkills = ["Python", "ML", "Аналитика", "Data Science", "Frontend", "Backend", "Дизайн"];

const externalLinks = {
    products: "https://ed-industry.ru/jobs",
    accelerator: "https://sberz.sberbank.ru/"
};
// ========== ДОБАВИТЬ ДЛЯ СТРАНИЦЫ КАРТОЧЕК (СВАЙПЫ) ==========

// Массив кандидатов для Tinder-стиля
const swipeCandidates = [
    { 
        id: 1, 
        name: "Анна Смирнова", 
        age: 16,
        status: "verified", 
        achievements: "Высшая проба по информатике, призёр ВсОШ", 
        skills: ["Python", "ML", "Data Science"], 
        city: "Москва",
        bio: "Ищу команду для проекта по компьютерному зрению. Пишу на Python, разбираюсь в нейросетях.",
        photo: "👩‍💻"
    },
    { 
        id: 2, 
        name: "Максим Орлов", 
        age: 17,
        status: "verified", 
        achievements: "ВсОШ по математике, победитель хакатона Сбера", 
        skills: ["Python", "Аналитика", "Backend"], 
        city: "Москва",
        bio: "Люблю решать сложные задачи. Хочу собрать команду для участия в акселераторе.",
        photo: "🧮"
    },
    { 
        id: 3, 
        name: "Екатерина Козлова", 
        age: 15,
        status: "unverified", 
        achievements: "Призёр хакатона Сбера, курс по ML", 
        skills: ["Дизайн", "Frontend", "UI/UX"], 
        city: "Санкт-Петербург",
        bio: "Делаю красивые интерфейсы. Ищу бэкендера для совместного проекта.",
        photo: "🎨"
    },
    { 
        id: 4, 
        name: "Дмитрий Волков", 
        age: 17,
        status: "verified", 
        achievements: "Высшая проба по экономике, финалист ВсОШ", 
        skills: ["Аналитика", "Data Science", "SQL"], 
        city: "Москва",
        bio: "Анализирую данные, строю модели. Ищу команду для кейс-чемпионата.",
        photo: "📊"
    },
    { 
        id: 5, 
        name: "Полина Морозова", 
        age: 16,
        status: "verified", 
        achievements: "Призёр ВсОШ по информатике, топ-10 ML-хакатона", 
        skills: ["Python", "Backend", "Django"], 
        city: "Казань",
        bio: "Бэкенд-разработчик. Собираю команду для стартапа в сфере EdTech.",
        photo: "💻"
    },
    { 
        id: 6, 
        name: "Илья Соколов", 
        age: 16,
        status: "unverified", 
        achievements: "Участник олимпиады по программированию, курс по AI", 
        skills: ["ML", "Python", "Data Science"], 
        city: "Новосибирск",
        bio: "Интересуюсь машинным обучением. Ищу наставника и команду.",
        photo: "🤖"
    }
];

// Сохранённые лайки (из LocalStorage)
let likedIds = JSON.parse(localStorage.getItem('swipeLiked') || '[]');