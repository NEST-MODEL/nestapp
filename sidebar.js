/**
 * NEST — Sidebar Component
 * Левая панель: иконки серверов + каналы
 */

const Sidebar = {
  _unsubVoice: null,

  render() {
    const user = Store.get('user');
    if (!user) return;

    this.renderServerIcons();
    this.renderChannels();
    this._bindVoice();
  },

  // ── SERVER ICONS ──
  renderServerIcons() {
    const user = Store.get('user');
    const allServers = MockDB.getServers();
    const userServers = allServers.filter(s => s.members.includes(user.id));

    const container = document.getElementById('sidebar-servers');
    if (!container) return;

    const activeServerId = Store.get('activeServer')?.id;

    const homeActive = !activeServerId ? 'active' : '';
    let html = `
      <div class="server-icon ${homeActive}" onclick="Sidebar.goHome()" title="Главная">
        <div class="indicator"></div>
        🏠
      </div>
      <div class="sidebar-divider"></div>
    `;

    userServers.forEach(server => {
      const isActive = server.id === activeServerId ? 'active' : '';
      const totalUnread = this._serverUnread(server);
      const badge = totalUnread > 0 ? `<div class="badge">${totalUnread > 9 ? '9+' : totalUnread}</div>` : '';
      html += `
        <div class="server-icon ${isActive}" onclick="Sidebar.selectServer('${server.id}')" title="${Utils.escapeHtml(server.name)}" style="background:${server.iconColor}20;color:${server.iconColor};">
          <div class="indicator"></div>
          ${badge}
          ${Utils.escapeHtml(server.icon)}
        </div>
      `;
    });

    html += `
      <div class="sidebar-divider"></div>
      <div class="server-icon server-icon-add" onclick="Modals.createServer()" title="Создать сервер">+</div>
      <div class="sidebar-divider"></div>
    `;

    // Voice room indicator at bottom
    const voiceRoom = Store.get('voiceRoom');
    if (voiceRoom) {
      html += `
        <div class="server-icon" style="background:rgba(76,175,80,0.1);color:var(--online);border-color:var(--online);" onclick="Router.navigate('/voice')" title="Голосовой чат">
          🎙
        </div>
      `;
    }

    // User at bottom
    html += `
      <div class="sidebar-user">
        ${this._renderUserIcon(user)}
      </div>
    `;

    container.innerHTML = html;
  },

  _renderUserIcon(user) {
    const statusColors = { online: 'var(--online)', idle: 'var(--warning)', dnd: 'var(--danger)', offline: 'var(--text-3)' };
    const color = Utils.avatarColors(user.id);
    return `
      <div class="server-icon" onclick="Router.navigate('/profile/${user.id}')" title="${Utils.escapeHtml(user.username)}" style="position:relative;">
        <div style="width:36px;height:36px;border-radius:50%;background:${color}20;color:${color};display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:13px;">
          ${Utils.getInitials(user.username)}
        </div>
        <div style="position:absolute;bottom:2px;right:2px;width:10px;height:10px;border-radius:50%;background:${statusColors[user.status] || 'var(--text-3)'};border:2px solid var(--bg);"></div>
      </div>
      <button class="icon-btn" onclick="MockAuth.signOut()" title="Выйти" style="font-size:14px;">⬚</button>
    `;
  },

  _serverUnread(server) {
    let count = 0;
    server.categories.forEach(cat => {
      cat.channels.forEach(ch => { count += ch.unread || 0; });
    });
    return count;
  },

  // ── SELECT SERVER ──
  selectServer(serverId) {
    const server = MockDB.getServer(serverId);
    if (!server) return;
    Store.set('activeServer', server);
    Store.set('activePage', 'feed');

    // Auto-select first text channel
    let firstTextChannel = null;
    for (const cat of server.categories) {
      firstTextChannel = cat.channels.find(ch => ch.type === 'text');
      if (firstTextChannel) break;
    }
    if (firstTextChannel) {
      Store.set('activeChannel', firstTextChannel);
    }

    this.renderServerIcons();
    this.renderChannels();
    App.renderMain();
  },

  goHome() {
    Store.set('activeServer', null);
    Store.set('activeChannel', null);
    Store.set('activePage', 'home');
    this.renderServerIcons();
    this.renderChannels();
    App.renderMain();
  },

  // ── CHANNELS ──
  renderChannels() {
    const container = document.getElementById('sidebar-channels');
    if (!container) return;

    const server = Store.get('activeServer');
    const user = Store.get('user');

    if (!server) {
      // DM list when no server selected
      container.innerHTML = this._renderDMList(user);
      return;
    }

    const activeChannelId = Store.get('activeChannel')?.id;

    let html = `
      <div class="channels-header">
        <h2>${Utils.escapeHtml(server.name)}</h2>
        <button class="icon-btn btn-sm" onclick="Sidebar.showServerMenu('${server.id}')" style="font-size:12px;">⋮</button>
      </div>
      <div class="channels-body" id="channels-body">
    `;

    server.categories.forEach(cat => {
      html += `
        <div class="channel-category" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
          <span style="font-size:9px;">▾</span>
          ${Utils.escapeHtml(cat.name)}
          <button class="icon-btn btn-sm" style="margin-left:auto;font-size:11px;opacity:0;" onclick="event.stopPropagation();Modals.addChannel('${server.id}','${cat.id}')">+</button>
        </div>
        <div>
      `;

      cat.channels.forEach(ch => {
        const isActive = ch.id === activeChannelId ? 'active' : '';
        const icon = ch.type === 'voice' ? '🔊' : '#';
        const unreadEl = ch.unread > 0 ? `<span class="unread-count">${ch.unread}</span>` : (ch.unread === 0 && !isActive ? '' : '');

        html += `
          <div class="channel-item ${isActive}" onclick="Sidebar.selectChannel('${server.id}', '${ch.id}', '${ch.type}')">
            <span class="channel-icon">${icon}</span>
            <span class="channel-name">${Utils.escapeHtml(ch.name)}</span>
            ${unreadEl}
          </div>
        `;
      });

      html += `</div>`;
    });

    html += `</div>`;

    // Footer
    const voiceRoom = Store.get('voiceRoom');
    html += this._renderChannelFooter(user, voiceRoom);

    container.innerHTML = html;
  },

  _renderDMList(user) {
    const friends = user.friends || [];
    const friendUsers = friends.map(id => MockDB.getUser(id)).filter(Boolean);

    let html = `
      <div class="channels-header">
        <h2 style="font-family:var(--font-display);">🪺 NEST</h2>
      </div>
      <div style="padding:8px;">
        <div class="search-bar">
          <span style="color:var(--text-3);font-size:13px;">🔍</span>
          <input type="text" placeholder="Найти или начать чат..." oninput="Sidebar.searchDM(this.value)" />
        </div>
      </div>
      <div class="channels-body">
        <div class="channel-category">Личные сообщения</div>
    `;

    if (friendUsers.length === 0) {
      html += `<div style="padding:16px;color:var(--text-3);font-size:13px;text-align:center;">Нет друзей<br><span style="font-size:11px;">Добавьте друзей через профиль</span></div>`;
    }

    friendUsers.forEach(friend => {
      const color = Utils.avatarColors(friend.id);
      const statusColors = { online: 'var(--online)', idle: 'var(--warning)', dnd: 'var(--danger)', offline: 'var(--text-3)' };
      html += `
        <div class="channel-item" onclick="Sidebar.openDM('${friend.id}')">
          <div style="position:relative;width:28px;height:28px;flex-shrink:0;">
            <div style="width:28px;height:28px;border-radius:50%;background:${color}20;color:${color};display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:11px;">${Utils.getInitials(friend.username)}</div>
            <div style="position:absolute;bottom:-1px;right:-1px;width:8px;height:8px;border-radius:50%;background:${statusColors[friend.status] || 'var(--text-3)'};border:2px solid var(--bg-2);"></div>
          </div>
          <span class="channel-name">${Utils.escapeHtml(friend.displayName)}</span>
        </div>
      `;
    });

    html += `
      </div>
      ${this._renderChannelFooter(Store.get('user'), Store.get('voiceRoom'))}
    `;
    return html;
  },

  _renderChannelFooter(user, voiceRoom) {
    const statusColors = { online: 'var(--online)', idle: 'var(--warning)', dnd: 'var(--danger)', offline: 'var(--text-3)' };
    const statusLabels = { online: 'В сети', idle: 'Отошёл', dnd: 'Не беспокоить', offline: 'Не в сети' };

    let html = '';

    if (voiceRoom) {
      html += `
        <div style="background:rgba(76,175,80,0.08);border-top:1px solid var(--online);border-bottom:1px solid var(--border);padding:8px 12px;">
          <div style="display:flex;align-items:center;gap:6px;color:var(--online);font-size:12px;font-weight:500;margin-bottom:4px;">
            <span>🎙</span> ${Utils.escapeHtml(voiceRoom.name)}
          </div>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-sm btn-ghost" style="font-size:11px;" onclick="VoicePage.toggleMute()">${Store.get('isMuted') ? '🔇 Включить' : '🎙 Мут'}</button>
            <button class="btn btn-sm btn-danger" style="font-size:11px;" onclick="VoicePage.leave()">Выйти</button>
          </div>
        </div>
      `;
    }

    html += `
      <div class="channels-footer">
        <div style="position:relative;width:30px;height:30px;flex-shrink:0;">
          <div style="width:30px;height:30px;border-radius:50%;background:${Utils.avatarColors(user.id)}20;color:${Utils.avatarColors(user.id)};display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:11px;">${Utils.getInitials(user.username)}</div>
          <div style="position:absolute;bottom:-1px;right:-1px;width:9px;height:9px;border-radius:50%;background:${statusColors[user.status] || 'var(--text-3)'};border:2px solid var(--bg);"></div>
        </div>
        <div class="user-info" onclick="Router.navigate('/profile/${user.id}')" style="cursor:pointer;">
          <div class="user-name">${Utils.escapeHtml(user.username)}</div>
          <div class="user-status" style="color:${statusColors[user.status]};">${statusLabels[user.status] || 'В сети'}</div>
        </div>
        <div style="display:flex;gap:2px;">
          <button class="icon-btn" onclick="Sidebar.toggleMute()" title="Микрофон" style="font-size:14px;">${Store.get('isMuted') ? '🔇' : '🎙'}</button>
          <button class="icon-btn" onclick="Router.navigate('/notifications')" title="Уведомления" style="font-size:14px;">🔔</button>
          <button class="icon-btn" onclick="Modals.settings()" title="Настройки" style="font-size:14px;">⚙</button>
        </div>
      </div>
    `;

    return html;
  },

  selectChannel(serverId, channelId, type) {
    const server = MockDB.getServer(serverId);
    if (!server) return;

    let channel = null;
    for (const cat of server.categories) {
      channel = cat.channels.find(c => c.id === channelId);
      if (channel) break;
    }
    if (!channel) return;

    // Clear unread
    channel.unread = 0;

    Store.set('activeChannel', channel);
    Store.set('activeServer', server);

    if (type === 'voice') {
      Router.navigate('/voice/' + channelId);
    } else {
      Store.set('activePage', 'chat');
      App.renderMain();
      this.renderChannels();
    }
  },

  openDM(userId) {
    Store.set('activePage', 'dm');
    Store.set('dmUser', MockDB.getUser(userId));
    App.renderMain();
  },

  showServerMenu(serverId) {
    const server = MockDB.getServer(serverId);
    const user = Store.get('user');
    const isOwner = server.ownerId === user.id;

    openModal(`
      <div class="modal-header">
        <h2 class="modal-title">${Utils.escapeHtml(server.name)}</h2>
        <button class="icon-btn" onclick="closeModal()">✕</button>
      </div>
      <div>
        <div class="dropdown-item" onclick="closeModal();Router.navigate('/server/${serverId}')">📋 Страница сервера</div>
        <div class="dropdown-item" onclick="closeModal();Sidebar.inviteToServer('${serverId}')">🔗 Пригласить</div>
        ${isOwner ? `<div class="dropdown-divider"></div><div class="dropdown-item danger" onclick="closeModal();Sidebar.deleteServer('${serverId}')">🗑 Удалить сервер</div>` : `<div class="dropdown-divider"></div><div class="dropdown-item danger" onclick="closeModal();Sidebar.leaveServer('${serverId}')">🚪 Покинуть</div>`}
      </div>
    `);
  },

  inviteToServer(serverId) {
    const link = `${window.location.origin}${window.location.pathname}#/join/${serverId}`;
    navigator.clipboard?.writeText(link).then(() => showToast('Ссылка скопирована!', 'success'));
  },

  leaveServer(serverId) {
    const user = Store.get('user');
    showToast('Вы покинули сервер', 'info');
    Sidebar.goHome();
  },

  deleteServer(serverId) {
    showToast('Сервер удалён', 'info');
    Sidebar.goHome();
  },

  searchDM(query) {
    // Filter DM list — simplified
  },

  toggleMute() {
    Store.set('isMuted', !Store.get('isMuted'));
    this.renderChannels();
  },

  _bindVoice() {
    window.removeEventListener('nest:voice', this._onVoice);
    this._onVoice = () => this.renderChannels();
    window.addEventListener('nest:voice', this._onVoice);
  },
};

window.Sidebar = Sidebar;
