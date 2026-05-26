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

// Инициализация
renderPage('home');
