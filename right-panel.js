/**
 * NEST — Right Panel
 */

const RightPanel = {
  _voiceHandler: null,

  render() {
    const container = document.getElementById('right-panel');
    if (!container) return;

    const server = Store.get('activeServer');
    const allUsers = MockDB.getAllUsers();
    const voiceRooms = MockDB.getVoiceRooms();

    // Get members for current server
    let members = allUsers;
    if (server) {
      members = allUsers.filter(u => server.members.includes(u.id));
    }

    const online = members.filter(u => u.status === 'online');
    const idle = members.filter(u => u.status === 'idle');
    const dnd = members.filter(u => u.status === 'dnd');
    const offline = members.filter(u => u.status === 'offline');

    const currentServerId = server?.id;
    const serverVoiceRooms = voiceRooms.filter(vr => !currentServerId || vr.serverId === currentServerId);

    let html = '';

    // Voice rooms section
    const activeRooms = serverVoiceRooms.filter(vr => vr.participants.length > 0);
    if (activeRooms.length > 0) {
      html += `
        <div class="right-panel-header">🔊 Голосовые</div>
        <div style="padding:8px 0;">
      `;
      activeRooms.forEach(vr => {
        const myRoom = Store.get('voiceRoom')?.id === vr.id;
        html += `
          <div class="voice-room-card ${myRoom ? 'active-room' : ''}" onclick="Sidebar.selectChannel('${vr.serverId}','${vr.channelId}','voice')">
            <div class="voice-room-name">
              🔊 ${Utils.escapeHtml(vr.name)}
              <span style="margin-left:auto;font-size:11px;color:var(--text-3);">${vr.participants.length}</span>
            </div>
            <div class="voice-room-participants">
        `;
        vr.participants.forEach(p => {
          const pu = MockDB.getUser(p.userId);
          if (!pu) return;
          const color = Utils.avatarColors(p.userId);
          html += `
            <div class="voice-participant ${p.speaking ? 'speaking' : ''}">
              <div style="width:16px;height:16px;border-radius:50%;background:${color}20;color:${color};display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;">${Utils.getInitials(pu.username)}</div>
              ${Utils.escapeHtml(pu.username)}
              ${p.muted ? '<span>🔇</span>' : ''}
              ${p.speaking ? '<span style="color:var(--online);">●</span>' : ''}
            </div>
          `;
        });
        html += `</div></div>`;
      });
      html += `</div>`;
    }

    // Members
    html += `<div class="right-panel-header">👥 ${server ? server.name : 'Участники'} · ${members.length}</div>`;
    html += `<div class="right-panel-body" id="rp-members">`;

    if (online.length + idle.length + dnd.length > 0) {
      html += `<div class="online-section-label">В сети — ${online.length + idle.length}</div>`;
      [...online, ...idle, ...dnd].forEach(u => { html += this._renderMember(u); });
    }

    if (offline.length > 0) {
      html += `<div class="online-section-label" style="margin-top:12px;">Не в сети — ${offline.length}</div>`;
      offline.forEach(u => { html += this._renderMember(u); });
    }

    // Trends
    html += `
      </div>
      <div class="right-panel-header" style="margin-top:auto;border-top:1px solid var(--border);border-bottom:none;">📈 Тренды</div>
      <div style="flex-shrink:0;">
        ${this._renderTrends()}
      </div>
    `;

    container.innerHTML = html;
    this._bindEvents();
  },

  _renderMember(u) {
    const statusColors = { online: 'var(--online)', idle: 'var(--warning)', dnd: 'var(--danger)', offline: 'var(--text-3)' };
    const color = Utils.avatarColors(u.id);
    const activityEl = u.activity ? `<div class="online-game">${Utils.escapeHtml(u.activity)}</div>` : '';
    const statusTag = u.activity && u.status === 'online'
      ? `<span class="status-tag status-playing" style="font-size:10px;">${u.activity.includes('Stream') ? '🔴' : '🎮'}</span>`
      : '';

    return `
      <div class="online-user" onclick="Modals.userProfile('${u.id}')">
        <div class="online-avatar">
          <div style="width:30px;height:30px;border-radius:50%;background:${color}20;color:${color};display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:10px;">${Utils.getInitials(u.username)}</div>
          <div class="online-dot ${u.status}"></div>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:4px;">
            <div class="online-name">${Utils.escapeHtml(u.displayName)}</div>
            ${statusTag}
          </div>
          ${activityEl}
        </div>
      </div>
    `;
  },

  _renderTrends() {
    const trends = [
      { tag: '#Valorant', count: '1.2K постов' },
      { tag: '#CS2Update', count: '847 постов' },
      { tag: '#GameDev', count: '523 постов' },
      { tag: '#NestPlatform', count: '312 постов' },
    ];

    return trends.map(t => `
      <div class="trend-item" onclick="showToast('Поиск по ${t.tag}','info')">
        <div class="trend-tag">${t.tag}</div>
        <div class="trend-count">${t.count}</div>
      </div>
    `).join('');
  },

  _bindEvents() {
    // Rebind voice updates
    if (this._voiceHandler) window.removeEventListener('nest:voice', this._voiceHandler);
    this._voiceHandler = () => this.render();
    window.addEventListener('nest:voice', this._voiceHandler);
  },
};

window.RightPanel = RightPanel;
