/**
 * NEST — Mock Firebase
 * Полноценная замена Firebase через localStorage + in-memory
 * Заменить на реальный Firebase SDK при деплое:
 *   import { initializeApp } from 'firebase/app'
 *   import { getAuth, ... } from 'firebase/auth'
 *   import { getDatabase, ... } from 'firebase/database'
 */

// ──────────────────────────────────────────
// CONFIG (заменить на реальный)
// ──────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAulfZqMeErLD2oPhoc7-gInpYBZV-ekjQ",
  authDomain: "nest-app-dfae0.firebaseapp.com",
  projectId: "nest-app-dfae0",
  storageBucket: "nest-app-dfae0.firebasestorage.app",
  messagingSenderId: "838781529904",
  appId: "1:838781529904:web:6676c98550174484d962f5",
  measurementId: "G-XSLD5FDZGJ"
};


// ──────────────────────────────────────────
// SEED DATA
// ──────────────────────────────────────────
const SEED_USERS = [
  { id: 'u1', username: 'xNova', displayName: 'xNova', email: 'nova@example.com', password: 'demo123', avatar: null, banner: null, bio: 'Pro gamer. Ranked Grandmaster. Coach.', status: 'online', activity: 'Playing Valorant', badges: ['pro', 'mod'], servers: ['s1', 's2'], friends: ['u2', 'u3'], joinedAt: Date.now() - 86400000 * 30 },
  { id: 'u2', username: 'StellaR', displayName: 'StellaR', email: 'stella@example.com', password: 'demo123', avatar: null, banner: null, bio: 'Twitch streamer | Minecraft & CS2', status: 'idle', activity: 'Streaming on Twitch', badges: ['pro'], servers: ['s1'], friends: ['u1', 'u3'], joinedAt: Date.now() - 86400000 * 20 },
  { id: 'u3', username: 'Drift', displayName: 'Drift', email: 'drift@example.com', password: 'demo123', avatar: null, banner: null, bio: 'Just vibing', status: 'online', activity: null, badges: [], servers: ['s1', 's2', 's3'], friends: ['u1', 'u2'], joinedAt: Date.now() - 86400000 * 10 },
  { id: 'u4', username: 'MidnightX', displayName: 'MidnightX', email: 'mid@example.com', password: 'demo123', avatar: null, banner: null, bio: 'Night owl 🌙', status: 'dnd', activity: 'Do Not Disturb', badges: [], servers: ['s2'], friends: [], joinedAt: Date.now() - 86400000 * 5 },
  { id: 'u5', username: 'Cipher', displayName: 'Cipher', email: 'cipher@example.com', password: 'demo123', avatar: null, banner: null, bio: 'Security researcher | CTF player', status: 'offline', activity: null, badges: [], servers: ['s3'], friends: [], joinedAt: Date.now() - 86400000 * 2 },
];

