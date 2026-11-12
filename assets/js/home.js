/* JUNO Estúdio Criativo, página inicial */
(function () {
  var esc = JUNO.esc;

  var DICT = {
    pt: {
      bar: 'Black Friday chegando: criativos prontos pra sua loja vender mais',
      navWork: 'Projetos', navAbout: 'Sobre', navServices: 'Serviços', navContact: 'Contato', navCta: 'Fale com a gente',
      langBtn: 'EN', langAria: 'Ver o site em inglês',
      heroLead: 'Marcas que',
      words: ['se posicionam', 'vendem bonito', 'ficam na memória', 'crescem com estratégia'],
      heroSub: 'Estúdio de design que une gestão e criatividade pra transformar negócios em marcas fortes, consistentes e com propósito.',
      heroBtn1: 'Ver projetos', heroBtn2: 'Pedir orçamento',
      fewWords: 'Em poucas palavras',
      aboutTitle: 'Administrador por formação, designer por paixão',
      about1: 'A JUNO nasce do encontro entre a planilha e a prancheta. Antes de desenhar, a gente entende o negócio: público, posicionamento, preço e objetivo.',
      about2: 'Depois, transforma isso em identidade, conteúdo e presença digital que trabalham a favor de quem vende. Design bonito é o mínimo. Design que faz sentido pro negócio é o que a gente entrega.',
      photoAlt: 'Júnior Ferreira, fundador da JUNO',
      projTitle: 'Projetos que ganharam vida', projAll: 'Ver todos os projetos',
      wideTags: 'KV de Evento • Cenografia • Materiais Impressos', wideAlt: 'Key visual do Conecta Prev em azul e coral',
      proj: [
        { name: 'Euvaldo Filho Advocacia', tags: 'Identidade Visual • Branding • Papelaria', alt: 'Logo Euvaldo Filho em dourado sobre papel preto' },
        { name: 'Thaís Coelho Nutrição', tags: 'Identidade Visual • Cartão de Visita • Social', alt: 'Cartões de visita da identidade Thaís Coelho' },
        { name: 'RBV', tags: 'Identidade Visual • Branding • Papelaria', alt: 'Cartões de visita da identidade RBV' },
        { name: 'BNET', tags: 'Identidade Visual • Branding • Digital', alt: 'Logo BNET sobre fundo azul texturizado' }
      ],
      storiesTitle: 'Histórias que nos orgulham',
      stories: [
        'Uma marca jurídica refinada e, ao mesmo tempo, calorosa: monograma clássico, paleta em marrom café e off-white e um sistema que vai do cartão aos uniformes da equipe.',
        'A marca da Prefeitura de Coronel José Dias nasce da paisagem da cidade: o sol, as ondas e a Pedra Furada, símbolo da Serra da Capivara, unidos na mensagem “Um novo tempo chegou!”.',
        'Consultoria vende confiança antes de vender serviço. Pra RBV, criamos uma marca de formas geométricas e cortes precisos, que comunica estrutura, direção e segurança pra decidir.'
      ],
      clientsAria: 'Marcas que já atendemos',
      statsAria: 'Escolher número',
      stats: [
        { big: '+1.000 projetos', label: 'criados ao longo da trajetória', short: 'Projetos' },
        { big: '10 a 20 dias', label: 'pra entregar uma identidade visual completa', short: 'Prazo de identidade visual' },
        { big: '7 a 15 dias', label: 'pra tirar do papel o KV do seu evento', short: 'Prazo de KV de evento' },
        { big: '100% online', label: 'atendimento pra negócios de todo o Brasil', short: 'Atendimento' }
      ],
      svcTitle: 'O que a gente faz',
      svcPay: 'Pagamento em 50% pra começar e 50% na entrega. Pix, cartão e parcelamento conforme o projeto.',
      services: [
        { title: 'Identidade Visual', text: 'Não é só um logo: é um sistema visual completo pra sua marca ser reconhecida em qualquer lugar. Entrega em 10 a 20 dias.' },
        { title: 'Design para Redes', text: 'Posts, stories e carrosséis pensados pra chamar atenção, manter a consistência e vender.' },
        { title: 'KV de Eventos', text: 'O key visual completo do seu evento, aplicado em todas as peças. Entrega em 7 a 15 dias.' },
        { title: 'Materiais Impressos', text: 'Flyers, banners, crachás e convites com arte pronta pra gráfica.' },
        { title: 'Sites e Landing Pages', text: 'Páginas de conversão com a cara da sua marca, feitas pra transformar visita em contato.' }
      ],
      comboTag: 'Combo',
      comboTitle: 'JUNO Start + Kit de Lançamento',
      comboIntro: 'Tudo o que sua marca precisa pra estrear com cara profissional, da identidade ao Instagram no ar.',
      comboBtn: 'Quero o combo',
      comboGroups: [
        { title: 'Identidade visual (JUNO Start)', items: ['Logotipo principal', 'Versões horizontal, vertical e monocromática', 'Paleta de cores e tipografia principal', 'Cartão de visita (arte para impressão)', 'Papel timbrado e envelope', 'Arquivos para redes e impressão (PNG, SVG e PDF)'] },
        { title: 'Kit de Lançamento', items: ['Configuração visual do Instagram', '9 posts de inauguração', '5 stories editáveis', 'Cartão digital', 'Link da bio personalizado'] }
      ],
      contactTitle: 'bora criar junto?',
      contactText: 'Se preferir, chama a gente direto no WhatsApp ou manda um e-mail:',
      fName: 'Nome *', fNeed: 'Do que você precisa? *', fStage: 'Momento do negócio *', fFound: 'Como conheceu a JUNO?', fMsg: 'Conta um pouco mais (em poucas linhas)', fSend: 'Enviar',
      optNeed: ['Identidade visual', 'Design para redes', 'KV de evento', 'Materiais impressos', 'Site ou landing page', 'Ainda não sei, quero conversar'],
      optStage: ['Vou começar agora', 'Já existo e quero me reposicionar', 'Tenho um evento chegando', 'Quero vender mais nas redes'],
      optFound: ['Instagram', 'Indicação', 'Google', 'Behance', 'Evento', 'Outro'],
      waIntro: 'Olá, JUNO! Vim pelo site.',
      waLabels: { name: 'Nome', need: 'Preciso de', stage: 'Momento', found: 'Conheci a JUNO por', msg: 'Mensagem' },
      siteMap: 'Mapa do site',
      place: 'São Raimundo Nonato, Piauí', online: 'Atendimento online pra todo o Brasil',
      tagline: 'Administrador por formação, designer por paixão.',
      mailSubject: 'Projeto pelo site da JUNO',
      wa: {
        general: 'Olá, JUNO! Vim pelo site e quero conversar sobre um projeto.',
        quote: 'Olá, JUNO! Vim pelo site e gostaria de solicitar um orçamento para o meu projeto.',
        combo: 'Olá, JUNO! Vim pelo site e tenho interesse no combo JUNO Start + Kit de Lançamento.',
        services: [
          'Olá, JUNO! Vim pelo site e quero um orçamento de identidade visual para a minha marca.',
          'Olá, JUNO! Vim pelo site e quero um orçamento de design para redes sociais (posts, stories e carrosséis).',
          'Olá, JUNO! Vim pelo site e quero um orçamento de KV para o meu evento.',
          'Olá, JUNO! Vim pelo site e quero um orçamento de materiais impressos.',
          'Olá, JUNO! Vim pelo site e quero um orçamento de site ou landing page.'
        ]
      }
    },
    en: {
      bar: 'Black Friday is coming: ready-made creatives to help your store sell more',
      navWork: 'Work', navAbout: 'About', navServices: 'Services', navContact: 'Contact', navCta: 'Get in touch',
      langBtn: 'PT', langAria: 'Ver o site em português',
      heroLead: 'Brands that',
      words: ['stand out', 'sell beautifully', 'stay memorable', 'grow with strategy'],
      heroSub: 'A design studio that brings business management and creativity together to turn companies into strong, consistent, purposeful brands.',
      heroBtn1: 'See our work', heroBtn2: 'Request a quote',
      fewWords: 'In a few words',
      aboutTitle: 'Business administrator by training, designer by passion',
      about1: 'JUNO was born where the spreadsheet meets the drawing board. Before designing anything, we get to know the business: audience, positioning, pricing and goals.',
      about2: 'Then we turn that into identity, content and digital presence that work for the people who sell. Beautiful design is the bare minimum. Design that makes sense for the business is what we deliver.',
      photoAlt: 'Júnior Ferreira, founder of JUNO',
      projTitle: 'Projects brought to life', projAll: 'See all projects',
      wideTags: 'Event Key Visual • Scenography • Print', wideAlt: 'Conecta Prev key visual in blue and coral',
      proj: [
        { name: 'Euvaldo Filho Law Firm', tags: 'Visual Identity • Branding • Stationery', alt: 'Euvaldo Filho logo in gold on black paper' },
        { name: 'Thaís Coelho Nutrition', tags: 'Visual Identity • Business Card • Social', alt: 'Thaís Coelho business cards' },
        { name: 'RBV', tags: 'Visual Identity • Branding • Stationery', alt: 'RBV business cards' },
        { name: 'BNET', tags: 'Visual Identity • Branding • Digital', alt: 'BNET logo on a textured blue background' }
      ],
      storiesTitle: "Stories we're proud of",
      stories: [
        'A refined yet warm legal brand: a classic monogram, a coffee brown and off-white palette, and a system that runs from business cards to team uniforms.',
        'The Coronel José Dias City Hall brand is born from the town landscape: the sun, the waves and Pedra Furada, the icon of Serra da Capivara, brought together by the message “A new time has come!”.',
        'Consulting sells trust before it sells a service. For RBV, we created a brand of geometric shapes and precise cuts that conveys structure, direction and confidence to make decisions.'
      ],
      clientsAria: 'Brands we have worked with',
      statsAria: 'Choose a number',
      stats: [
        { big: '+1,000 projects', label: 'created throughout the journey', short: 'Projects' },
        { big: '10 to 20 days', label: 'to deliver a complete visual identity', short: 'Visual identity timeline' },
        { big: '7 to 15 days', label: 'to bring your event key visual to life', short: 'Event key visual timeline' },
        { big: '100% online', label: 'serving businesses all over Brazil', short: 'Service' }
      ],
      svcTitle: 'What we do',
      svcPay: 'Payment: 50% to start and 50% on delivery. Pix, card and installments depending on the project.',
      services: [
        { title: 'Visual Identity', text: 'It is not just a logo: it is a complete visual system so your brand is recognized anywhere. Delivered in 10 to 20 days.' },
        { title: 'Social Media Design', text: 'Posts, stories and carousels designed to grab attention, stay consistent and sell.' },
        { title: 'Event Key Visuals', text: 'The complete key visual for your event, applied to every piece. Delivered in 7 to 15 days.' },
        { title: 'Print Materials', text: 'Flyers, banners, badges and invitations with print-ready artwork.' },
        { title: 'Websites and Landing Pages', text: 'Conversion pages that look like your brand, built to turn visits into leads.' }
      ],
      comboTag: 'Bundle',
      comboTitle: 'JUNO Start + Launch Kit',
      comboIntro: 'Everything your brand needs to launch looking professional, from the identity to an Instagram profile ready to go.',
      comboBtn: 'I want the bundle',
      comboGroups: [
        { title: 'Visual identity (JUNO Start)', items: ['Primary logo', 'Horizontal, vertical and monochrome versions', 'Color palette and primary typography', 'Business card (print-ready artwork)', 'Letterhead and envelope', 'Files for social media and print (PNG, SVG and PDF)'] },
        { title: 'Launch Kit', items: ['Instagram visual setup', '9 launch posts', '5 editable stories', 'Digital business card', 'Custom link in bio page'] }
      ],
      contactTitle: 'shall we create together?',
      contactText: 'Prefer to reach out directly? Message us on WhatsApp or send an email:',
      fName: 'Name *', fNeed: 'What do you need? *', fStage: 'Business stage *', fFound: 'How did you find JUNO?', fMsg: 'Tell us a bit more (in a few lines)', fSend: 'Send',
      optNeed: ['Visual identity', 'Social media design', 'Event key visual', 'Print materials', 'Website or landing page', 'Not sure yet, I want to talk'],
      optStage: ['Just getting started', 'Established and want to reposition', 'I have an event coming up', 'I want to sell more on social media'],
      optFound: ['Instagram', 'Referral', 'Google', 'Behance', 'Event', 'Other'],
      waIntro: 'Hi, JUNO! I found you through the website.',
      waLabels: { name: 'Name', need: 'I need', stage: 'Stage', found: 'Found JUNO through', msg: 'Message' },
      siteMap: 'Site map',
      place: 'São Raimundo Nonato, Piauí, Brazil', online: 'Online service across Brazil',
      tagline: 'Business administrator by training, designer by passion.',
      mailSubject: 'Project inquiry from the JUNO website',
      wa: {
        general: 'Hi, JUNO! I found you through the website and would like to talk about a project.',
        quote: 'Hi, JUNO! I found you through the website and would like a quote for my project.',
        combo: "Hi, JUNO! I found you through the website and I'm interested in the JUNO Start + Launch Kit bundle.",
        services: [
          'Hi, JUNO! I found you through the website and would like a quote for a visual identity for my brand.',
          'Hi, JUNO! I found you through the website and would like a quote for social media design (posts, stories and carousels).',
          'Hi, JUNO! I found you through the website and would like a quote for my event key visual.',
          'Hi, JUNO! I found you through the website and would like a quote for print materials.',
          'Hi, JUNO! I found you through the website and would like a quote for a website or landing page.'
        ]
      }
    }
  };
  var PROJ_IDS = ['euvaldo', 'thais', 'rbv', 'bnet'];

  var COVERS = [
    { src: 'assets/img/capas/euvaldo.webp', bg: '#111110' },
    { src: 'assets/img/projetos/thais/cartao.webp?v=2', bg: '#A3121D' },
    { src: 'assets/img/projetos/rbv/02.webp?v=2', bg: '#002D42' },
    { src: 'assets/img/capas/bnet.webp', bg: '#0A2540' }
  ];
  var STORY_LOGOS = [
    { src: 'assets/img/logos/santos-e-carvalho.svg', alt: 'Santos & Carvalho Advocacia e Consultoria Jurídica', h: 88 },
    { src: 'assets/img/logos/coronel-jose-dias.svg', alt: 'Prefeitura Municipal de Coronel José Dias', h: 80 },
    { src: 'assets/img/logos/rbv.svg', alt: 'RBV Consultoria, Assessoria e Planejamento', h: 72 }
  ];
  var CLIENTS = [
    { src: 'assets/img/clientes/clinica-vitalis.png', alt: 'Clínica Vitalis', w: 139, h: 89 },
    { src: 'assets/img/clientes/dr-victor-carvalho.png', alt: 'Dr. Victor Carvalho', w: 116, h: 62 },
    { src: 'assets/img/clientes/stefany-paes.png', alt: 'Stefany Paes Advocacia', w: 125, h: 83 },
    { src: 'assets/img/clientes/rbv.png', alt: 'RBV', w: 117, h: 36 },
    { src: 'assets/img/clientes/oxente-ze.png', alt: 'Oxente Zé Delivery', w: 78, h: 78 },
    { src: 'assets/img/clientes/maiso-veiculos.png', alt: 'Maiso Veículos', w: 84, h: 74 },
    { src: 'assets/img/clientes/lbr-arquitetura.png', alt: 'LBR Arquitetura', w: 131, h: 72 },
    { src: 'assets/img/clientes/essencia-da-serra.png', alt: 'Essência da Serra', w: 130, h: 73 },
    { src: 'assets/img/clientes/luke-fitness.png', alt: 'Luke Fitness', w: 128, h: 44 },
    { src: 'assets/img/clientes/coronel-jose-dias.png', alt: 'Prefeitura de Coronel José Dias', w: 131, h: 41 },
    { src: 'assets/img/clientes/bnet.png', alt: 'BNET', w: 123, h: 35 }
  ];

  var lang = JUNO.getLang();
  var t = DICT[lang];
  var si = 0;

  function $(id) { return document.getElementById(id); }

  function projCard(p, i) {
    var c = COVERS[i];
    return '<a class="card" href="/projetos#' + PROJ_IDS[i] + '" style="flex: 1 1 420px; min-width: 0">' +
      '<div class="cover-box" style="aspect-ratio: 16 / 10; background: ' + c.bg + '">' +
      '<img class="cover" src="' + c.src + '" alt="' + esc(p.alt) + '" loading="lazy">' +
      '<span class="arrow arrow-dot" aria-hidden="true">↗</span></div>' +
      '<span style="font-size: 14px; font-weight: 300; letter-spacing: 1px; color: var(--mute)">' + esc(p.tags) + '</span>' +
      '<span style="font-size: 28px; font-weight: 300; line-height: 1.15">' + esc(p.name) + '</span></a>';
  }

  function options(sel, list) {
    var cur = sel.selectedIndex;
    sel.innerHTML = list.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('');
    if (cur > 0) sel.selectedIndex = cur;
  }

  function renderStat() {
    var s = t.stats[si];
    $('statBig').textContent = s.big;
    $('statLabel').textContent = s.label;
    $('dots').querySelectorAll('.dot').forEach(function (d, i) { d.setAttribute('aria-pressed', i === si ? 'true' : 'false'); });
  }

  function render() {
    t = DICT[lang];
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    JUNO.applyText(t);
    JUNO.applyLinks(t);
    $('projRow1').innerHTML = t.proj.slice(0, 2).map(function (p, i) { return projCard(p, i); }).join('');
    $('projRow3').innerHTML = t.proj.slice(2, 4).map(function (p, i) { return projCard(p, i + 2); }).join('');
    $('stories').innerHTML = t.stories.map(function (text, i) {
      var l = STORY_LOGOS[i];
      return '<article style="flex: 1 1 300px; min-width: 0; display: flex; flex-direction: column; gap: 32px">' +
        '<div style="height: 88px; display: flex; align-items: center"><img class="logo" src="' + l.src + '" alt="' + esc(l.alt) + '" style="height: ' + l.h + 'px; width: auto; max-width: 100%; object-fit: contain; object-position: left center; display: block"></div>' +
        '<p style="margin: 0; font-size: 17px; font-weight: 400; line-height: 1.6; max-width: 34ch">' + esc(text) + '</p></article>';
    }).join('');
    $('dots').innerHTML = t.stats.map(function (s, i) {
      return '<button type="button" class="dot" data-i="' + i + '" aria-label="' + esc(s.short) + '" aria-pressed="false"><span></span></button>';
    }).join('');
    renderStat();
    $('services').innerHTML = t.services.map(function (s, i) {
      var link = i === 2 ? 'https://usejuno.com.br/kv-de-eventos" rel="noopener' : JUNO.wa(t.wa.services[i]) + '" target="_blank" rel="noopener';
      return '<a class="svc" href="' + link + '"><span style="flex: 0 0 48px; font-size: 14px; font-weight: 300; letter-spacing: 1px; color: var(--mute)">0' + (i + 1) + '</span>' +
        '<span style="flex: 1 1 320px; font-size: clamp(28px, 3vw, 40px); font-weight: 300; line-height: 1.1">' + esc(s.title) + '</span>' +
        '<span style="flex: 1 1 300px; font-size: 16px; font-weight: 300; line-height: 1.55; color: var(--body)">' + esc(s.text) + '</span></a>';
    }).join('');
    $('combo').innerHTML = t.comboGroups.map(function (g) {
      return '<div style="flex: 1 1 300px; min-width: 0"><p style="margin: 0 0 14px; font-size: 14px; font-weight: 400; letter-spacing: 1px; color: #9C958A">' + esc(g.title) + '</p>' +
        '<ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px">' +
        g.items.map(function (it) {
          return '<li style="display: flex; gap: 12px; align-items: flex-start; font-size: 16px; font-weight: 400; line-height: 1.45">' +
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#DBED17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: 0 0 16px; margin-top: 3px"><path d="M3 8.5l3 3 7-7"/></svg>' +
            '<span>' + esc(it) + '</span></li>';
        }).join('') + '</ul></div>';
    }).join('');
    options($('f-assunto'), t.optNeed);
    options($('f-momento'), t.optStage);
    options($('f-origem'), t.optFound);
  }

  function renderClients() {
    var all = CLIENTS.concat(CLIENTS);
    $('clients').innerHTML = all.map(function (c, i) {
      var dup = i >= CLIENTS.length;
      return '<img class="client" src="' + c.src + '" alt="' + (dup ? '' : esc(c.alt)) + '"' + (dup ? ' aria-hidden="true"' : '') +
        ' style="width: ' + c.w + 'px; height: ' + c.h + 'px; display: block; flex: 0 0 auto" loading="lazy">';
    }).join('');
  }

  /* texto digitando no título */
  var wi = 0, n = 0, del = false, hold = 0;
  function tick() {
    var words = t.words;
    var w = words[wi % words.length];
    if (hold > 0) { hold--; }
    else if (!del) { if (n < w.length) n++; else { del = true; hold = 26; } }
    else { if (n > 0) n--; else { del = false; wi = (wi + 1) % words.length; hold = 4; } }
    $('typed').textContent = words[wi % words.length].slice(0, n);
  }

  /* fundo escurece e clareia a cada dobra */
  function onScroll() {
    var page = $('page');
    var vh = window.innerHeight;
    var mid = vh * 0.5;
    var theme = 'dark';
    var els = document.querySelectorAll('[data-theme]');
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) theme = els[i].getAttribute('data-theme');
    }
    page.classList.add('live');
    page.classList.toggle('is-light', theme === 'light');
    page.classList.toggle('is-dark', theme !== 'light');
  }

  /* foto que segue o mouse */
  function onMove(e) {
    var el = $('float');
    if (!el) return;
    var r = el.getBoundingClientRect();
    var dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
    var dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
    el.style.transform = 'translate(' + (dx * 28).toFixed(1) + 'px, ' + (dy * 28).toFixed(1) + 'px) rotate(' + (dx * 3).toFixed(2) + 'deg)';
  }

  /* formulário: abre o WhatsApp com a mensagem pronta */
  function onSubmit(e) {
    e.preventDefault();
    var f = e.target;
    var L = t.waLabels;
    var lines = [t.waIntro, '',
      L.name + ': ' + f.nome.value,
      'WhatsApp: ' + f.whatsapp.value,
      L.need + ': ' + f.assunto.value,
      L.stage + ': ' + f.momento.value,
      L.found + ': ' + f.origem.value];
    if (f.mensagem.value.trim()) lines.push(L.msg + ': ' + f.mensagem.value.trim());
    window.open(JUNO.wa(lines.join('\n')), '_blank', 'noopener');
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();
    renderClients();
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { $('typed').textContent = t.words[0]; } else { setInterval(tick, 75); }
    setInterval(function () { si = (si + 1) % 4; renderStat(); }, 3600);
    $('dots').addEventListener('click', function (e) {
      var b = e.target.closest('.dot');
      if (b) { si = +b.getAttribute('data-i'); renderStat(); }
    });
    $('langbtn').addEventListener('click', function () {
      lang = lang === 'en' ? 'pt' : 'en';
      JUNO.setLang(lang);
      wi = 0; n = 0; del = false; hold = 4;
      render();
    });
    $('form').addEventListener('submit', onSubmit);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('mousemove', onMove);
    onScroll();
    JUNO.watchNav($('nav'), $('langbtn'));
    var v = $('hero-video');
    if (v) { v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  });
})();
