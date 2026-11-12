/* JUNO Estúdio Criativo, blog (lista de posts e leitura) */
(function () {
  var esc = JUNO.esc;
  var POSTS = [];
  var loaded = false;

  /* posts vêm do banco (api/posts). Na pré-visualização do painel /admin,
     post.html?preview=1 mostra o rascunho salvo no navegador. */
  function loadPosts(done) {
    function finish(list) {
      POSTS = (list || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      loaded = true;
      done();
    }
    if (/[?&]preview=1/.test(location.search)) {
      var draft = null;
      try { draft = JSON.parse(localStorage.getItem('juno-admin-preview')); } catch (e) {}
      finish(draft ? [draft] : []);
      return;
    }
    fetch('/api/posts').then(function (r) { return r.ok ? r.json() : { posts: [] }; })
      .then(function (d) { finish(d.posts); }, function () { finish([]); });
  }

  var UI = {
    pt: {
      navWork: 'Projetos', navAbout: 'Sobre', navServices: 'Serviços', navCta: 'Fale com a gente',
      langBtn: 'EN', langAria: 'Ver o site em inglês',
      themeDark: 'Ler no modo escuro', themeLight: 'Ler no modo claro',
      blogKicker: 'Opiniões e ideias',
      blogIntro: 'O que a gente pensa sobre marca, design e gestão. Sem fórmula pronta, direto do dia a dia do estúdio.',
      filterAria: 'Filtrar por categoria', all: 'Todos',
      read: 'min de leitura', empty: 'Nenhum post por aqui ainda.',
      back: 'Todos os posts', by: 'Júnior Ferreira', role: 'Fundador da JUNO',
      onlyPt: '', share: 'Compartilhar', copy: 'Copiar link', copied: 'Link copiado!',
      ctaTitle: 'Gostou da ideia?', ctaText: 'Bora conversar sobre a sua marca.', ctaBtn: 'Chamar no WhatsApp',
      prev: 'Post anterior', next: 'Próximo post',
      notFound: 'Não encontramos esse post.', notFoundLink: 'Ver todos os posts',
      tagline: 'Administrador por formação, designer por paixão.',
      mailSubject: 'Projeto pelo site da JUNO',
      wa: { general: 'Olá, JUNO! Vim pelo blog e quero conversar sobre um projeto.' }
    },
    en: {
      navWork: 'Work', navAbout: 'About', navServices: 'Services', navCta: 'Get in touch',
      langBtn: 'PT', langAria: 'Ver o site em português',
      themeDark: 'Read in dark mode', themeLight: 'Read in light mode',
      blogKicker: 'Opinions and ideas',
      blogIntro: 'What we think about branding, design and business. No ready-made formulas, straight from the studio day to day.',
      filterAria: 'Filter by category', all: 'All',
      read: 'min read', empty: 'No posts here yet.',
      back: 'All posts', by: 'Júnior Ferreira', role: 'Founder of JUNO',
      onlyPt: 'This post is only available in Portuguese.', share: 'Share', copy: 'Copy link', copied: 'Link copied!',
      ctaTitle: 'Liked the idea?', ctaText: "Let's talk about your brand.", ctaBtn: 'Message us on WhatsApp',
      prev: 'Previous post', next: 'Next post',
      notFound: "We couldn't find this post.", notFoundLink: 'See all posts',
      tagline: 'Business administrator by training, designer by passion.',
      mailSubject: 'Project inquiry from the JUNO website',
      wa: { general: 'Hi, JUNO! I found you through the blog and would like to talk about a project.' }
    }
  };

  var lang = JUNO.getLang();
  var t = UI[lang];
  var cat = 'all';
  var navUpdate = null;
  var page = document.getElementById('blog').getAttribute('data-page');

  function $(id) { return document.getElementById(id); }

  /* ---------- tema claro / escuro ---------- */
  function getTheme() { return document.documentElement.getAttribute('data-blog-theme') === 'dark' ? 'dark' : 'light'; }
  function applyTheme() {
    var th = getTheme();
    var root = $('blog');
    root.classList.toggle('dark', th === 'dark');
    root.setAttribute('data-theme', th);
    $('themebtn').setAttribute('aria-label', th === 'dark' ? t.themeLight : t.themeDark);
    $('themebtn').setAttribute('aria-pressed', th === 'dark' ? 'true' : 'false');
    if (navUpdate) navUpdate();
  }
  function toggleTheme() {
    var next = getTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-blog-theme', next);
    try { localStorage.setItem('juno-blog-theme', next); } catch (e) {}
    applyTheme();
  }

  /* ---------- texto do post (formatação simples) ---------- */
  function inline(s) {
    s = esc(s);
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (m, alt, src) { return '<img src="' + src + '" alt="' + alt + '">'; });
    s = s.replace(/\[([^\]]+)\]\(((?:https?:|mailto:|\/|[a-z0-9])[^)\s]*)\)/gi, function (m, txt, url) {
      var ext = /^https?:/i.test(url);
      return '<a href="' + url + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + txt + '</a>';
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return s;
  }
  function markdown(src) {
    var blocks = String(src || '').replace(/\r/g, '').trim().split(/\n\s*\n/);
    return blocks.map(function (b) {
      var lines = b.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
      if (!lines.length) return '';
      var first = lines[0];
      if (/^---+$/.test(first)) return '<hr>';
      if (/^### /.test(first)) return '<h3>' + inline(first.slice(4)) + '</h3>';
      if (/^## /.test(first)) return '<h2>' + inline(first.slice(3)) + '</h2>';
      if (/^> /.test(first)) return '<blockquote><p>' + lines.map(function (l) { return inline(l.replace(/^>\s?/, '')); }).join(' ') + '</p></blockquote>';
      if (lines.every(function (l) { return /^[-•] /.test(l); })) return '<ul>' + lines.map(function (l) { return '<li>' + inline(l.slice(2)) + '</li>'; }).join('') + '</ul>';
      if (lines.every(function (l) { return /^\d+[.)] /.test(l); })) return '<ol>' + lines.map(function (l) { return '<li>' + inline(l.replace(/^\d+[.)] /, '')) + '</li>'; }).join('') + '</ol>';
      var img = first.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
      if (img && lines.length === 1) return '<figure><img src="' + esc(img[2]) + '" alt="' + esc(img[1]) + '" loading="lazy">' + (img[1] ? '<figcaption>' + esc(img[1]) + '</figcaption>' : '') + '</figure>';
      return '<p>' + lines.map(inline).join(' ') + '</p>';
    }).join('\n');
  }

  /* ---------- utilidades ---------- */
  function content(p) { return (lang === 'en' && p.en) ? p.en : p.pt; }
  function fmtDate(d) {
    try { return new Date(d + 'T12:00:00').toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch (e) { return d; }
  }
  function readTime(p) {
    var words = String(content(p).body || '').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200)) + ' ' + t.read;
  }
  function postUrl(p) { return 'post.html?p=' + encodeURIComponent(p.slug); }

  /* ---------- lista ---------- */
  function renderList() {
    if (!loaded) return;
    var cats = [];
    POSTS.forEach(function (p) { if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category); });
    var chips = [{ id: 'all', label: t.all }].concat(cats.map(function (c) { return { id: c, label: c }; }));
    $('cats').innerHTML = cats.length > 1 ? chips.map(function (c) {
      var on = c.id === cat;
      return '<button type="button" class="chip" data-cat="' + esc(c.id) + '" aria-pressed="' + on + '" style="cursor: pointer; font: inherit; font-size: 14px; background: ' + (on ? 'var(--fg)' : 'transparent') + '; color: ' + (on ? 'var(--bg)' : 'var(--fg)') + '; min-height: 44px; padding: 0 18px">' + esc(c.label) + '</button>';
    }).join('') : '';
    var shown = POSTS.filter(function (p) { return cat === 'all' || p.category === cat; });
    if (!shown.length) { $('list').innerHTML = '<p class="empty">' + esc(t.empty) + '</p>'; return; }
    $('list').innerHTML = shown.map(function (p) {
      var c = content(p);
      return '<a class="post-row" href="' + postUrl(p) + '">' +
        '<div class="meta" style="display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 300; letter-spacing: 1px; color: var(--mute)">' +
        '<span>' + esc(fmtDate(p.date)) + '</span><span>' + esc(p.category || '') + '</span></div>' +
        '<div style="min-width: 0">' +
        (p.cover ? '<img class="post-thumb" src="' + esc(p.cover) + '" alt="" loading="lazy">' : '') +
        '<h2 style="margin: 0; font-size: clamp(28px, 3.4vw, 46px); line-height: 1.08; font-weight: 500; letter-spacing: -0.015em">' + esc(c.title) + '</h2>' +
        '<p style="margin: 16px 0 0; max-width: 62ch; font-size: 18px; line-height: 1.55; color: var(--body)">' + esc(c.excerpt || '') + '</p>' +
        '<p style="margin: 14px 0 0; font-size: 14px; font-weight: 300; letter-spacing: 1px; color: var(--mute)">' + esc(readTime(p)) + '</p>' +
        '</div><span class="arrow" aria-hidden="true">↗</span></a>';
    }).join('');
  }

  /* ---------- leitura ---------- */
  function renderPost() {
    if (!loaded) return;
    var slug = new URLSearchParams(location.search).get('p');
    var idx = -1;
    for (var i = 0; i < POSTS.length; i++) if (POSTS[i].slug === slug) idx = i;
    if (idx < 0 && !slug && POSTS.length) idx = 0;
    var main = $('article');
    if (idx < 0) {
      document.title = 'Blog | JUNO Estúdio Criativo';
      main.innerHTML = '<section style="padding: clamp(120px, 14vw, 200px) 0"><div class="wrap"><h1 style="margin: 0; font-size: clamp(40px, 5vw, 64px); font-weight: 900">' + esc(t.notFound) + '</h1>' +
        '<p style="margin-top: 24px"><a href="blog.html" style="font-size: 18px; text-decoration: underline">' + esc(t.notFoundLink) + '</a></p></div></section>';
      return;
    }
    var p = POSTS[idx];
    var c = content(p);
    var newer = POSTS[idx - 1];
    var older = POSTS[idx + 1];
    var url = location.href.split('#')[0];
    document.title = c.title + ' | Blog JUNO';
    var meta = document.querySelector('meta[name="description"]');
    if (meta && c.excerpt) meta.setAttribute('content', c.excerpt);

    main.innerHTML =
      '<article>' +
      '<header style="padding: clamp(72px, 9vw, 120px) 0 clamp(40px, 5vw, 64px)"><div class="wrap">' +
      '<a href="blog.html" style="display: inline-flex; align-items: center; gap: 8px; font-size: 15px; text-decoration: none; color: var(--mute)">← ' + esc(t.back) + '</a>' +
      '<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px">' +
      (p.category ? '<span class="chip">' + esc(p.category) + '</span>' : '') +
      '<span class="chip">' + esc(fmtDate(p.date)) + '</span><span class="chip">' + esc(readTime(p)) + '</span></div>' +
      '<h1 style="margin: 28px 0 0; font-weight: 900; font-size: clamp(40px, 6vw, 88px); line-height: .98; letter-spacing: -0.03em; max-width: 18ch">' + esc(c.title) + '</h1>' +
      (c.excerpt ? '<p style="margin: 28px 0 0; max-width: 46ch; font-size: clamp(19px, 1.8vw, 24px); line-height: 1.45; font-weight: 500; color: var(--body)">' + esc(c.excerpt) + '</p>' : '') +
      '<div style="display: flex; align-items: center; gap: 14px; margin-top: 36px">' +
      '<img src="assets/img/junior.webp" alt="" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; object-position: 50% 15%; background: #F4F4F2">' +
      '<div style="display: flex; flex-direction: column; gap: 2px"><strong style="font-weight: 700; font-size: 16px">' + esc(t.by) + '</strong><span style="font-size: 14px; color: var(--mute)">' + esc(t.role) + '</span></div></div>' +
      '</div></header>' +
      (p.cover ? '<div class="wrap" style="margin-bottom: clamp(40px, 5vw, 72px)"><img src="' + esc(p.cover) + '" alt="" style="width: 100%; aspect-ratio: 16 / 8; object-fit: cover; border-radius: 16px; display: block"></div>' : '') +
      '<div class="wrap">' +
      (lang === 'en' && !p.en ? '<p class="label" style="margin: 0 0 32px">' + esc(t.onlyPt) + '</p>' : '') +
      '<div class="prose" id="prose">' + markdown(c.body) + '</div>' +
      '<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 48px; padding-top: 28px; border-top: 1px solid var(--line); max-width: 68ch">' +
      '<span style="font-size: 14px; letter-spacing: 1px; color: var(--mute); margin-right: 8px">' + esc(t.share) + '</span>' +
      '<a class="share" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(c.title + ' ' + url) + '">WhatsApp</a>' +
      '<a class="share" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url) + '">LinkedIn</a>' +
      '<button type="button" class="share" id="copylink">' + esc(t.copy) + '</button></div>' +
      '<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 24px; margin-top: clamp(56px, 7vw, 96px); padding: clamp(28px, 4vw, 48px); border-radius: 20px; background: var(--card); border: 1px solid var(--line)">' +
      '<div><h2 style="margin: 0; font-size: clamp(28px, 3vw, 40px); font-weight: 500; line-height: 1.1">' + esc(t.ctaTitle) + '</h2><p style="margin: 8px 0 0; font-size: 18px; color: var(--body)">' + esc(t.ctaText) + '</p></div>' +
      '<a class="btn-solid" data-wa="general" href="https://wa.me/5589981453993">' + esc(t.ctaBtn) + ' <span aria-hidden="true">→</span></a></div>' +
      ((newer || older) ? '<nav class="nextprev" aria-label="Posts" style="display: flex; flex-wrap: wrap; gap: 16px; margin-top: 24px">' +
        (older ? '<a href="' + postUrl(older) + '"><span style="font-size: 14px; color: var(--mute)">← ' + esc(t.prev) + '</span><strong style="font-size: 20px; font-weight: 500">' + esc(content(older).title) + '</strong></a>' : '') +
        (newer ? '<a href="' + postUrl(newer) + '" style="text-align: right"><span style="font-size: 14px; color: var(--mute)">' + esc(t.next) + ' →</span><strong style="font-size: 20px; font-weight: 500">' + esc(content(newer).title) + '</strong></a>' : '') +
        '</nav>' : '') +
      '<div style="height: clamp(72px, 9vw, 120px)"></div></div></article>';

    $('copylink').addEventListener('click', function () {
      var btn = this;
      function done() { btn.textContent = t.copied; setTimeout(function () { btn.textContent = t.copy; }, 2000); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
      else { var i = document.createElement('input'); i.value = url; document.body.appendChild(i); i.select(); try { document.execCommand('copy'); } catch (e) {} i.remove(); done(); }
    });
  }

  function onProgress() {
    var bar = $('progress');
    var prose = $('prose');
    if (!bar || !prose) return;
    var r = prose.getBoundingClientRect();
    var total = r.height - window.innerHeight * 0.6;
    var pct = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
    bar.style.width = (pct * 100).toFixed(1) + '%';
  }

  function render() {
    t = UI[lang];
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    if (page === 'list') renderList(); else renderPost();
    JUNO.applyText(t);
    JUNO.applyLinks(t);
    applyTheme();
    onProgress();
  }

  document.addEventListener('DOMContentLoaded', function () {
    navUpdate = JUNO.watchNav($('nav'), $('langbtn'));
    var themeNav = function () {
      var cls = getTheme() === 'dark' ? 'glass-light' : 'glass-dark';
      var b = $('themebtn');
      b.classList.remove('glass-light', 'glass-dark');
      b.classList.add(cls);
    };
    var baseUpdate = navUpdate;
    navUpdate = function () { baseUpdate(); themeNav(); };
    render();
    loadPosts(render);
    $('themebtn').addEventListener('click', toggleTheme);
    $('langbtn').addEventListener('click', function () {
      lang = lang === 'en' ? 'pt' : 'en';
      JUNO.setLang(lang);
      render();
    });
    if (page === 'list') {
      $('cats').addEventListener('click', function (e) {
        var b = e.target.closest('[data-cat]');
        if (b) { cat = b.getAttribute('data-cat'); renderList(); }
      });
    }
    window.addEventListener('scroll', onProgress, { passive: true });
    window.addEventListener('resize', onProgress);
  });
})();