const SEED_SERVERS = [
  {
    id: 's1',
    name: 'Valorant PL',
    icon: 'VP',
    iconColor: '#FF4655',
    description: 'Польская сцена Valorant. Турниры, тиммейты, гайды.',
    banner: null,
    ownerId: 'u1',
    members: ['u1', 'u2', 'u3'],
    memberCount: 1247,
    categories: [
      {
        id: 'cat1', name: 'Общее', channels: [
          { id: 'ch1', type: 'text', name: 'общий', unread: 3 },
          { id: 'ch2', type: 'text', name: 'объявления', unread: 0 },
          { id: 'ch3', type: 'text', name: 'оффтоп', unread: 1 },
        ]
      },
      {
        id: 'cat2', name: 'Игра', channels: [
          { id: 'ch4', type: 'text', name: 'лфг', unread: 5 },
          { id: 'ch5', type: 'text', name: 'стратегии', unread: 0 },
          { id: 'ch6', type: 'voice', name: 'Lobby 1' },
          { id: 'ch7', type: 'voice', name: 'Lobby 2' },
        ]
      },
    ],
    roles: [
      { id: 'r1', name: 'Admin', color: '#FF8C42', permissions: ['all'] },
      { id: 'r2', name: 'Moderator', color: '#3B82F6', permissions: ['kick', 'mute', 'delete'] },
      { id: 'r3', name: 'Member', color: '#A0A0A0', permissions: [] },
    ],
  },
  {
    id: 's2',
    name: 'CS2 Hub',
    icon: 'CS',
    iconColor: '#F4B942',
    description: 'Counter-Strike 2 комьюнити.',
    banner: null,
    ownerId: 'u1',
    members: ['u1', 'u3', 'u4'],
    memberCount: 892,
    categories: [
      {
        id: 'cat3', name: 'Main', channels: [
          { id: 'ch8', type: 'text', name: 'general', unread: 0 },
          { id: 'ch9', type: 'text', name: 'trading', unread: 2 },
          { id: 'ch10', type: 'voice', name: 'Main Lobby' },
        ]
      },
    ],
    roles: [
      { id: 'r4', name: 'Admin', color: '#FF8C42', permissions: ['all'] },
      { id: 'r5', name: 'Member', color: '#A0A0A0', permissions: [] },
    ],
  },
  {
    id: 's3',
    name: 'Dev Corner',
    icon: 'DC',
    iconColor: '#8B5CF6',
    description: 'Разработчики игр, инди, геймдев.',
    banner: null,
    ownerId: 'u5',
    members: ['u3', 'u5'],
    memberCount: 341,
    categories: [
      {
        id: 'cat4', name: 'General', channels: [
          { id: 'ch11', type: 'text', name: 'general', unread: 0 },
          { id: 'ch12', type: 'text', name: 'showcase', unread: 0 },
        ]
      },
    ],
    roles: [
      { id: 'r6', name: 'Dev', color: '#8B5CF6', permissions: ['all'] },
      { id: 'r7', name: 'Member', color: '#A0A0A0', permissions: [] },
    ],
  },
];

const now = Date.now();
const SEED_POSTS = [
  {
    id: 'p1',
    serverId: 's1',
    authorId: 'u1',
    content: 'Наконец-то добрался до Immortal 3 🎯 Кто хочет в тиму — пишите в лс, ищем 5й для рейтинга',
    image: null,
    reactions: { '🔥': ['u2', 'u3'], '💪': ['u2'], '🎯': ['u3', 'u4'] },
    comments: ['c1', 'c2'],
    createdAt: now - 7200000,
    pinned: false,
  },
  {
    id: 'p2',
    serverId: 's1',
    authorId: 'u2',
    content: 'Стримлю Valorant прямо сейчас! Первый раз пробую ranked после патча. Заходите, будет весело 🟣',
    image: null,
    reactions: { '❤️': ['u1', 'u3', 'u4'], '👀': ['u1'] },
    comments: [],
    createdAt: now - 3600000,
    pinned: false,
    poll: {
      question: 'Что смотреть дальше?',
      options: [
        { text: 'Ranked грайнд', votes: ['u1', 'u3'] },
        { text: 'Custom games', votes: ['u4'] },
        { text: 'Aim training', votes: [] },
      ]
    }
  },
  {
    id: 'p3',
    serverId: 's2',
    authorId: 'u3',
    content: 'Нашёл интересный мув в Dust2 — можно закинуть дым на B site с одного угла. Кто хочет учиться — сегодня вечером тренировочный сервер, 20:00 МСК.',
    image: null,
    reactions: { '🙏': ['u1', 'u2', 'u4'], '🎮': ['u1'] },
    comments: ['c3'],
    createdAt: now - 10800000,
    pinned: false,
  },
];

