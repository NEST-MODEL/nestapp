// Конфиг Firebase (вставь свои данные)
const firebaseConfig = {
  apiKey: "AIzaSyAulfZqMeErLD2oPhoc7-gInpYBZV-ekjQ",
  authDomain: "nest-app-dfae0.firebaseapp.com",
  projectId: "nest-app-dfae0",
  storageBucket: "nest-app-dfae0.firebasestorage.app",
  messagingSenderId: "838781529904",
  appId: "1:838781529904:web:6676c98550174484d962f5",
  measurementId: "G-XSLD5FDZGJ"
};



// Функция отрисовки страниц
function renderPage(page) {
    const app = document.getElementById('app');
    if (page === 'home') {
        app.innerHTML = `
            <h1 class="text-3xl font-bold mb-8">Лента</h1>
            <div id="posts" class="space-y-4 max-w-xl">
                <div class="bg-card p-5 rounded-xl border border-white/5">
                    <p>Это статичный пост. Здесь будет Firebase!</p>
                </div>
            </div>
        `;
    }
}

// Переключение меню настроек
function toggleSettings() {
    const menu = document.getElementById('settingsMenu');
    menu.classList.toggle('hidden');
}

// Рендер контента (упрощенная SPA логика)
function renderPage(page) {
    const app = document.getElementById('app');
    document.getElementById('settingsMenu').classList.add('hidden'); // Закрыть меню настроек

    if (page === 'feed') {
        app.innerHTML = `<h1 class="text-3xl font-bold">Лента постов</h1><div id="feed-content"></div>`;
    } else if (page === 'chats') {
        app.innerHTML = `<h1 class="text-3xl font-bold">Ваши чаты</h1><div class="mt-6">Список чатов...</div>`;
    } else if (page === 'custom') {
        app.innerHTML = `
            <h1 class="text-3xl font-bold">Кастомизация</h1>
            <div class="mt-8 bg-[#1A1A1A] p-6 rounded-2xl max-w-md">
                <label class="block mb-4">Цвет акцента: 
                    <input type="color" value="#FF8C42" onchange="updateTheme(this.value)" class="ml-4 cursor-pointer">
                </label>
            </div>
        `;
    }
}

// Функция кастомизации цвета (меняет CSS переменную)
function updateTheme(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    // Нужно будет добавить в CSS: .bg-accent { background-color: var(--accent-color); }
}

// Инициализация
renderPage('home');
