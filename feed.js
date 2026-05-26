/**
 * NEST — Feed Page
 */

const FeedPage = {
  _commentExpanded: {},

  render(container) {
    const server = Store.get('activeServer');
    const user = Store.get('user');
    const posts = server ? MockDB.getPosts(server.id) : this._getAllPosts();

    let html = `
      <div class="main-header">
        <span style="color:var(--text-3);font-size:18px;">${server ? '📋' : '🏠'}</span>
        <h1>${server ? Utils.escapeHtml(server.name) : 'Лента'}</h1>
        ${server ? `<span class="tag">${server.memberCount} участников</span>` : ''}
        <div class="header-actions">
          <button class="icon-btn" onclick="FeedPage.refresh()" title="Обновить">↻</button>
          ${server ? `<button class="btn btn-primary btn-sm" onclick="Router.navigate('/server/${server.id}')">О сервере</button>` : ''}
        </div>
      </div>
      <div class="feed-container page-enter" id="feed-body">
    `;

    // Composer
    html += this._renderComposer(user, server);

    if (posts.length === 0) {
      html += `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <div class="empty-state-title">Постов пока нет</div>
          <div class="empty-state-text">Будьте первым! Напишите что-нибудь выше.</div>
        </div>
      `;
    } else {
      posts.forEach(post => { html += this._renderPost(post, user); });
    }

    html += `</div>`;
    container.innerHTML = html;
    this._bindComposer();
  },

  _getAllPosts() {
    const all = MockLS.get('posts') || [];
    return all.sort((a, b) => b.createdAt - a.createdAt).slice(0, 30);
  },

  _renderComposer(user, server) {
    const color = Utils.avatarColors(user.id);
    return `
      <div class="post-card post-composer" style="align-items:flex-start;">
        <div style="width:36px;height:36px;border-radius:50%;background:${color}20;color:${color};display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:13px;flex-shrink:0;">${Utils.getInitials(user.username)}</div>
        <div style="flex:1;">
          <textarea class="composer-input" id="post-textarea" placeholder="Что нового? Поделитесь с комьюнити..." rows="1" oninput="Utils.autoResize(this)"></textarea>
          <div class="composer-actions">
            <button class="icon-btn btn-sm" onclick="FeedPage.attachImage()" title="Изображение">🖼</button>
            <button class="icon-btn btn-sm" onclick="FeedPage.addPoll()" title="Опрос">📊</button>
            <button class="icon-btn btn-sm" title="Эмодзи">😊</button>
            <button class="btn btn-primary btn-sm" style="margin-left:auto;" onclick="FeedPage.submitPost()">Опубликовать</button>
          </div>
          <div id="poll-composer" style="display:none;">
            <div style="margin-top:10px;padding:12px;background:var(--bg);border-radius:8px;border:1px solid var(--border);">
              <div class="section-title" style="margin-bottom:8px;">Опрос</div>
              <input type="text" class="form-input" id="poll-q" placeholder="Вопрос..." style="margin-bottom:6px;" />
              <div id="poll-opts">
                <input type="text" class="form-input" placeholder="Вариант 1" style="margin-bottom:4px;" />
                <input type="text" class="form-input" placeholder="Вариант 2" style="margin-bottom:4px;" />
              </div>
              <button class="btn btn-ghost btn-sm" onclick="FeedPage.addPollOption()">+ Добавить вариант</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _renderPost(post, currentUser) {
    const author = MockDB.getUser(post.authorId);
    if (!author) return '';

    const color = Utils.avatarColors(author.id);
    const comments = MockDB.getComments(post.id);
    const isExpanded = this._commentExpanded[post.id];

    // Reactions
    const reactionsHtml = Object.entries(post.reactions || {}).map(([emoji, users]) => {
      const hasReacted = users.includes(currentUser.id);
      return `<div class="reaction-pill ${hasReacted ? 'active' : ''}" onclick="FeedPage.react('${post.id}','${emoji}')">
        ${emoji} <span>${users.length}</span>
      </div>`;
    }).join('');

    // Quick reactions
    const quickEmojis = ['🔥', '❤️', '💪', '😂', '🎯', '👀'];

    const pollHtml = post.poll ? this._renderPoll(post, currentUser) : '';

    const badgeHtml = author.badges?.includes('pro') ? `<span class="badge badge-pro" style="font-size:10px;">PRO</span>` : '';

    return `
      <div class="post-card" id="post-${post.id}">
        <div class="post-header">
          <div style="width:36px;height:36px;border-radius:50%;background:${color}20;color:${color};display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:13px;flex-shrink:0;cursor:pointer;" onclick="Modals.userProfile('${author.id}')">${Utils.getInitials(author.username)}</div>
          <div>
            <div class="post-author" style="display:flex;align-items:center;gap:6px;cursor:pointer;" onclick="Modals.userProfile('${author.id}')">
              ${Utils.escapeHtml(author.displayName)} ${badgeHtml}
            </div>
            <div class="post-meta">${Utils.timeAgo(post.createdAt)} ${author.activity ? `· <span style="color:var(--text-3);">${Utils.escapeHtml(author.activity)}</span>` : ''}</div>
          </div>
          <div style="margin-left:auto;display:flex;gap:4px;align-items:center;">
            ${post.pinned ? '<span title="Закреплён" style="color:var(--accent);font-size:13px;">📌</span>' : ''}
            <button class="icon-btn btn-sm" onclick="FeedPage.postMenu('${post.id}','${post.authorId}')" style="font-size:13px;">⋮</button>
          </div>
        </div>

        <div class="post-content">${Utils.parseContent(post.content)}</div>

        ${post.image ? `<img class="post-image" src="${post.image}" alt="Post image" loading="lazy" />` : ''}
        ${pollHtml}

        ${reactionsHtml ? `<div class="post-reactions">${reactionsHtml}</div>` : ''}

        <div class="post-actions">
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            ${quickEmojis.map(e => `<button class="post-action-btn" onclick="FeedPage.react('${post.id}','${e}')" style="font-size:15px;padding:4px 6px;">${e}</button>`).join('')}
          </div>
          <div style="margin-left:auto;display:flex;gap:4px;">
            <button class="post-action-btn" onclick="FeedPage.toggleComments('${post.id}')">
              💬 ${comments.length}
            </button>
            <button class="post-action-btn" onclick="FeedPage.sharePost('${post.id}')">
              ↗ Поделиться
            </button>
          </div>
        </div>

        <div id="comments-${post.id}" style="${isExpanded ? '' : 'display:none;'}margin-top:12px;border-top:1px solid var(--border);padding-top:12px;">
          ${this._renderComments(post.id, comments, currentUser)}
        </div>
      </div>
    `;
  },

  _renderPoll(post, currentUser) {
    const poll = post.poll;
    const totalVotes = poll.options.reduce((sum, o) => sum + o.votes.length, 0);
    const hasVoted = poll.options.some(o => o.votes.includes(currentUser.id));

    return `
      <div class="poll-card">
        <div class="poll-question">${Utils.escapeHtml(poll.question)}</div>
        ${poll.options.map((opt, i) => {
          const pct = totalVotes > 0 ? Math.round(opt.votes.length / totalVotes * 100) : 0;
          const voted = opt.votes.includes(currentUser.id);
          return `
            <div class="poll-option ${voted ? 'voted' : ''}" onclick="FeedPage.vote('${post.id}',${i})">
              <div class="poll-bar" style="width:${hasVoted ? pct : 0}%"></div>
              <span>${Utils.escapeHtml(opt.text)}</span>
              ${hasVoted ? `<span style="font-weight:600;color:${voted ? 'var(--accent)' : 'var(--text-3)'};">${pct}%</span>` : ''}
            </div>
          `;
        }).join('')}
        <div style="font-size:11px;color:var(--text-3);margin-top:6px;">${totalVotes} голосов</div>
      </div>
    `;
  },

  _renderComments(postId, comments, currentUser) {
    let html = '';

    comments.forEach(c => {
      const author = MockDB.getUser(c.authorId);
      if (!author) return;
      const color = Utils.avatarColors(author.id);
      html += `
        <div class="msg-group" style="margin-bottom:8px;">
          <div style="width:28px;height:28px;border-radius:50%;background:${color}20;color:${color};display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:10px;flex-shrink:0;cursor:pointer;margin-top:2px;" onclick="Modals.userProfile('${author.id}')">${Utils.getInitials(author.username)}</div>
          <div style="flex:1;">
            <div class="msg-header">
              <span class="msg-author" style="cursor:pointer;" onclick="Modals.userProfile('${author.id}')">${Utils.escapeHtml(author.displayName)}</span>
              <span class="msg-time">${Utils.timeAgo(c.createdAt)}</span>
            </div>
            <div class="msg-text">${Utils.parseContent(c.content)}</div>
          </div>
        </div>
      `;
    });

    html += `
      <div style="display:flex;gap:8px;margin-top:8px;">
        <input type="text" class="form-input" style="flex:1;padding:8px 12px;font-size:13px;" id="comment-input-${postId}" placeholder="Написать комментарий..." onkeydown="if(event.key==='Enter')FeedPage.submitComment('${postId}')" />
        <button class="btn btn-primary btn-sm" onclick="FeedPage.submitComment('${postId}')">→</button>
      </div>
    `;

    return html;
  },

  _bindComposer() {
    const ta = document.getElementById('post-textarea');
    if (ta) ta.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'Enter') FeedPage.submitPost(); });
  },

  // ── ACTIONS ──
  submitPost() {
    const content = document.getElementById('post-textarea')?.value.trim();
    if (!content) { showToast('Напишите что-нибудь', 'warning'); return; }

    const server = Store.get('activeServer');
    const user = Store.get('user');

    // Check for poll
    let poll = null;
    const pollQ = document.getElementById('poll-q')?.value.trim();
    if (pollQ) {
      const inputs = document.querySelectorAll('#poll-opts input');
      const opts = Array.from(inputs).map(i => i.value.trim()).filter(Boolean);
      if (opts.length >= 2) {
        poll = { question: pollQ, options: opts.map(t => ({ text: t, votes: [] })) };
      }
    }

    MockDB.createPost({
      serverId: server?.id || 's1',
      authorId: user.id,
      content,
      poll,
    });

    showToast('Пост опубликован!', 'success');
    App.renderMain();
  },

  react(postId, emoji) {
    const user = Store.get('user');
    MockDB.toggleReaction(postId, emoji, user.id);
    // Re-render just the post card
    const post = (MockLS.get('posts') || []).find(p => p.id === postId);
    if (!post) return;
    const el = document.getElementById('post-' + postId);
    if (!el) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this._renderPost(post, user);
    el.replaceWith(tempDiv.firstElementChild);
  },

  vote(postId, optionIdx) {
    const user = Store.get('user');
    MockDB.votePoll(postId, optionIdx, user.id);
    const post = (MockLS.get('posts') || []).find(p => p.id === postId);
    if (!post) return;
    const el = document.getElementById('post-' + postId);
    if (!el) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this._renderPost(post, user);
    this._commentExpanded[postId] = true;
    el.replaceWith(tempDiv.firstElementChild);
  },

  toggleComments(postId) {
    this._commentExpanded[postId] = !this._commentExpanded[postId];
    const el = document.getElementById('comments-' + postId);
    if (el) el.style.display = this._commentExpanded[postId] ? '' : 'none';
  },

  submitComment(postId) {
    const input = document.getElementById('comment-input-' + postId);
    const content = input?.value.trim();
    if (!content) return;

    const user = Store.get('user');
    MockDB.addComment(postId, user.id, content);
    input.value = '';

    // Re-render comments
    const comments = MockDB.getComments(postId);
    const el = document.getElementById('comments-' + postId);
    if (el) el.innerHTML = this._renderComments(postId, comments, user);
  },

  addPoll() {
    const el = document.getElementById('poll-composer');
    if (el) el.style.display = el.style.display === 'none' ? '' : 'none';
  },

  addPollOption() {
    const opts = document.getElementById('poll-opts');
    if (!opts) return;
    const count = opts.querySelectorAll('input').length + 1;
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'form-input';
    inp.placeholder = `Вариант ${count}`;
    inp.style.marginBottom = '4px';
    opts.appendChild(inp);
  },

  attachImage() {
    showToast('Загрузка изображений будет доступна с Firebase Storage', 'info');
  },

  sharePost(postId) {
    const link = `${window.location.origin}${window.location.pathname}#/post/${postId}`;
    navigator.clipboard?.writeText(link).then(() => showToast('Ссылка скопирована!', 'success'));
  },

  postMenu(postId, authorId) {
    const user = Store.get('user');
    const isAuthor = user.id === authorId;
    openModal(`
      <div class="modal-header">
        <h2 class="modal-title">Действия с постом</h2>
        <button class="icon-btn" onclick="closeModal()">✕</button>
      </div>
      <div>
        <div class="dropdown-item" onclick="closeModal();FeedPage.sharePost('${postId}')">🔗 Поделиться</div>
        <div class="dropdown-item" onclick="closeModal();showToast('Пост сохранён','success')">🔖 Сохранить</div>
        ${isAuthor ? `<div class="dropdown-divider"></div><div class="dropdown-item danger" onclick="closeModal();FeedPage.deletePost('${postId}')">🗑 Удалить</div>` : `<div class="dropdown-item" onclick="closeModal();showToast('Пост отправлен в модерацию','info')">🚩 Пожаловаться</div>`}
      </div>
    `);
  },

  deletePost(postId) {
    const posts = MockLS.get('posts') || [];
    MockLS.set('posts', posts.filter(p => p.id !== postId));
    showToast('Пост удалён', 'success');
    App.renderMain();
  },

  refresh() {
    App.renderMain();
  },
};

window.FeedPage = FeedPage;