const SEED_COMMENTS = [
  { id: 'c1', postId: 'p1', authorId: 'u2', content: 'Поздравляю! Я сам застрял на Diamond уже 2 недели 😅', createdAt: now - 7000000, likes: ['u1'] },
  { id: 'c2', postId: 'p1', authorId: 'u3', content: 'Крутой результат! Пишу в лс', createdAt: now - 6500000, likes: [] },
  { id: 'c3', postId: 'p3', authorId: 'u1', content: 'Жду! Обязательно приду', createdAt: now - 10000000, likes: ['u3'] },
];

const SEED_MESSAGES = {
  'ch1': [
    { id: 'm1', channelId: 'ch1', authorId: 'u1', content: 'Всем привет! Новый патч уже вышел?', createdAt: now - 3600000 },
    { id: 'm2', channelId: 'ch1', authorId: 'u2', content: 'Да, только что выкатили. Нерфили Jett и Omen', createdAt: now - 3500000 },
    { id: 'm3', channelId: 'ch1', authorId: 'u3', content: '@xNova Ожидаемо, Jett была имбой с прошлого патча', createdAt: now - 3400000 },
    { id: 'm4', channelId: 'ch1', authorId: 'u1', content: 'Ладно, буду разбираться. Кто-нибудь играет сейчас?', createdAt: now - 3000000 },
    { id: 'm5', channelId: 'ch1', authorId: 'u2', content: 'Я буду примерно через час', createdAt: now - 2900000 },
    { id: 'm6', channelId: 'ch1', authorId: 'u3', content: 'Захожу!', createdAt: now - 2800000 },
    { id: 'm7', channelId: 'ch1', authorId: 'u1', content: 'Огонь, создаю лобби', createdAt: now - 2700000 },
  ],
  'ch4': [
    { id: 'm8', channelId: 'ch4', authorId: 'u3', content: 'Ищу тиму на ранкед, Plat 1, рейтинг 180+, микрофон есть', createdAt: now - 1800000 },
    { id: 'm9', channelId: 'ch4', authorId: 'u4', content: 'Я Diamond 2, пишите если нужен IGL', createdAt: now - 1700000 },
  ],
  'ch8': [
    { id: 'm10', channelId: 'ch8', authorId: 'u4', content: 'Кто-нибудь видел новый case? Там есть годные скины', createdAt: now - 900000 },
    { id: 'm11', channelId: 'ch8', authorId: 'u3', content: 'Да, AWP выглядит огонь, но цены пока конские', createdAt: now - 800000 },
  ],
};

const SEED_VOICE_ROOMS = [
  {
    id: 'vr1', channelId: 'ch6', serverId: 's1', name: 'Lobby 1',
    participants: [
      { userId: 'u1', muted: false, deafened: false, speaking: true },
      { userId: 'u3', muted: true, deafened: false, speaking: false },
    ]
  },
  {
    id: 'vr2', channelId: 'ch7', serverId: 's1', name: 'Lobby 2',
    participants: []
  },
  {
    id: 'vr3', channelId: 'ch10', serverId: 's2', name: 'Main Lobby',
    participants: [
      { userId: 'u4', muted: false, deafened: false, speaking: false },
    ]
  },
];

// ──────────────────────────────────────────
// STORAGE HELPERS
// ──────────────────────────────────────────
const LS = {
  get(key) {
    try { return JSON.parse(localStorage.getItem('nest_' + key)); } catch { return null; }
  },
  set(key, val) {
    try { localStorage.setItem('nest_' + key, JSON.stringify(val)); } catch {}
  },
  del(key) { localStorage.removeItem('nest_' + key); },
};

// ──────────────────────────────────────────
// INIT SEED
// ──────────────────────────────────────────
function initSeed() {
  if (!LS.get('seeded')) {
    LS.set('users', SEED_USERS);
    LS.set('servers', SEED_SERVERS);
    LS.set('posts', SEED_POSTS);
    LS.set('comments', SEED_COMMENTS);
    LS.set('messages', SEED_MESSAGES);
    LS.set('voice_rooms', SEED_VOICE_ROOMS);
    LS.set('notifications', []);
    LS.set('seeded', true);
  }
}

