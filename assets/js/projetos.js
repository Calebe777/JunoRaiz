/* JUNO Estúdio Criativo, página de projetos */
(function () {
  var esc = JUNO.esc;

  var UI = {
      pt: {
        navWork: 'Projetos', navAbout: 'Sobre', navServices: 'Serviços', navCta: 'Fale com a gente',
        langBtn: 'EN', langAria: 'Ver o site em inglês',
        portfolio: 'Portfólio · 8 projetos', h1: 'Projetos',
        intro: 'Cada projeto começa entendendo o negócio. Clique em qualquer um pra ver o case completo, com todas as peças.',
        filterAria: 'Filtrar projetos', view: 'Ver projeto', open: 'Abrir projeto',
        ctaTitle: 'o próximo case pode ser o seu', ctaBtn: 'Pedir orçamento',
        postsLabel: 'Posts em destaque', tagline: 'Administrador por formação, designer por paixão.',
        deliv: 'Entregas', want: 'Quero um projeto assim', closeAria: 'Fechar projeto',
        behance: 'Ver mais no Behance', mailSubject: 'Projeto pelo site da JUNO',
        wa: {
          general: 'Olá, JUNO! Vim pelo site e quero conversar sobre um projeto.',
          quote: 'Olá, JUNO! Vim pelo site e gostaria de solicitar um orçamento para o meu projeto.',
          project: 'Olá, JUNO! Vi o projeto {p} no site e quero algo nessa linha para a minha marca.'
        },
        filters: { todos: 'Todos', identidade: 'Identidade Visual', eventos: 'Eventos', campanhas: 'Campanhas', social: 'Social Media' }
      },
      en: {
        navWork: 'Work', navAbout: 'About', navServices: 'Services', navCta: 'Get in touch',
        langBtn: 'PT', langAria: 'Ver o site em português',
        portfolio: 'Portfolio · 8 projects', h1: 'Projects',
        intro: 'Every project starts by understanding the business. Click any of them to see the full case, with every piece.',
        filterAria: 'Filter projects', view: 'View project', open: 'Open project',
        ctaTitle: 'the next case could be yours', ctaBtn: 'Request a quote',
        postsLabel: 'Featured posts', tagline: 'Business administrator by training, designer by passion.',
        deliv: 'Deliverables', want: 'I want a project like this', closeAria: 'Close project',
        behance: 'See more on Behance', mailSubject: 'Project inquiry from the JUNO website',
        wa: {
          general: 'Hi, JUNO! I found you through the website and would like to talk about a project.',
          quote: 'Hi, JUNO! I found you through the website and would like a quote for my project.',
          project: 'Hi, JUNO! I saw the {p} project on your website and would like something along those lines for my brand.'
        },
        filters: { todos: 'All', identidade: 'Visual Identity', eventos: 'Events', campanhas: 'Campaigns', social: 'Social Media' }
      }
    };
  var PROJECTS = [
      { id: 'conecta', name: 'Conecta Prev', cats: ['eventos'], bg: '#0B1F5C',
        pt: { client: 'Congresso de advocacia previdenciária', tags: 'KV de Evento • Cenografia • Materiais Impressos', lead: 'Aqui, a advocacia previdenciária acontece em alto nível.',
          body: ['O Conecta Prev reuniu advogados previdenciaristas num congresso com realização da OAB. O desafio era criar uma identidade forte o bastante pra ocupar palco, painéis, credenciais e espaços de convivência, sem perder a unidade.', 'Construímos o KV em azul profundo com destaques em vermelho e uma tipografia pesada que funciona de longe. Frases como “Sua conexão começa aqui!” transformaram a cenografia em ponto de encontro (e de foto), e o mesmo sistema se desdobrou do crachá ao palco principal.'],
          deliv: ['Key visual do evento', 'Palco e telas', 'Painéis e backdrop instagramável', 'Credenciais', 'Comunicação dos espaços'] },
        en: { client: 'Social security law congress', tags: 'Event Key Visual • Scenography • Print', lead: 'Where social security law happens at the highest level.',
          body: ['Conecta Prev brought social security lawyers together at a congress organized by the OAB, the Brazilian Bar Association. The challenge was to create an identity strong enough to fill the stage, panels, badges and lounge areas without losing unity.', 'We built the key visual in deep blue with red highlights and bold typography that reads from afar. Lines like “Your connection starts here!” turned the scenography into a meeting point (and a photo spot), and the same system unfolded from the badge to the main stage.'],
          deliv: ['Event key visual', 'Stage and screens', 'Panels and photo backdrop', 'Badges', 'Signage for each area'] },
        images: [
          { file: 'Conecta Prev R2- 0202.jpg', pt: 'Palco principal', en: 'Main stage' },
          { file: 'Conecta Prev R2- 0003.jpg', pt: 'Painel de boas-vindas', en: 'Welcome panel' },
          { file: 'Conecta Prev R2- 0201.jpg', pt: 'Painel “Sua conexão começa aqui!”', en: '“Your connection starts here!” panel' },
          { file: 'Instagrammable_photo_backdrop_wall_mockup_at_a_pro-1776852572184.png', pt: 'Backdrop instagramável', en: 'Photo backdrop' },
          { file: 'Professional_conference_stage_mockup_with_two_diff-1776851652094.png', pt: 'Estudo de palco', en: 'Stage study' },
          { file: 'Crachá Conecta Prev sobre concreto texturizado.png', pt: 'Credencial de congressista', en: 'Attendee badge' },
          { file: 'Conecta Prev R2- 0190.jpg', pt: 'Lounge de conversas', en: 'Conversation lounge' },
          { file: 'Conecta Prev R2- 0191.jpg', pt: 'Espaço OAB', en: 'OAB area' },
          { file: 'Conecta Prev R2- 0108.jpg', pt: 'Área de expositores', en: 'Exhibitor area' },
          { file: 'Conecta Prev R2- 0193.jpg', pt: 'Área de expositores', en: 'Exhibitor area' }
        ] },
      { id: 'euvaldo', name: 'Euvaldo Filho', cats: ['identidade', 'social'], bg: '#111110',
        pt: { client: 'Advocacia & Consultoria Jurídica', tags: 'Identidade Visual • Branding • Papelaria', lead: 'Tradição jurídica com linguagem contemporânea.',
          body: ['Escritórios de advocacia costumam cair em dois extremos: o tradicional demais ou o genérico. Pro Euvaldo Filho, a ideia era passar autoridade sem parecer distante.', 'O símbolo une as iniciais E e F à forma de uma coluna clássica, referência direta ao Direito, desenhada com linhas limpas. O dourado aparece na medida certa sobre o preto profundo, e o sistema se completa em cartão, papel timbrado, pasta e conteúdo pras redes.'],
          deliv: ['Logotipo e monograma', 'Cartão de visita', 'Papel timbrado', 'Pasta institucional', 'Posts para redes'] },
        en: { client: 'Law & Legal Consulting', tags: 'Visual Identity • Branding • Stationery', lead: 'Legal tradition in a contemporary language.',
          body: ['Law firms tend to fall into two extremes: too traditional or too generic. For Euvaldo Filho, the goal was to convey authority without feeling distant.', 'The symbol combines the initials E and F with the shape of a classical column, a direct reference to the law, drawn with clean lines. Gold appears in just the right amount over deep black, and the system comes together in business cards, letterhead, folder and social media content.'],
          deliv: ['Logo and monogram', 'Business card', 'Letterhead', 'Presentation folder', 'Social media posts'] },
        images: [
          { file: '01.png', pt: 'Assinatura principal', en: 'Main logo' },
          { file: '02.png', pt: 'Cartões de visita', en: 'Business cards' },
          { file: '03.png', pt: 'Papel timbrado', en: 'Letterhead' },
          { file: '04.png', pt: 'Pasta institucional', en: 'Presentation folder' }
        ] },
      { id: 'thais', name: 'Thaís Coelho', cats: ['identidade'], bg: '#A3121D',
        pt: { client: 'Nutrição & Emagrecimento Feminino', tags: 'Identidade Visual • Branding • Papelaria', lead: 'A borboleta é transformação, e é disso que o trabalho da Thaís trata.',
          body: ['A Thaís acompanha mulheres no processo de emagrecimento, e a marca precisava falar de mudança com delicadeza, sem cair no visual “dieta” de sempre.', 'Desenhamos uma borboleta a partir das iniciais TC e uma assinatura em script dourado sobre vermelho intenso. O resultado é feminino, acolhedor e marcante, e funciona tanto na placa do consultório quanto no cartão com QR code e nos brindes.'],
          deliv: ['Logotipo e símbolo', 'Cartão de visita com QR code', 'Placa de fachada', 'Brindes personalizados'] },
        en: { client: 'Nutrition & Women’s Weight Loss', tags: 'Visual Identity • Branding • Stationery', lead: 'The butterfly means transformation, and that is what Thaís’s work is about.',
          body: ['Thaís supports women through their weight loss journey, and the brand had to speak about change with delicacy, without falling into the usual “diet” look.', 'We drew a butterfly from the initials TC and a gold script signature over intense red. The result is feminine, welcoming and striking, and it works on the clinic sign as well as on the business card with QR code and the branded gifts.'],
          deliv: ['Logo and symbol', 'Business card with QR code', 'Storefront sign', 'Branded gifts'] },
        images: [
          { file: 'thais 02.png', pt: 'Assinatura principal', en: 'Main logo' },
          { file: 'MOKCUP_CARTÃO_DE_VISITA.png', pt: 'Cartões de visita', en: 'Business cards' },
          { file: 'MOCKUP_PLACA_LATERAL.png', pt: 'Placa de fachada', en: 'Storefront sign' },
          { file: 'MOCKUP_XICARAS.png', pt: 'Xícaras personalizadas', en: 'Branded cups' }
        ] },
      { id: 'rbv', name: 'RBV', cats: ['identidade'], bg: '#002D42',
        pt: { client: 'Consultoria, Assessoria e Planejamento', tags: 'Identidade Visual • Branding • Papelaria', lead: 'Uma marca pra quem ajuda outros negócios a decidir.',
          body: ['Consultoria vende confiança antes de vender serviço. A RBV precisava de uma identidade que passasse segurança e, ao mesmo tempo, mostrasse que é uma empresa atual.', 'O símbolo nasce das iniciais em formas geométricas com cortes precisos, que remetem a estrutura e direção. A paleta em azul petróleo e verde-azulado foge do “azul corporativo” óbvio, e o creme aquece as aplicações, do cartão à papelaria em relevo.'],
          deliv: ['Logotipo e símbolo', 'Paleta e tipografia', 'Cartão de visita', 'Papelaria'] },
        en: { client: 'Consulting, Advisory and Planning', tags: 'Visual Identity • Branding • Stationery', lead: 'A brand for those who help other businesses decide.',
          body: ['Consulting sells trust before it sells a service. RBV needed an identity that conveyed confidence while showing it is a modern company.', 'The symbol is built from the initials in geometric shapes with precise cuts that suggest structure and direction. The petrol blue and teal palette avoids the obvious “corporate blue”, and the cream tone warms up the applications, from business cards to embossed stationery.'],
          deliv: ['Logo and symbol', 'Color palette and typography', 'Business card', 'Stationery'] },
        images: [
          { file: '001 RBV 01.png', pt: 'Assinatura principal', en: 'Main logo' },
          { file: '02.png', pt: 'Cartões de visita', en: 'Business cards' },
          { file: '03.png', pt: 'Paleta de cores', en: 'Color palette' },
          { file: '04.png', pt: 'Aplicação em relevo', en: 'Embossed application' }
        ] },
      { id: 'avelar', name: 'Avelar Ferreira', cats: ['campanhas'], bg: '#0E9F3E',
        pt: { client: 'Campanha para Deputado Estadual', tags: 'Identidade de Campanha • Materiais Impressos • Comunicação Visual', lead: 'Por todo o Piauí.',
          body: ['Campanha pede uma identidade que funcione em qualquer escala, do adesivo de carro ao pórtico de evento, e que seja reconhecida em segundos no meio de muita poluição visual.', 'Montamos o sistema em verde e amarelo, com tipografia pesada e o mapa do Piauí integrado à assinatura. Nome e número ganham leitura imediata em todas as peças, das bandeiras aos panfletos.'],
          deliv: ['Assinatura de campanha', 'Panfletos e santinhos', 'Bandeiras e wind banners', 'Adesivo de carro', 'Crachás e papelaria', 'Pórtico'] },
        en: { client: 'State Representative campaign', tags: 'Campaign Identity • Print • Visual Communication', lead: 'All across Piauí.',
          body: ['A campaign needs an identity that works at any scale, from car stickers to event arches, and is recognized in seconds amid a lot of visual noise.', 'We built the system in green and yellow, with heavy typography and the map of Piauí integrated into the logo. Name and number read instantly on every piece, from flags to flyers.'],
          deliv: ['Campaign logo', 'Flyers and handouts', 'Flags and wind banners', 'Car sticker', 'Badges and stationery', 'Event arch'] },
        images: [
          { file: '01-AVELAR.png', pt: 'Assinatura de campanha', en: 'Campaign logo' },
          { file: 'Panfletos de campanha em verde e amarelo.png', pt: 'Panfletos', en: 'Flyers' },
          { file: 'MOCKUP DA BANDEIRA.png', pt: 'Wind banners', en: 'Wind banners' },
          { file: 'MOCKUP - BANDEIRA PEQUENA.png', pt: 'Bandeira', en: 'Flag' },
          { file: 'mockup - adesivo de carro.png', pt: 'Adesivo de carro', en: 'Car sticker' },
          { file: 'crachá - avelar (mockup).png', pt: 'Crachá de equipe', en: 'Team badge' },
          { file: 'mockup - carta.png', pt: 'Carta', en: 'Letter' },
          { file: 'Pórtico de Campanha Colorido em Estúdio.png', pt: 'Pórtico', en: 'Event arch' }
        ] },
      { id: 'bnet', name: 'BNET', cats: ['identidade'], bg: '#0A2540',
        pt: { client: 'Tecnologia e conectividade', tags: 'Identidade Visual • Branding • Digital', lead: 'A conexão dentro da própria letra.',
          body: ['A BNET precisava de uma marca com cara de tecnologia, mas simples de reconhecer em qualquer tamanho, do site à tela de um relógio.', 'O B ganhou um globo em rede dentro do desenho: a ideia de conexão literalmente dentro da letra. Vermelho e azul-marinho garantem contraste e energia, e o sistema foi testado em site, peças digitais e aplicações em tela.'],
          deliv: ['Logotipo e símbolo', 'Versões e reduções', 'Aplicações digitais', 'Direção visual para web'] },
        en: { client: 'Technology and connectivity', tags: 'Visual Identity • Branding • Digital', lead: 'Connection inside the letter itself.',
          body: ['BNET needed a brand that felt like technology but was simple to recognize at any size, from the website to a smartwatch screen.', 'The B gained a networked globe inside its shape: the idea of connection literally inside the letter. Red and navy blue bring contrast and energy, and the system was tested on the website, digital pieces and screen applications.'],
          deliv: ['Logo and symbol', 'Versions and small sizes', 'Digital applications', 'Web visual direction'] },
        images: [
          { file: '01BNET.png', pt: 'Assinatura principal', en: 'Main logo' },
          { file: 'LOGO APLICATION.png', pt: 'Sistema de aplicações', en: 'Applications' },
          { file: 'Logo BNET Gravado em Pedra.png', pt: 'Assinatura em textura', en: 'Logo on texture' }
        ] },
      { id: 'santos', name: 'Santos & Carvalho', cats: ['identidade', 'social'], bg: '#5A4636',
        pt: { client: 'Advocacia e Consultoria Jurídica', tags: 'Identidade Visual • Uniformes • Papelaria', lead: 'Elegância que também se veste.',
          body: ['Pra Santos & Carvalho, o objetivo era uma marca jurídica refinada, mas mais calorosa e próxima do que o preto e dourado de sempre.', 'O monograma entrelaça S e C numa composição serifada e clássica. A paleta em marrom café e off-white cria personalidade própria e funciona no cartão, nos uniformes da equipe e no conteúdo das redes.'],
          deliv: ['Logotipo e monograma', 'Cartão de visita', 'Bonés e camisetas', 'Posts para redes'] },
        en: { client: 'Law and Legal Consulting', tags: 'Visual Identity • Uniforms • Stationery', lead: 'Elegance you can also wear.',
          body: ['For Santos & Carvalho, the goal was a refined legal brand, but warmer and closer than the usual black and gold.', 'The monogram intertwines S and C in a classic serif composition. The coffee brown and off-white palette creates its own personality and works on business cards, team uniforms and social media content.'],
          deliv: ['Logo and monogram', 'Business card', 'Caps and t-shirts', 'Social media posts'] },
        images: [
          { file: '01-santos.png', pt: 'Assinatura principal', en: 'Main logo' },
          { file: 'santos e carvalho - cartão.png', pt: 'Cartões de visita', en: 'Business cards' },
          { file: '02-santos.jpg', pt: 'Bonés e camisetas', en: 'Caps and t-shirts' }
        ] },
      { id: 'mavi', name: 'Mavi Criativos', cats: ['identidade'], bg: '#F6A800',
        pt: { client: 'Marca criativa', tags: 'Identidade Visual • Branding • Aplicações', lead: 'Uma marca solar, feita com afeto.',
          body: ['A Mavi Criativos precisava de uma identidade alegre e afetiva, que encantasse logo no primeiro contato com o produto.', 'Corações entrelaçados formam o símbolo, a tipografia tem curvas generosas e o amarelo-ouro deixa tudo mais vivo. A marca foi pensada pra brilhar onde o cliente encontra o produto: etiqueta, tag, boné e embalagem.'],
          deliv: ['Logotipo e símbolo', 'Paleta de cores', 'Etiquetas e tags', 'Aplicações em produto'] },
        en: { client: 'Creative brand', tags: 'Visual Identity • Branding • Applications', lead: 'A sunny brand, made with care.',
          body: ['Mavi Criativos needed a cheerful, warm identity that would win people over at first contact with the product.', 'Intertwined hearts form the symbol, the typography has generous curves and the golden yellow brings everything to life. The brand was designed to shine where customers meet the product: labels, tags, caps and packaging.'],
          deliv: ['Logo and symbol', 'Color palette', 'Labels and tags', 'Product applications'] },
        images: [
          { file: '01MAVI.png', pt: 'Assinatura principal', en: 'Main logo' },
          { file: 'Painel Editorial da Mavi Criativos.png', pt: 'Painel de aplicações', en: 'Applications board' }
        ] },
    ];
  var POSTS = [
      { src: 'assets/img/posts/uniasselvi.webp', pt: 'Post da campanha de matrículas', en: 'Enrollment campaign post' },
      { src: 'assets/img/posts/angical-72-anos.webp', pt: 'Post do aniversário de 72 anos de Angical do Piauí', en: '72nd anniversary of Angical do Piauí post' },
      { src: 'assets/img/posts/euvaldo-defesa.webp', pt: 'Post jurídico para Euvaldo Filho', en: 'Legal post for Euvaldo Filho' },
      { src: 'assets/img/posts/santos-marina.webp', pt: 'Post de apresentação para Santos & Carvalho', en: 'Introduction post for Santos & Carvalho' },
      { src: 'assets/img/posts/conteudo-feed.webp', pt: 'Post criativo para o feed', en: 'Creative feed post' }
    ];
  var SRCS = {
      'posts/ANIVERSÁRIO ANGICAL DO PIAUÍ.png': 'assets/img/posts/angical-72-anos.webp',
      'posts/CRIATIVO - UNIASSELVI MEC FEED.png': 'assets/img/posts/uniasselvi.webp',
      'posts/EUVALDO FILHO - defesa.png': 'assets/img/posts/euvaldo-defesa.webp',
      'posts/SANTOS-&-CARVALHO---QUEM-SOU-EU-(MARINA)_01.png': 'assets/img/posts/santos-marina.webp',
      'posts/conteudo feed.png': 'assets/img/posts/conteudo-feed.webp',
      'rbv/001 RBV 01.png': 'assets/img/projetos/rbv/01.webp',
      'rbv/02.png': 'assets/img/projetos/rbv/02.webp',
      'rbv/03.png': 'assets/img/projetos/rbv/03.webp',
      'rbv/04.png': 'assets/img/projetos/rbv/04.webp',
      'euvaldo/01.png': 'assets/img/projetos/euvaldo/01.webp',
      'euvaldo/02.png': 'assets/img/projetos/euvaldo/02.webp',
      'euvaldo/03.png': 'assets/img/projetos/euvaldo/03.webp',
      'euvaldo/04.png': 'assets/img/projetos/euvaldo/04.webp',
      'euvaldo/EUVALDO FILHO - defesa.png': 'assets/img/posts/euvaldo-defesa.webp',
      'thais/MOCKUP_PLACA_LATERAL.png': 'assets/img/projetos/thais/placa.webp',
      'thais/MOCKUP_XICARAS.png': 'assets/img/projetos/thais/xicaras.webp',
      'thais/MOKCUP_CARTÃO_DE_VISITA.png': 'assets/img/projetos/thais/cartao.webp',
      'thais/thais 02.png': 'assets/img/projetos/thais/logo.webp',
      'avelar/01-AVELAR.png': 'assets/img/projetos/avelar/logo.webp',
      'avelar/MOCKUP - BANDEIRA PEQUENA.png': 'assets/img/projetos/avelar/bandeira.webp',
      'avelar/MOCKUP DA BANDEIRA.png': 'assets/img/projetos/avelar/wind-banners.webp',
      'avelar/Panfletos de campanha em verde e amarelo.png': 'assets/img/projetos/avelar/panfletos.webp',
      'avelar/Pórtico de Campanha Colorido em Estúdio.png': 'assets/img/projetos/avelar/portico.webp',
      'avelar/crachá - avelar (mockup).png': 'assets/img/projetos/avelar/cracha.webp',
      'avelar/mockup - adesivo de carro.png': 'assets/img/projetos/avelar/adesivo.webp',
      'avelar/mockup - carta.png': 'assets/img/projetos/avelar/carta.webp',
      'conecta/Conecta Prev R2- 0003.jpg': 'assets/img/projetos/conecta-prev/boas-vindas.webp',
      'conecta/Conecta Prev R2- 0108.jpg': 'assets/img/projetos/conecta-prev/expositores-1.webp',
      'conecta/Conecta Prev R2- 0190.jpg': 'assets/img/projetos/conecta-prev/lounge.webp',
      'conecta/Conecta Prev R2- 0191.jpg': 'assets/img/projetos/conecta-prev/espaco-oab.webp',
      'conecta/Conecta Prev R2- 0193.jpg': 'assets/img/projetos/conecta-prev/expositores-2.webp',
      'conecta/Conecta Prev R2- 0201.jpg': 'assets/img/projetos/conecta-prev/painel-conexao.webp',
      'conecta/Conecta Prev R2- 0202.jpg': 'assets/img/projetos/conecta-prev/palco.webp',
      'conecta/Crachá Conecta Prev sobre concreto texturizado.png': 'assets/img/projetos/conecta-prev/cracha.webp',
      'conecta/Instagrammable_photo_backdrop_wall_mockup_at_a_pro-1776852572184.png': 'assets/img/projetos/conecta-prev/backdrop.webp',
      'conecta/Professional_conference_stage_mockup_with_two_diff-1776851652094.png': 'assets/img/projetos/conecta-prev/estudo-palco.webp',
      'santos/01-santos.png': 'assets/img/projetos/santos-e-carvalho/logo.webp',
      'santos/02-santos.jpg': 'assets/img/projetos/santos-e-carvalho/uniformes.webp',
      'santos/santos e carvalho - cartão.png': 'assets/img/projetos/santos-e-carvalho/cartao.webp',
      'santos/SANTOS-&-CARVALHO---QUEM-SOU-EU-(MARINA)_01.png': 'assets/img/posts/santos-marina.webp',
      'mavi/01MAVI.png': 'assets/img/projetos/mavi/logo.webp',
      'mavi/Painel Editorial da Mavi Criativos.png': 'assets/img/projetos/mavi/painel.webp',
      'bnet/01BNET.png': 'assets/img/capas/bnet.webp',
      'bnet/LOGO APLICATION.png': 'assets/img/projetos/bnet/aplicacoes.webp',
      'bnet/Logo BNET Gravado em Pedra.png': 'assets/img/projetos/bnet/pedra.webp'
    };

  var lang = JUNO.getLang();
  var t = UI[lang];
  var open = -1;
  var lastFocus = null;

  function $(id) { return document.getElementById(id); }
  function nameOf(p) { return p[lang].name || p.name; }
  function src(p, file) { return SRCS[p.id + '/' + file] || ''; }

  function renderPosts() {
    var all = POSTS.concat(POSTS);
    $('posts').innerHTML = all.map(function (po, i) {
      var dup = i >= POSTS.length;
      return '<img src="' + po.src + '" alt="' + (dup ? '' : esc(po[lang])) + '"' + (dup ? ' aria-hidden="true"' : '') + ' loading="lazy">';
    }).join('');
  }

  function renderGrid() {
    $('grid').innerHTML = PROJECTS.map(function (p, i) {
      return '<button type="button" class="pcard" data-i="' + i + '" aria-label="' + esc(t.open + ' ' + nameOf(p)) + '">' +
        '<div class="pcover" style="background: ' + p.bg + '">' +
        '<img src="' + src(p, p.images[0].file) + '" alt="" loading="lazy">' +
        '<span class="pview"><span style="font-size: 13px; font-weight: 300; letter-spacing: 1px; color: #E0F11F">' + esc(p[lang].tags) + '</span>' +
        '<span style="display: flex; justify-content: space-between; align-items: center; gap: 16px; font-size: 26px; font-weight: 500; color: #F0F0F0">' + esc(nameOf(p)) + ' <span aria-hidden="true" style="font-size: 22px">↗</span></span></span>' +
        '</div></button>';
    }).join('');
  }

  function renderSheet() {
    if (open < 0) return;
    var p = PROJECTS[open];
    var c = p[lang];
    var prev = PROJECTS[(open - 1 + PROJECTS.length) % PROJECTS.length];
    var next = PROJECTS[(open + 1) % PROJECTS.length];
    $('overlay').setAttribute('aria-label', nameOf(p));
    $('sheet').innerHTML =
      '<header style="padding: clamp(32px, 5vw, 64px)">' +
      '<p style="margin: 0 0 20px; font-size: 14px; font-weight: 300; letter-spacing: 1px; color: #5E5850">' + esc(c.tags) + '</p>' +
      '<h2 style="margin: 0; font-weight: 900; font-size: clamp(44px, 7vw, 96px); line-height: .92; letter-spacing: -0.035em">' + esc(nameOf(p)) + '</h2>' +
      '<p style="margin: 14px 0 0; font-size: 18px; font-weight: 400; color: #3F3B35">' + esc(c.client) + '</p>' +
      '<p style="margin: clamp(32px, 4vw, 48px) 0 0; font-size: clamp(26px, 3vw, 40px); font-weight: 500; line-height: 1.12; max-width: 24ch">' + esc(c.lead) + '</p>' +
      '<div style="display: flex; flex-wrap: wrap; gap: 40px clamp(32px, 5vw, 72px); margin-top: clamp(32px, 4vw, 48px); padding-top: 32px; border-top: 1px solid rgba(15,15,13,.18)">' +
      '<div style="flex: 2 1 420px; min-width: 0; display: flex; flex-direction: column; gap: 18px">' +
      c.body.map(function (b) { return '<p style="margin: 0; font-size: 17px; font-weight: 400; line-height: 1.65; color: #3F3B35">' + esc(b) + '</p>'; }).join('') +
      '</div><div style="flex: 1 1 220px; min-width: 0"><p style="margin: 0 0 14px; font-size: 14px; font-weight: 700; letter-spacing: 1px; color: #5E5850">' + esc(t.deliv) + '</p>' +
      '<ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column">' +
      c.deliv.map(function (d) { return '<li style="padding: 10px 0; border-bottom: 1px solid rgba(15,15,13,.14); font-size: 16px; font-weight: 500">' + esc(d) + '</li>'; }).join('') +
      '</ul></div></div></header>' +
      '<div style="display: flex; flex-direction: column; gap: 4px; background: #121212">' +
      p.images.map(function (im) {
        return '<figure style="margin: 0; position: relative"><img src="' + src(p, im.file) + '" alt="' + esc(im[lang]) + '" loading="lazy" style="display: block; width: 100%; height: auto">' +
          '<figcaption style="position: absolute; left: 16px; bottom: 16px; font-size: 12px; font-weight: 400; padding: 6px 12px; border-radius: 999px; background: rgba(15,15,13,.72); color: #F0F0F0">' + esc(im[lang]) + '</figcaption></figure>';
      }).join('') +
      '</div><footer style="padding: clamp(32px, 5vw, 56px); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px">' +
      '<button type="button" class="mbtn" data-go="-1">← ' + esc(nameOf(prev)) + '</button>' +
      '<a href="' + JUNO.wa(t.wa.project.replace('{p}', nameOf(p))) + '" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 24px; border-radius: 999px; background: #121212; color: #F0F0F0; text-decoration: none; font-weight: 400; font-size: 15px">' + esc(t.want) + '</a>' +
      '<button type="button" class="mbtn" data-go="1">' + esc(nameOf(next)) + ' →</button></footer>';
  }

  function openProject(i) {
    lastFocus = document.activeElement;
    open = i;
    renderSheet();
    $('overlay').hidden = false;
    $('overlay').scrollTop = 0;
    document.body.classList.add('modal-open');
    $('closebtn').focus();
  }

  function closeProject() {
    open = -1;
    $('overlay').hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus();
  }

  function render() {
    t = UI[lang];
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    JUNO.applyText(t);
    JUNO.applyLinks(t);
    renderPosts();
    renderGrid();
    renderSheet();
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();
    $('grid').addEventListener('click', function (e) {
      var b = e.target.closest('.pcard');
      if (b) openProject(+b.getAttribute('data-i'));
    });
    $('overlay').addEventListener('click', function (e) {
      var go = e.target.closest('[data-go]');
      if (go) {
        open = (open + (+go.getAttribute('data-go')) + PROJECTS.length) % PROJECTS.length;
        renderSheet();
        $('overlay').scrollTop = 0;
        return;
      }
      if (!e.target.closest('#sheet')) closeProject();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open >= 0) closeProject();
    });
    $('langbtn').addEventListener('click', function () {
      lang = lang === 'en' ? 'pt' : 'en';
      JUNO.setLang(lang);
      render();
    });
    JUNO.watchNav($('nav'), $('langbtn'));
    /* abre o case direto quando o link vem da home (ex.: projetos.html#rbv) */
    function openFromHash() {
      var id = (location.hash || '').replace('#', '');
      if (!id) return;
      for (var i = 0; i < PROJECTS.length; i++) {
        if (PROJECTS[i].id === id) { openProject(i); break; }
      }
    }
    window.addEventListener('hashchange', openFromHash);
    openFromHash();
  });
})();
