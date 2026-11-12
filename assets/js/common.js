/* JUNO Estúdio Criativo, utilidades compartilhadas */
(function () {
  var LOGO = '<svg viewBox="5100 8340 14570 3250" fill="currentColor" aria-hidden="true"><path d="M5144 10658c0,-6 5,-11 11,-11 196,-2 771,-2 1728,-1 110,0 184,-8 223,-25 87,-38 131,-117 131,-235 -1,-991 -1,-1629 -1,-1913 0,-34 1,-60 4,-76 1,-5 5,-8 9,-8l970 0c5,0 9,4 9,9l0 1346c0,11 -4,21 -12,29 -197,198 -403,404 -617,618 -216,215 -430,429 -644,641 -138,138 -239,228 -303,271 -227,154 -479,244 -762,244 -194,0 -437,1 -729,2 -10,0 -17,-8 -17,-17l0 -874z"/><path d="M9592 8396c2,-2 2,2 2,4 0,299 -1,960 0,1985 0,114 45,193 135,236 36,18 114,26 233,25 286,-2 541,-2 765,-1 54,0 122,2 172,-13 115,-34 172,-113 172,-237 0,-708 0,-1375 0,-2000 0,-5 4,-8 8,-8l971 0c4,0 8,4 8,8l0 1320c0,11 -5,22 -12,30 -699,697 -1183,1180 -1455,1449 -211,210 -468,351 -772,352 -166,1 -423,1 -770,0 -103,0 -194,-12 -271,-37 -267,-85 -462,-299 -527,-570 -15,-62 -22,-159 -21,-290 1,-136 1,-427 1,-871 0,-11 4,-21 12,-29l199 -199 0 1 1149 -1157z"/><path d="M15698 9625c64,-68 110,-115 136,-140 260,-252 516,-503 766,-753 125,-125 210,-200 255,-224 79,-43 162,-77 250,-100 49,-13 138,-19 267,-19 236,1 628,1 1173,0 175,0 298,8 370,25 339,81 602,336 685,677 19,77 27,205 24,382 -3,168 -3,372 -2,622 0,9 -3,22 -9,28 -383,379 -728,722 -1035,1030 -152,153 -246,240 -280,261 -87,54 -175,92 -263,115 -50,13 -145,20 -285,19 -656,-1 -996,-2 -1020,-1 -175,4 -300,-3 -378,-22 -313,-77 -560,-320 -634,-633 -18,-77 -27,-197 -26,-360 2,-310 2,-608 0,-894 0,-5 2,-10 5,-14zm2031 1021c267,0 424,0 472,-1 249,-4 428,-185 429,-435 0,-97 1,-398 0,-903 0,-4 -3,-7 -7,-7 -205,-1 -504,-1 -897,-1 -267,0 -424,0 -472,1 -249,4 -427,185 -429,435 0,97 -1,398 0,903 0,4 3,7 7,7 205,1 504,1 897,1z"/><path d="M14701 10616c-3,3 -8,1 -8,-3l0 -1304c0,-4 -3,-7 -7,-7 -9,-1 -22,-2 -39,-2 -563,0 -940,0 -1132,1 -103,0 -184,14 -264,70 -95,67 -142,164 -142,292 0,282 -1,907 -1,1875 0,6 -5,12 -12,12l-1012 0c-11,0 -19,-9 -19,-19l0 -1785c0,-8 3,-16 9,-22 600,-592 905,-893 915,-903 89,-92 162,-158 219,-198 161,-114 329,-189 517,-219 54,-9 143,-13 269,-13 476,1 735,1 776,0 159,-2 265,5 318,21 151,46 277,114 383,235 139,157 210,346 216,568 3,125 4,262 2,409 0,4 -2,9 -5,12l-982 982z"/><path d="M14694 11545l-949 0c-4,0 -6,-5 -3,-8l949 -911c3,-3 8,-1 8,4l0 911c0,3 -2,5 -5,5z"/></svg>';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function getLang() {
    try {
      var saved = localStorage.getItem('juno-lang');
      if (saved === 'pt' || saved === 'en') return saved;
    } catch (e) {}
    return 'pt';
  }

  function setLang(lang) {
    try { localStorage.setItem('juno-lang', lang); } catch (e) {}
  }

  function applyText(t) {
    document.querySelectorAll('[data-t]').forEach(function (el) {
      var v = t[el.getAttribute('data-t')];
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('[data-t-alt]').forEach(function (el) {
      var v = t[el.getAttribute('data-t-alt')];
      if (v !== undefined) el.setAttribute('alt', v);
    });
    document.querySelectorAll('[data-t-aria]').forEach(function (el) {
      var v = t[el.getAttribute('data-t-aria')];
      if (v !== undefined) el.setAttribute('aria-label', v);
    });
  }

  /* barra de navegação: clara sobre fundo escuro, escura sobre fundo claro */
  function watchNav(nav, btn) {
    function update() {
      var on = 'dark';
      var els = document.querySelectorAll('[data-theme]');
      for (var i = 0; i < els.length; i++) {
        var r = els[i].getBoundingClientRect();
        if (r.top <= 44 && r.bottom > 44) on = els[i].getAttribute('data-theme');
      }
      var cls = on === 'light' ? 'glass-dark' : 'glass-light';
      [nav, btn].forEach(function (el) {
        if (!el) return;
        el.classList.remove('glass-dark', 'glass-light');
        el.classList.add(cls);
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return update;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.juno-logo').forEach(function (el) { el.innerHTML = LOGO; });
    document.querySelectorAll('.year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  });

  /* links de WhatsApp e e-mail com mensagem pronta */
  var PHONE = '5589981453993';
  function wa(msg) { return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg); }
  function mail(subject) { return 'mailto:contato@usejuno.com.br?subject=' + encodeURIComponent(subject); }

  function applyLinks(t) {
    document.querySelectorAll('[data-wa]').forEach(function (a) {
      var msg = t.wa && t.wa[a.getAttribute('data-wa')];
      if (!msg) return;
      a.href = wa(msg);
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-mail]').forEach(function (a) { a.href = mail(t.mailSubject); });
  }

  window.JUNO = { esc: esc, getLang: getLang, setLang: setLang, applyText: applyText, watchNav: watchNav, wa: wa, mail: mail, applyLinks: applyLinks };
})();