// ──────────────────────────────────────────
// MOCK AUTH
// ──────────────────────────────────────────
const MockAuth = {
  currentUser: null,
  _listeners: [],

  onAuthStateChanged(cb) {
    this._listeners.push(cb);
    const saved = LS.get('current_user');
    if (saved) {
      this.currentUser = saved;
      cb(saved);
    } else {
      cb(null);
    }
    return () => { this._listeners = this._listeners.filter(l => l !== cb); };
  },

  async signIn(email, password) {
    const users = LS.get('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Неверный email или пароль');
    const { password: _, ...safeUser } = user;
    this.currentUser = safeUser;
    LS.set('current_user', safeUser);
    this._notify(safeUser);
    return safeUser;
  },

  async signUp(email, password, username) {
    const users = LS.get('users') || [];
    if (users.find(u => u.email === email)) throw new Error('Email уже используется');
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) throw new Error('Имя пользователя занято');
    const newUser = {
      id: 'u' + Date.now(),
      username, displayName: username, email, password,
      avatar: null, banner: null, bio: '',
      status: 'online', activity: null,
      badges: [], servers: ['s1'], friends: [],
      joinedAt: Date.now(),
    };
    users.push(newUser);
    LS.set('users', users);
    const { password: _, ...safeUser } = newUser;
    this.currentUser = safeUser;
    LS.set('current_user', safeUser);
    this._notify(safeUser);
    return safeUser;
  },

  async signInWithGoogle() {
    // Mock Google auth — создаёт случайного пользователя
    const names = ['GGamer', 'ProPlayer', 'CoolDude', 'Ninja', 'Shadow'];
    const name = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 999);
    return this.signUp(`${name.toLowerCase()}@gmail.com`, 'google_' + Date.now(), name);
  },

  async signInWithDiscord() {
    const name = 'DiscordUser' + Math.floor(Math.random() * 9999);
    return this.signUp(`${name.toLowerCase()}@discord.mock`, 'discord_' + Date.now(), name);
  },

  signOut() {
    this.currentUser = null;
    LS.del('current_user');
    this._notify(null);
  },

  _notify(user) {
    this._listeners.forEach(cb => cb(user));
  }
};

