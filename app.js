// Импорты Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = { /* ТВОИ ДАННЫЕ */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Применение темы из localStorage
window.onload = () => {
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) document.documentElement.style.setProperty('--accent-color', savedColor);
};

function toggleSettings() {
    document.getElementById('settingsMenu').classList.toggle('hidden');
}

function renderPage(page) {
    const app = document.getElementById('app');
    document.getElementById('settingsMenu').classList.add('hidden');

    const pages = {
        feed: `<h1 class="text-3xl font-bold">Лента постов</h1>`,
        chats: `<h1 class="text-3xl font-bold">Чаты</h1>`,
        profile: `<h1 class="text-3xl font-bold">Профиль пользователя</h1>`,
        custom: `
            <h1 class="text-3xl font-bold">Кастомизация</h1>
            <div class="mt-8 bg-card p-6 rounded-2xl max-w-sm">
                <p class="mb-4">Выберите акцентный цвет:</p>
                <input type="color" onchange="changeColor(this.value)" class="w-full h-12 cursor-pointer bg-transparent">
            </div>
        `
    };
    app.innerHTML = pages[page] || "<h1>404</h1>";
}

function changeColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
}

function logout() { alert("Выход..."); }

// Делаем функции глобальными для кнопок в HTML
window.renderPage = renderPage;
window.toggleSettings = toggleSettings;
window.changeColor = changeColor;
window.logout = logout;
