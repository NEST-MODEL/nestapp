import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "ТВОЙ_API_KEY",
    authDomain: "nest-app-dfae0.firebaseapp.com",
    projectId: "nest-app-dfae0",
    storageBucket: "nest-app-dfae0.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- ГЛОБАЛЬНЫЕ ФУНКЦИИ (чтобы HTML их видел) ---

window.renderPage = function(page) {
    const appContainer = document.getElementById('app');
    document.getElementById('settingsMenu').classList.add('hidden');

    const content = {
        feed: `<h1 class="text-3xl font-bold">Лента постов</h1><p class="text-gray-400 mt-4">Здесь будут посты из Firebase.</p>`,
        chats: `<h1 class="text-3xl font-bold">Ваши чаты</h1>`,
        profile: `<h1 class="text-3xl font-bold">Ваш профиль</h1>`,
        custom: `
            <h1 class="text-3xl font-bold">Кастомизация</h1>
            <div class="mt-8 bg-[#1A1A1A] p-6 rounded-2xl max-w-sm border border-white/5">
                <p class="mb-4 text-gray-300">Выберите акцентный цвет:</p>
                <input type="color" value="#FF8C42" onchange="window.changeColor(this.value)" class="w-full h-12 cursor-pointer bg-transparent rounded-lg">
            </div>
        `
    };

    appContainer.innerHTML = content[page] || "<h1>404</h1>";
};

window.toggleSettings = function() {
    document.getElementById('settingsMenu').classList.toggle('hidden');
};

window.changeColor = function(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
};

window.logout = function() {
    alert("Выход из аккаунта...");
};

// Применение цвета при загрузке
window.addEventListener('DOMContentLoaded', () => {
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) document.documentElement.style.setProperty('--accent-color', savedColor);
});