// ──────────────────────────────────────────
// MOCK DATABASE
// ──────────────────────────────────────────
const MockDB = {
  // ── USERS ──
  getUser(id) {
    const users = LS.get('users') || [];
    const u = users.find(u => u.id === id);
    if (!u) return null;
    const { password: _, ...safe } = u;
    return safe;
  },

  getAllUsers() {
    return (LS.get('users') || []).map(({ password: _, ...u }) => u);
  },

  updateUser(id, data) {
    const users = LS.get('users') || [];
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return;
    users[idx] = { ...users[idx], ...data };
    LS.set('users', users);
    // Update current user if it's us
    const curr = LS.get('current_user');
    if (curr && curr.id === id) {
      const { password: _, ...safe } = users[idx];
      LS.set('current_user', safe);
      MockAuth.currentUser = safe;
    }
  },

  // ── SERVERS ──
  getServers() { return LS.get('servers') || []; },

  getServer(id) {
    return (LS.get('servers') || []).find(s => s.id === id) || null;
  },

  createServer(data) {
    const servers = LS.get('servers') || [];
    const newServer = {
      id: 's' + Date.now(),
      name: data.name,
      icon: data.name.slice(0, 2).toUpperCase(),
      iconColor: data.color || '#FF8C42',
      description: data.description || '',
      banner: null,
      ownerId: data.ownerId,
      members: [data.ownerId],
      memberCount: 1,
      categories: [
        {
          id: 'cat_' + Date.now(),
          name: 'Общее',
          channels: [
            { id: 'ch_' + Date.now(), type: 'text', name: 'общий', unread: 0 },
            { id: 'ch_' + (Date.now() + 1), type: 'voice', name: 'Голосовой' },
          ]
        }
      ],
      roles: [
        { id: 'r_' + Date.now(), name: 'Admin', color: '#FF8C42', permissions: ['all'] },
        { id: 'r_' + (Date.now() + 1), name: 'Member', color: '#A0A0A0', permissions: [] },
      ],
      createdAt: Date.now(),
    };
    servers.push(newServer);
    LS.set('servers', servers);

    // Add server to user's list
    const users = LS.get('users') || [];
    const uidx = users.findIndex(u => u.id === data.ownerId);
    if (uidx !== -1) {
      users[uidx].servers = [...(users[uidx].servers || []), newServer.id];
      LS.set('users', users);
    }

    return newServer;
  },

  joinServer(serverId, userId) {
    const servers = LS.get('servers') || [];
    const idx = servers.findIndex(s => s.id === serverId);
    if (idx === -1) return;
    if (!servers[idx].members.includes(userId)) {
      servers[idx].members.push(userId);
      servers[idx].memberCount++;
    }
    LS.set('servers', servers);

    const users = LS.get('users') || [];
    const uidx = users.findIndex(u => u.id === userId);
    if (uidx !== -1 && !users[uidx].servers.includes(serverId)) {
      users[uidx].servers.push(serverId);
      LS.set('users', users);
    }
  },

  // ── POSTS ──
  getPosts(serverId) {
    const posts = LS.get('posts') || [];
    return posts.filter(p => p.serverId === serverId).sort((a, b) => b.createdAt - a.createdAt);
  },

  createPost(data) {
    const posts = LS.get('posts') || [];
    const newPost = {
      id: 'p' + Date.now(),
      serverId: data.serverId,
      authorId: data.authorId,
      content: data.content,
      image: data.image || null,
      reactions: {},
      comments: [],
      createdAt: Date.now(),
      pinned: false,
      poll: data.poll || null,
    };
    posts.unshift(newPost);
    LS.set('posts', posts);
    return newPost;
  },

  toggleReaction(postId, emoji, userId) {
    const posts = LS.get('posts') || [];
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) return;
    if (!posts[idx].reactions[emoji]) posts[idx].reactions[emoji] = [];
    const arr = posts[idx].reactions[emoji];
    const uidx = arr.indexOf(userId);
    if (uidx === -1) arr.push(userId);
    else arr.splice(uidx, 1);
    if (arr.length === 0) delete posts[idx].reactions[emoji];
    LS.set('posts', posts);
    return posts[idx];
  },

  votePoll(postId, optionIdx, userId) {
    const posts = LS.get('posts') || [];
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1 || !posts[idx].poll) return;
    // Remove from all options first
    posts[idx].poll.options.forEach(opt => {
      opt.votes = opt.votes.filter(v => v !== userId);
    });
    // Add vote
    posts[idx].poll.options[optionIdx].votes.push(userId);
    LS.set('posts', posts);
    return posts[idx];
  },

  // ── COMMENTS ──
  getComments(postId) {
    return (LS.get('comments') || []).filter(c => c.postId === postId).sort((a, b) => a.createdAt - b.createdAt);
  },

  addComment(postId, authorId, content) {
    const comments = LS.get('comments') || [];
    const newComment = { id: 'c' + Date.now(), postId, authorId, content, createdAt: Date.now(), likes: [] };
    comments.push(newComment);
    LS.set('comments', comments);

    const posts = LS.get('posts') || [];
    const idx = posts.findIndex(p => p.id === postId);
    if (idx !== -1) { posts[idx].comments.push(newComment.id); LS.set('posts', posts); }

    return newComment;
  },

  // ── MESSAGES ──
  getMessages(channelId) {
    const all = LS.get('messages') || {};
    return (all[channelId] || []).slice(-100);
  },

  sendMessage(channelId, authorId, content) {
    const all = LS.get('messages') || {};
    if (!all[channelId]) all[channelId] = [];
    const msg = { id: 'm' + Date.now(), channelId, authorId, content, createdAt: Date.now() };
    all[channelId].push(msg);
    LS.set('messages', all);

    // Simulate realtime
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('nest:message', { detail: { channelId, message: msg } }));
    }, 0);

    return msg;
  },

  // ── VOICE ROOMS ──
  getVoiceRooms() { return LS.get('voice_rooms') || []; },

  joinVoiceRoom(roomId, userId) {
    const rooms = LS.get('voice_rooms') || [];
    const idx = rooms.findIndex(r => r.id === roomId);
    if (idx === -1) return;
    // Remove from all rooms first
    rooms.forEach(r => { r.participants = r.participants.filter(p => p.userId !== userId); });
    rooms[idx].participants.push({ userId, muted: false, deafened: false, speaking: false });
    LS.set('voice_rooms', rooms);
    window.dispatchEvent(new CustomEvent('nest:voice', { detail: rooms }));
    return rooms[idx];
  },

  leaveVoiceRoom(userId) {
    const rooms = LS.get('voice_rooms') || [];
    rooms.forEach(r => { r.participants = r.participants.filter(p => p.userId !== userId); });
    LS.set('voice_rooms', rooms);
    window.dispatchEvent(new CustomEvent('nest:voice', { detail: rooms }));
  },

  toggleMute(roomId, userId) {
    const rooms = LS.get('voice_rooms') || [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    const p = room.participants.find(p => p.userId === userId);
    if (p) p.muted = !p.muted;
    LS.set('voice_rooms', rooms);
    window.dispatchEvent(new CustomEvent('nest:voice', { detail: rooms }));
  },

  // ── NOTIFICATIONS ──
  getNotifications(userId) {
    return (LS.get('notifications') || []).filter(n => n.targetId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  addNotification(targetId, type, data) {
    const notifs = LS.get('notifications') || [];
    notifs.unshift({ id: 'n' + Date.now(), targetId, type, data, read: false, createdAt: Date.now() });
    LS.set('notifications', notifs);
    window.dispatchEvent(new CustomEvent('nest:notification', { detail: { targetId } }));
  },

  markNotificationsRead(userId) {
    const notifs = LS.get('notifications') || [];
    notifs.filter(n => n.targetId === userId).forEach(n => n.read = true);
    LS.set('notifications', notifs);
  },

  // ── FRIENDS ──
  addFriend(userId, friendId) {
    const users = LS.get('users') || [];
    [userId, friendId].forEach((id, i) => {
      const other = i === 0 ? friendId : userId;
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1 && !users[idx].friends.includes(other)) {
        users[idx].friends.push(other);
      }
    });
    LS.set('users', users);
  },
};

// ──────────────────────────────────────────
// SIMULATE SPEAKING ANIMATION
// ──────────────────────────────────────────
let _speakTimer = null;
function startSpeakingSimulation() {
  if (_speakTimer) return;
  _speakTimer = setInterval(() => {
    const rooms = LS.get('voice_rooms') || [];
    rooms.forEach(room => {
      room.participants.forEach(p => {
        if (!p.muted) p.speaking = Math.random() > 0.5;
        else p.speaking = false;
      });
    });
    LS.set('voice_rooms', rooms);
    window.dispatchEvent(new CustomEvent('nest:voice', { detail: rooms }));
  }, 2000);
}

// ──────────────────────────────────────────
// BOOT
// ──────────────────────────────────────────
initSeed();
window.MockAuth = MockAuth;
window.MockDB = MockDB;
window.MockLS = LS;
startSpeakingSimulation();

console.log('%c🪺 NEST Mock Firebase loaded', 'color: #FF8C42; font-weight: bold;');
console.log('Demo: nova@example.com / demo123');
