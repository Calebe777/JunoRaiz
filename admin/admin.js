/* JUNO, painel do blog: login, lista, editor, rascunho, pré-visualização e publicação */
(function () {
  var esc = JUNO.esc;
  var DRAFT_KEY = 'juno-admin-draft';
  var PREVIEW_KEY = 'juno-admin-preview';

  var posts = [];
  var editing = null;   // { originalSlug, status, post }
  var lang = 'pt';
  var slugTouched = false;
  var saveTimer = null;

  function $(id) { return document.getElementById(id); }

  /* ---------- API ---------- */
  function api(method, path, body) {
    return fetch(path, {
      method: method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (res.status === 401 && path !== '/api/login.php') { show('login'); throw new Error(data.error || 'Faça login de novo.'); }
        if (!res.ok) throw new Error(data.error || 'Algo deu errado (' + res.status + ').');
        return data;
      });
    });
  }

  /* ---------- telas ---------- */
  function show(view) {
    ['login', 'list', 'edit'].forEach(function (v) { $('v-' + v).hidden = v !== view; });
    $('top').hidden = view === 'login';
    if (view === 'login') setTimeout(function () { $('password').focus(); }, 0);
    window.scrollTo(0, 0);
  }

  var toastTimer = null;
  function toast(msg) {
    var el = $('toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 5000);
  }

  function setError(id, msg) {
    $(id).textContent = msg || '';
    $(id).hidden = !msg;
  }

  /* ---------- utilidades ---------- */
  function slugify(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function fmtDate(d) {
    try { return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch (e) { return d; }
  }
  function imgSrc(path) {
    if (!path) return '';
    return '/' + path;
  }
  function blank() {
    return { slug: '', date: today(), category: '', cover: '', pt: { title: '', excerpt: '', body: '' }, en: { title: '', excerpt: '', body: '' } };
  }

  /* ---------- lista ---------- */
  function loadList() {
    show('list');
    $('list').innerHTML = '<p class="empty">Carregando…</p>';
    return api('GET', '/api/posts.php?all=1').then(function (data) {
      posts = data.posts || [];
      renderList();
    }).catch(function (e) {
      $('list').innerHTML = '<p class="empty">' + esc(e.message) + '</p>';
    });
  }

  function renderList() {
    var pub = posts.filter(function (p) { return p.status === 'published'; }).length;
    var drafts = posts.length - pub;
    $('list-count').textContent = (pub === 1 ? '1 publicado' : pub + ' publicados') + (drafts ? ' · ' + (drafts === 1 ? '1 rascunho' : drafts + ' rascunhos') : '');
    if (!posts.length) { $('list').innerHTML = '<p class="empty">Nenhum post ainda. Clique em “Novo post” pra escrever o primeiro.</p>'; return; }
    $('list').innerHTML = posts.map(function (p) {
      return '<div class="post">' +
        (p.cover ? '<img class="post-thumb" src="' + esc('/' + p.cover) + '" alt="" onerror="this.style.visibility=\'hidden\'">' : '<span class="post-thumb" aria-hidden="true"></span>') +
        '<div><h2>' + esc(p.pt.title) + '</h2><p>' +
        (p.status === 'published' ? '<span class="badge on">Publicado</span>' : '<span class="badge">Rascunho</span>') +
        esc(fmtDate(p.date)) + (p.category ? ' · ' + esc(p.category) : '') + (p.en ? ' · PT + EN' : '') + '</p></div>' +
        '<div class="post-actions">' +
        (p.status === 'published' ? '<a class="btn ghost small" href="/post.html?p=' + encodeURIComponent(p.slug) + '" target="_blank" rel="noopener">Ver</a>' : '') +
        '<button type="button" class="btn ghost small" data-edit="' + esc(p.slug) + '">Editar</button>' +
        (p.status === 'published'
          ? '<button type="button" class="btn ghost small" data-status="draft" data-slug="' + esc(p.slug) + '">Despublicar</button>'
          : '<button type="button" class="btn small" data-status="published" data-slug="' + esc(p.slug) + '">Publicar</button>') +
        '<button type="button" class="btn danger small" data-del="' + esc(p.slug) + '">Apagar</button>' +
        '</div></div>';
    }).join('');
  }

  function removePost(slug) {
    var p = posts.find(function (x) { return x.slug === slug; });
    if (!p || !confirm('Apagar o post “' + p.pt.title + '” de vez?\n\nIsso não pode ser desfeito. Se quiser só tirar do ar, use “Despublicar”.')) return;
    api('DELETE', '/api/posts.php', { slug: slug }).then(function () {
      toast('Post apagado.');
      loadList();
    }).catch(function (e) { alert(e.message); });
  }

  function setStatus(slug, status) {
    api('PATCH', '/api/posts.php', { slug: slug, status: status }).then(function () {
      toast(status === 'published' ? 'Publicado! Já está no ar.' : 'Post despublicado: virou rascunho e saiu do site.');
      loadList();
    }).catch(function (e) { alert(e.message); });
  }

  /* ---------- editor ---------- */
  function openEditor(slug) {
    var src = slug ? posts.find(function (p) { return p.slug === slug; }) : null;
    var post = JSON.parse(JSON.stringify(src || blank()));
    if (!post.en) post.en = { title: '', excerpt: '', body: '' };
    var status = src ? src.status : 'draft';
    delete post.status;
    delete post.updatedAt;

    var draft = readDraft();
    if (draft && draft.originalSlug === (slug || null) && JSON.stringify(draft.post) !== JSON.stringify(post) &&
        confirm('Tem alterações deste post que não foram salvas (de ' + new Date(draft.savedAt).toLocaleString('pt-BR') + ').\n\nRecuperar essas alterações?')) {
      post = draft.post;
    }

    editing = { originalSlug: slug || null, status: status, post: post };
    slugTouched = Boolean(slug) || (post.slug && post.slug !== slugify(post.pt.title));
    lang = 'pt';
    setError('edit-error', '');
    $('draft-status').textContent = '';

    var cats = [];
    posts.forEach(function (p) { if (p.category && cats.indexOf(p.category) < 0) cats.push(p.category); });
    $('categories').innerHTML = cats.map(function (c) { return '<option value="' + esc(c) + '">'; }).join('');

    $('f-date').value = post.date;
    $('f-category').value = post.category || '';
    $('f-slug').value = post.slug;
    renderStatus();
    fillLang();
    renderCover();
    renderSlugUrl();
    show('edit');
    if (!slug) $('f-title').focus();
  }

  function fillLang() {
    var c = editing.post[lang];
    $('f-title').value = c.title;
    $('f-excerpt').value = c.excerpt;
    $('f-body').value = c.body;
    $('f-title').placeholder = lang === 'en' ? 'Post title' : 'Título do post';
    $('f-excerpt').placeholder = lang === 'en' ? 'Short summary (shown on the blog list)' : 'Resumo curto (aparece na lista do blog)';
    $('f-body').placeholder = lang === 'en' ? 'Write the English version here.' : 'Escreva o texto aqui. Deixe uma linha em branco entre os parágrafos.';
    $('en-hint').hidden = lang !== 'en';
    document.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', String(t.getAttribute('data-lang') === lang)); });
  }

  function readForm() {
    var p = editing.post;
    p[lang].title = $('f-title').value;
    p[lang].excerpt = $('f-excerpt').value;
    p[lang].body = $('f-body').value;
    p.date = $('f-date').value;
    p.category = $('f-category').value;
    if (!slugTouched) $('f-slug').value = slugify(p.pt.title);
    p.slug = $('f-slug').value.trim();
    renderSlugUrl();
  }

  function renderSlugUrl() {
    var s = $('f-slug').value.trim();
    $('slug-url').textContent = s ? 'usejuno.com.br/post.html?p=' + s : '';
  }

  function renderStatus() {
    var pub = editing.status === 'published';
    $('publish').textContent = pub ? 'Salvar alterações' : 'Publicar';
    $('save-draft').textContent = pub ? 'Despublicar (voltar pra rascunho)' : 'Salvar rascunho';
    $('status-line').innerHTML = pub ? '<span class="badge on">Publicado</span>no ar no blog' : '<span class="badge">Rascunho</span>' + (editing.originalSlug ? 'salvo, fora do ar' : 'ainda não salvo');
  }

  function renderCover() {
    var c = editing.post.cover;
    $('cover-img').hidden = !c;
    $('cover-empty').hidden = Boolean(c);
    $('cover-remove').hidden = !c;
    if (c) $('cover-img').src = imgSrc(c);
  }

  /* cópia local no navegador, pra não perder texto se a aba fechar antes de salvar */
  function readDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch (e) { return null; }
  }
  function saveDraft() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      var data = { originalSlug: editing.originalSlug, post: editing.post, savedAt: Date.now() };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
        $('draft-status').textContent = 'Alterações não salvas (cópia guardada neste navegador)';
      } catch (e) {}
    }, 600);
  }
  function clearDraft() {
    clearTimeout(saveTimer);
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
  }

  function onInput() {
    readForm();
    saveDraft();
  }

  /* post pronto pra enviar: tira o inglês se estiver vazio */
  function finalPost() {
    readForm();
    var p = JSON.parse(JSON.stringify(editing.post));
    ['pt', 'en'].forEach(function (l) {
      p[l].title = p[l].title.trim();
      p[l].excerpt = p[l].excerpt.trim();
      p[l].body = p[l].body.replace(/\r/g, '').trim();
    });
    if (!p.en.title && !p.en.body && !p.en.excerpt) delete p.en;
    return p;
  }

  function validate(p) {
    if (!p.pt.title) return 'Falta o título em português.';
    if (!p.pt.body) return 'O texto em português está vazio.';
    if (p.en && (!p.en.title || !p.en.body)) return 'A versão em inglês precisa de título e texto (ou deixe ela toda em branco).';
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) return 'O endereço do post só pode ter letras minúsculas, números e hífen.';
    if (!p.date) return 'Escolha a data do post.';
    if (posts.some(function (x) { return x.slug === p.slug && x.slug !== editing.originalSlug; })) return 'Já existe um post com esse endereço. Troque o endereço.';
    return '';
  }

  /* status: 'published' publica (ou salva um post que já está no ar); 'draft' guarda fora do ar */
  function save(status, btn) {
    var p = finalPost();
    var err = validate(p);
    setError('edit-error', err);
    if (err) return;
    var label = btn.textContent;
    var wasPublished = editing.status === 'published';
    $('publish').disabled = $('save-draft').disabled = true;
    btn.textContent = 'Salvando…';
    api('POST', '/api/posts.php', { post: p, originalSlug: editing.originalSlug, status: status }).then(function (res) {
      clearDraft();
      $('draft-status').textContent = '';
      if (status === 'published') {
        editing = null;
        toast(wasPublished ? 'Alterações salvas! Já estão no ar.' : 'Publicado! Já está no ar.');
        loadList();
        return;
      }
      /* rascunho: continua no editor, agora como post salvo */
      editing.originalSlug = res.slug;
      editing.status = 'draft';
      slugTouched = true;
      api('GET', '/api/posts.php?all=1').then(function (d) { posts = d.posts || []; }).catch(function () {});
      toast(wasPublished ? 'Post despublicado: virou rascunho e saiu do site.' : 'Rascunho salvo. Ele não aparece no site até você publicar.');
    }).catch(function (e) {
      setError('edit-error', e.message);
    }).then(function () {
      btn.textContent = label;
      $('publish').disabled = $('save-draft').disabled = false;
      if (editing) renderStatus();
    });
  }

  function preview() {
    var p = finalPost();
    if (!p.pt.title) p.pt.title = 'Sem título';
    try { localStorage.setItem(PREVIEW_KEY, JSON.stringify(p)); }
    catch (e) { alert('Não consegui abrir a pré-visualização neste navegador.'); return; }
    window.open('/post.html?preview=1', 'juno-preview');
  }

  function goBack() {
    if (editing) {
      var draft = readDraft();
      if (draft && draft.originalSlug === editing.originalSlug && !confirm('Sair sem salvar? As alterações ficam guardadas neste navegador e dá pra recuperar depois.')) return;
    }
    editing = null;
    loadList();
  }

  /* ---------- imagens: redimensiona, converte pra WebP e envia pro servidor ---------- */
  function processImage(file, maxW) {
    return new Promise(function (resolve, reject) {
      if (!/^image\//.test(file.type)) { reject(new Error('Escolha um arquivo de imagem.')); return; }
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, maxW / img.naturalWidth);
        var c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * scale);
        c.height = Math.round(img.naturalHeight * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (blob) {
          if (blob && blob.type !== 'image/webp') c.toBlob(resolve, 'image/jpeg', 0.85);
          else resolve(blob);
        }, 'image/webp', 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Não consegui abrir essa imagem.')); };
      img.src = url;
    }).then(function (blob) {
      if (!blob) throw new Error('Não consegui processar essa imagem.');
      var form = new FormData();
      form.append('image', blob, 'imagem');
      form.append('name', file.name);
      toast('Enviando imagem…');
      return fetch('/api/upload.php', { method: 'POST', credentials: 'same-origin', body: form }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (res.status === 401) { show('login'); throw new Error('Faça login de novo.'); }
          if (res.status === 413) throw new Error('Imagem grande demais pro servidor.');
          if (!res.ok || !data.path) throw new Error(data.error || 'Não consegui enviar a imagem (' + res.status + ').');
          $('toast').hidden = true;
          return data.path;
        });
      });
    });
  }

  /* ---------- barra de formatação ---------- */
  function edit(fn) {
    var ta = $('f-body');
    var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
    var r = fn(v.slice(0, s), v.slice(s, e), v.slice(e));
    ta.focus();
    ta.value = r.before + r.sel + r.after;
    ta.setSelectionRange(r.before.length, r.before.length + r.sel.length);
    onInput();
  }

  function wrap(mark, placeholder) {
    edit(function (b, sel, a) { return { before: b + mark, sel: sel || placeholder, after: mark + a }; });
  }

  /* começa um bloco novo (com linha em branco antes e depois) */
  /* text(sel) devolve { text, from, len }: o trecho [from, from+len) fica selecionado
     (ex.: o texto de exemplo, pra ser substituído ao digitar) */
  function block(text) {
    edit(function (b, sel, a) {
      var pre = b.replace(/\s+$/, '');
      pre = pre ? pre + '\n\n' : '';
      var post = a.replace(/^\s+/, '');
      post = post ? '\n\n' + post : '\n\n';
      var r = text(sel);
      var t = r.text, from = r.from == null ? t.length : r.from, len = r.len || 0;
      return { before: pre + t.slice(0, from), sel: t.slice(from, from + len), after: t.slice(from + len) + post };
    });
  }

  function linePrefix(prefix, placeholder, numbered) {
    block(function (sel) {
      var lines = (sel || placeholder).split('\n').filter(function (l) { return l.trim(); });
      var t = lines.map(function (l, i) { return (numbered ? (i + 1) + '. ' : prefix) + l.replace(/^(#{2,3} |> |[-•] |\d+[.)] )/, ''); }).join('\n');
      if (sel) return { text: t };
      var first = t.split('\n')[0];
      var p = numbered ? 3 : prefix.length;
      return { text: t, from: p, len: first.length - p };
    });
  }

  var FMT = {
    bold: function () { wrap('**', 'texto em negrito'); },
    italic: function () { wrap('*', 'texto em itálico'); },
    h2: function () { linePrefix('## ', 'Subtítulo'); },
    h3: function () { linePrefix('### ', 'Subtítulo menor'); },
    quote: function () { linePrefix('> ', 'Uma frase de destaque'); },
    ul: function () { linePrefix('- ', 'Item da lista'); },
    ol: function () { linePrefix('', 'Primeiro passo', true); },
    hr: function () { block(function () { return { text: '---' }; }); },
    link: function () {
      var url = prompt('Endereço do link (ex.: https://instagram.com/junojpeg):', 'https://');
      if (!url || url === 'https://') return;
      if (!/^(https?:|mailto:|\/)/i.test(url)) url = 'https://' + url;
      edit(function (b, sel, a) { return { before: b + '[', sel: sel || 'texto do link', after: '](' + url.replace(/[()\s]/g, encodeURIComponent) + ')' + a }; });
    },
    image: function () { $('body-image').click(); }
  };

  /* ---------- eventos ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      setError('login-error', '');
      var btn = e.target.querySelector('button');
      btn.disabled = true;
      api('POST', '/api/login.php', { password: $('password').value }).then(function () {
        $('password').value = '';
        loadList();
      }).catch(function (err) {
        setError('login-error', err.message);
      }).then(function () { btn.disabled = false; });
    });

    $('logout').addEventListener('click', function () {
      api('DELETE', '/api/login.php', {}).catch(function () {}).then(function () { show('login'); });
    });

    $('new-post').addEventListener('click', function () { openEditor(null); });
    $('list').addEventListener('click', function (e) {
      var ed = e.target.closest('[data-edit]');
      var del = e.target.closest('[data-del]');
      if (ed) openEditor(ed.getAttribute('data-edit'));
      if (del) removePost(del.getAttribute('data-del'));
      var st = e.target.closest('[data-status]');
      if (st) setStatus(st.getAttribute('data-slug'), st.getAttribute('data-status'));
    });

    $('back').addEventListener('click', goBack);
    $('publish').addEventListener('click', function () { save('published', this); });
    $('save-draft').addEventListener('click', function () { save('draft', this); });
    $('preview').addEventListener('click', preview);

    ['f-title', 'f-excerpt', 'f-body', 'f-date', 'f-category'].forEach(function (id) { $(id).addEventListener('input', onInput); });
    $('f-slug').addEventListener('input', function () { slugTouched = true; onInput(); });
    $('f-slug').addEventListener('blur', function () { $('f-slug').value = slugify($('f-slug').value); onInput(); });

    document.querySelectorAll('.tab').forEach(function (t) {
      t.addEventListener('click', function () {
        readForm();
        lang = t.getAttribute('data-lang');
        fillLang();
      });
    });

    document.querySelector('.toolbar').addEventListener('click', function (e) {
      var b = e.target.closest('[data-fmt]');
      if (b) FMT[b.getAttribute('data-fmt')]();
    });
    $('f-body').addEventListener('keydown', function (e) {
      /* Enter dentro de uma lista já começa o próximo item; Enter num item vazio encerra a lista */
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && this.selectionStart === this.selectionEnd) {
        var v = this.value, pos = this.selectionStart;
        var lineStart = v.lastIndexOf('\n', pos - 1) + 1;
        var line = v.slice(lineStart, pos);
        var m = line.match(/^(- |(\d+)[.)] )/);
        if (m) {
          e.preventDefault();
          var before, next;
          if (line === m[1]) { before = v.slice(0, lineStart); next = '\n'; }
          else { before = v.slice(0, pos); next = '\n' + (m[2] ? (Number(m[2]) + 1) + '. ' : '- '); }
          this.value = before + next + v.slice(pos);
          this.setSelectionRange(before.length + next.length, before.length + next.length);
          onInput();
          return;
        }
      }
      if (!(e.ctrlKey || e.metaKey)) return;
      var k = e.key.toLowerCase();
      if (k === 'b') { e.preventDefault(); FMT.bold(); }
      if (k === 'i') { e.preventDefault(); FMT.italic(); }
      if (k === 'k') { e.preventDefault(); FMT.link(); }
    });

    $('body-image').addEventListener('change', function () {
      var f = this.files[0];
      this.value = '';
      if (!f) return;
      processImage(f, 1600).then(function (path) {
        var alt = prompt('Legenda da imagem (opcional, aparece embaixo dela):', '') || '';
        block(function () { return { text: '![' + alt.replace(/[\[\]]/g, '') + '](' + path + ')' }; });
      }).catch(function (e) { alert(e.message); });
    });

    $('cover-file').addEventListener('change', function () {
      var f = this.files[0];
      this.value = '';
      if (!f) return;
      processImage(f, 2000).then(function (path) {
        editing.post.cover = path;
        renderCover();
        saveDraft();
      }).catch(function (e) { alert(e.message); });
    });
    $('cover-remove').addEventListener('click', function () {
      editing.post.cover = '';
      renderCover();
      saveDraft();
    });

    window.addEventListener('beforeunload', function (e) {
      var draft = readDraft();
      if (editing && ($('publish').disabled || (draft && draft.originalSlug === editing.originalSlug))) { e.preventDefault(); e.returnValue = ''; }
    });

    fetch('/api/login.php', { credentials: 'same-origin' }).then(function (res) {
      return res.json().then(function (data) {
        if (res.status === 503) { show('login'); setError('login-error', data.error); return; }
        if (data.loggedIn) loadList(); else show('login');
      });
    }).catch(function () {
      show('login');
      setError('login-error', 'Não consegui falar com o servidor do painel.');
    });
  });
})();
