/**
 * NEST — Modals
 */

const Modals = {
  createServer() {
    const colors = ['#FF8C42', '#4CAF50', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#14B8A6'];
    let selectedColor = colors[0];

    openModal(`
      <div class="modal-header">
        <h2 class="modal-title">Создать сервер</h2>
        <button class="icon-btn" onclick="closeModal()">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Название сервера</label>
        <input type="text" class="form-input" id="srv-name" placeholder="Мой крутой сервер" maxlength="50" />
      </div>
      <div class="form-group">
        <label class="form-label">Описание</label>
        <input type="text" class="form-input" id="srv-desc" placeholder="О чём ваш сервер..." maxlength="200" />
      </div>
      <div class="form-group">
        <label class="form-label">Цвет</label>
        <div class="color-picker" id="srv-colors">
          ${colors.map((c, i) => `<div class="color-swatch ${i === 0 ? 'selected' : ''}" style="background:${c};" onclick="Modals._selectColor(this,'${c}')" data-color="${c}"></div>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:20px;">
        <button class="btn btn-secondary" onclick="closeModal()">Отмена</button>
        <button class="btn btn-primary" style="flex:1;" onclick="Modals._submitCreateServer()">Создать 🚀</button>
      </div>
    `);
  },

  _selectColor(el, color) {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    el._selectedColor = color;
    // Store selected color on element for retrieval
    document.getElementById('srv-colors').dataset.selected = color;
  },

  _submitCreateServer() {
    const name = document.getElementById('srv-name').value.trim();
    const desc = document.getElementById('srv-desc').value.trim();
    const color = document.getElementById('srv-colors')?.dataset.selected || '#FF8C42';

    if (!name) { showToast('Введите название', 'error'); return; }

    const user = Store.get('user');
    const server = MockDB.createServer({ name, description: desc, color, ownerId: user.id });
    closeModal();
    showToast(`Сервер "${name}" создан!`, 'success');
    Sidebar.selectServer(server.id);
  },

  addChannel(serverId, categoryId) {
    openModal(`
      <div class="modal-header">
        <h2 class="modal-title">Добавить канал</h2>
        <button class="icon-btn" onclick="closeModal()">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Тип канала</label>
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <label style="flex:1;cursor:pointer;">
            <input type="radio" name="ch-type" value="text" checked style="display:none;" id="type-text" />
            <div style="padding:12px;border-radius:8px;border:1px solid var(--border);text-align:center;font-size:13px;" onclick="document.getElementById('type-text').checked=true;this.parentElement.parentElement.querySelectorAll('[data-type]').forEach(e=>{e.style.borderColor='var(--border)';e.style.background='transparent'});this.style.borderColor='var(--accent)';this.style.background='var(--accent-dim)';" data-type>
              # Текстовый
            </div>
          </label>
          <label style="flex:1;cursor:pointer;">
            <input type="radio" name="ch-type" value="voice" style="display:none;" id="type-voice" />
            <div style="padding:12px;border-radius:8px;border:1px solid var(--border);text-align:center;font-size:13px;" onclick="document.getElementById('type-voice').checked=true;this.parentElement.parentElement.querySelectorAll('[data-type]').forEach(e=>{e.style.borderColor='var(--border)';e.style.background='transparent'});this.style.borderColor='var(--accent)';this.style.background='var(--accent-dim)';" data-type>
              🔊 Голосовой
            </div>
          </label>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Название</label>
        <input type="text" class="form-input" id="ch-name" placeholder="новый-канал" maxlength="32" />
      </div>
      <div style="display:flex;gap:8px;margin-top:20px;">
        <button class="btn btn-secondary" onclick="closeModal()">Отмена</button>
        <button class="btn btn-primary" style="flex:1;" onclick="Modals._submitAddChannel('${serverId}','${categoryId}')">Создать</button>
      </div>
    `);
  },

  _submitAddChannel(serverId, categoryId) {
    const name = document.getElementById('ch-name').value.trim().replace(/\s+/g, '-').toLowerCase();
    const type = document.querySelector('input[name="ch-type"]:checked')?.value || 'text';
    if (!name) { showToast('Введите название', 'error'); return; }

    const servers = MockDB.getServers();
    const server = servers.find(s => s.id === serverId);
    if (!server) return;

    const cat = server.categories.find(c => c.id === categoryId);
    if (!cat) return;

    const newChannel = { id: 'ch_' + Date.now(), type, name, unread: 0 };
    cat.channels.push(newChannel);
    MockLS.set('servers', servers);

    Store.set('activeServer', server);
    closeModal();
    showToast(`Канал #${name} создан`, 'success');
    Sidebar.renderChannels();
  },

  userProfile(userId) {
    const user = MockDB.getUser(userId);
    const me = Store.get('user');
    if (!user) return;

    const color = Utils.avatarColors(user.id);
    const isFriend = (me.friends || []).includes(userId);
    const isMe = userId === me.id;

    const badgeHtml = (user.badges || []).map(b => `<span class="badge badge-${b}">${b}</span>`).join('');
    const statusColors = { online: 'var(--online)', idle: 'var(--warning)', dnd: 'var(--danger)', offline: 'var(--text-3)' };
    const statusLabels = { online: 'В сети', idle: 'Отошёл', dnd: 'Не беспокоить', offline: 'Не в сети' };

    openModal(`
      <div style="margin:-28px -28px 20px;height:100px;background:linear-gradient(135deg,${color}30,${color}10);border-radius:var(--radius-xl) var(--radius-xl) 0 0;position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent,rgba(26,26,26,0.5));"></div>
      </div>
      <div style="display:flex;align-items:flex-end;gap:12px;margin-top:-50px;margin-bottom:12px;position:relative;">
        <div style="width:70px;height:70px;border-radius:50%;border:4px solid var(--card);background:${color}20;color:${color};display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:22px;flex-shrink:0;">${Utils.getInitials(user.username)}</div>
        <div>
          <div style="font-family:var(--font-display);font-size:18px;font-weight:800;">${Utils.escapeHtml(user.displayName)}</div>
          <div style="font-size:12px;color:var(--text-3);">@${Utils.escapeHtml(user.username)}</div>
        </div>
        <div style="margin-left:auto;display:flex;align-items:center;gap:4px;font-size:11px;color:${statusColors[user.status]};">
          <div style="width:8px;height:8px;border-radius:50%;background:${statusColors[user.status]};"></div>
          ${statusLabels[user.status] || 'В сети'}
        </div>
      </div>
      ${badgeHtml ? `<div class="profile-badges" style="margin-bottom:12px;">${badgeHtml}</div>` : ''}
      ${user.bio ? `<p style="font-size:13px;color:var(--text-2);line-height:1.5;margin-bottom:16px;">${Utils.escapeHtml(user.bio)}</p>` : ''}
      ${user.activity ? `<div style="padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:12px;color:var(--text-3);margin-bottom:16px;">🎮 ${Utils.escapeHtml(user.activity)}</div>` : ''}
      <div style="display:flex;gap:8px;margin-top:4px;">
        ${!isMe ? `
          <button class="btn btn-primary" style="flex:1;" onclick="closeModal();Sidebar.openDM('${userId}')">💬 Сообщение</button>
          ${!isFriend ? `<button class="btn btn-secondary" onclick="Modals._addFriend('${userId}')">+ Друг</button>` : `<button class="btn btn-ghost" disabled>✓ Друг</button>`}
        ` : `<button class="btn btn-secondary" style="flex:1;" onclick="closeModal();Router.navigate('/profile/${userId}')">Мой профиль</button>`}
      </div>
    `);
  },

  _addFriend(userId) {
    const me = Store.get('user');
    MockDB.addFriend(me.id, userId);
    // Update store
    const updated = MockDB.getUser(me.id);
    Store.set('user', updated);
    showToast('Запрос отправлен!', 'success');
    closeModal();
  },

  settings() {
    const user = Store.get('user');
    openModal(`
      <div class="modal-header">
        <h2 class="modal-title">⚙ Настройки</h2>
        <button class="icon-btn" onclick="closeModal()">✕</button>
      </div>
      <div class="tabs" style="margin:-8px -28px 20px;padding:0 28px;">
        <div class="tab-item active" onclick="Modals._settingsTab(this,'profile')">Профиль</div>
        <div class="tab-item" onclick="Modals._settingsTab(this,'account')">Аккаунт</div>
        <div class="tab-item" onclick="Modals._settingsTab(this,'privacy')">Приватность</div>
      </div>
      <div id="settings-content">
        ${this._settingsProfileTab(user)}
      </div>
    `);
  },

  _settingsTab(el, tab) {
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const user = Store.get('user');
    const content = { profile: this._settingsProfileTab(user), account: this._settingsAccountTab(user), privacy: this._settingsPrivacyTab() };
    document.getElementById('settings-content').innerHTML = content[tab] || '';
  },

  _settingsProfileTab(user) {
    const statusOptions = ['online', 'idle', 'dnd', 'offline'];
    const statusLabels = { online: '🟢 В сети', idle: '🟡 Отошёл', dnd: '🔴 Не беспокоить', offline: '⚫ Не в сети' };
    return `
      <div class="form-group">
        <label class="form-label">Отображаемое имя</label>
        <input type="text" class="form-input" id="set-displayname" value="${Utils.escapeHtml(user.displayName)}" maxlength="32" />
      </div>
      <div class="form-group">
        <label class="form-label">О себе</label>
        <textarea class="form-input" id="set-bio" style="resize:vertical;min-height:80px;" maxlength="300">${Utils.escapeHtml(user.bio || '')}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Статус</label>
        <select class="form-input" id="set-status">
          ${statusOptions.map(s => `<option value="${s}" ${user.status === s ? 'selected' : ''}>${statusLabels[s]}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Активность</label>
        <input type="text" class="form-input" id="set-activity" value="${Utils.escapeHtml(user.activity || '')}" placeholder="Что сейчас делаете?" maxlength="100" />
      </div>
      <button class="btn btn-primary btn-full" onclick="Modals._saveProfile()">Сохранить</button>
    `;
  },

  _settingsAccountTab(user) {
    return `
      <div class="form-group">
        <label class="form-label">Email</label>
        <div class="form-input" style="color:var(--text-3);">${Utils.escapeHtml(user.email)}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Username</label>
        <div class="form-input" style="color:var(--text-3);">@${Utils.escapeHtml(user.username)}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Новый пароль</label>
        <input type="password" class="form-input" id="set-newpass" placeholder="Оставьте пустым для сохранения" />
      </div>
      <button class="btn btn-primary btn-full" onclick="showToast('Сохранено','success');closeModal()">Сохранить</button>
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
        <button class="btn btn-danger btn-full" onclick="MockAuth.signOut();closeModal()">Выйти из аккаунта</button>
      </div>
    `;
  },

  _settingsPrivacyTab() {
    return `
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${[
          ['Принимать запросы в друзья', true],
          ['Личные сообщения от незнакомцев', false],
          ['Показывать активность', true],
          ['Показывать онлайн-статус', true],
        ].map(([label, checked]) => `
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:14px;color:var(--text-2);">${label}</span>
            <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer;">
              <input type="checkbox" ${checked ? 'checked' : ''} style="display:none;" onchange="showToast('Сохранено','success')" />
              <div style="position:absolute;inset:0;background:${checked ? 'var(--accent)' : 'var(--card-2)'};border-radius:11px;transition:0.2s;"></div>
              <div style="position:absolute;top:3px;left:${checked ? '21px' : '3px'};width:16px;height:16px;background:white;border-radius:50%;transition:0.2s;"></div>
            </label>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-primary btn-full" style="margin-top:20px;" onclick="showToast('Сохранено','success');closeModal()">Сохранить</button>
    `;
  },

  _saveProfile() {
    const user = Store.get('user');
    const displayName = document.getElementById('set-displayname').value.trim();
    const bio = document.getElementById('set-bio').value.trim();
    const status = document.getElementById('set-status').value;
    const activity = document.getElementById('set-activity').value.trim();

    if (!displayName) { showToast('Имя не может быть пустым', 'error'); return; }

    MockDB.updateUser(user.id, { displayName, bio, status, activity: activity || null });
    const updated = MockDB.getUser(user.id);
    Store.set('user', updated);
    showToast('Профиль обновлён', 'success');
    closeModal();
    Sidebar.render();
    RightPanel.render();
  },
};

window.Modals = Modals;
