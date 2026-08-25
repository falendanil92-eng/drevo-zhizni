'use client';

import { useEffect, useRef, useState } from 'react';

type Language = 'ru' | 'en';

const panelFacts = {
  ru: [
    'Мы создаём символ Нового Мира — живого и животворящего.',
    'Формула Творения проекта — многомерность.',
    'Обращаемся к высокохудожественной традиционной технике узорочья.',
    'Используем древнейший русский приём вышивки — сажение по бели.',
    'Размер панно — 3 × 3 метра.',
    'Проработка эскизов и образцов элементов — 3 месяца.',
    'Четыре мастера работают над панно один год.',
    'Натуральный лён и 3 500 метров перевитого вручную хлопкового шнура.',
    '7 кг жемчуга и бусин из натурального камня.',
    '500 000 стежков.',
  ],
  en: [
    'We are creating a symbol of a new world — alive and life-giving.',
    'The project’s creative formula is multidimensionality.',
    'We turn to the highly artistic Russian tradition of decorative ornament.',
    'We use the ancient Russian embroidery technique known as sazhene po beli.',
    'The panel measures 3 × 3 metres.',
    'Sketch development and element samples take three months.',
    'Four artisans work on the panel for one year.',
    'Natural linen and 3,500 metres of hand-twisted cotton cord.',
    '7 kg of pearls and natural-stone beads.',
    '500,000 stitches.',
  ],
};

const resources = [
  'СОЛНЦЕ',
  'СОЛНЦЕ.КУЛЬТУРА',
  'СОЛНЦЕ.ЖИВОЕ ДЕЛО',
  'СОЛНЦЕ.ЖИВАЯ ПЛАНЕТА',
  'СОЛНЦЕ.СОТВОРЕНИЕ',
  'СОЛНЦЕ.РУССКИЙ ОБЛИК',
];

function RussiaMapCanvas({ language }: { language: Language }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tree = new Image();
    const basePath = window.location.pathname.startsWith('/drevo-zhizni') ? '/drevo-zhizni' : '';
    tree.src = `${basePath}/assets/tree-mark-ring.png`;

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);

      const context = canvas.getContext('2d');
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      const sx = width / 1000;
      const sy = height / 520;
      const points: Array<[number, number]> = [
        [72, 265], [90, 220], [132, 205], [145, 162], [193, 155], [215, 125],
        [260, 144], [296, 122], [337, 155], [374, 146], [415, 175], [455, 153],
        [492, 182], [530, 162], [565, 190], [610, 170], [650, 190], [686, 168],
        [731, 194], [770, 181], [810, 205], [845, 196], [878, 226], [920, 230],
        [908, 267], [935, 300], [906, 324], [918, 367], [872, 358], [843, 386],
        [791, 373], [755, 402], [704, 388], [659, 420], [610, 402], [563, 430],
        [518, 408], [467, 432], [421, 404], [372, 418], [333, 389], [283, 402],
        [244, 371], [196, 385], [174, 347], [126, 352], [117, 318], [82, 306],
      ];

      context.beginPath();
      points.forEach(([x, y], index) => {
        const px = x * sx;
        const py = y * sy;
        if (index === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      });
      context.closePath();

      const gold = context.createLinearGradient(0, 0, width, height);
      gold.addColorStop(0, '#a57545');
      gold.addColorStop(0.42, '#e0b652');
      gold.addColorStop(0.72, '#c6984b');
      gold.addColorStop(1, '#a57545');
      context.fillStyle = gold;
      context.fill();
      context.strokeStyle = '#161616';
      context.lineWidth = Math.max(2, width / 420);
      context.lineJoin = 'round';
      context.stroke();

      const markers = [
        { x: 218, y: 283, ru: 'Москва', en: 'Moscow' },
        { x: 177, y: 218, ru: 'Санкт-Петербург', en: 'Saint Petersburg' },
        { x: 438, y: 318, ru: 'Тюмень', en: 'Tyumen' },
        { x: 543, y: 372, ru: 'Алтай', en: 'Altai' },
      ];
      const iconSize = Math.max(34, Math.min(58, width / 16));

      markers.forEach((marker) => {
        const x = marker.x * sx;
        const y = marker.y * sy;
        if (tree.complete && tree.naturalWidth) {
          context.drawImage(tree, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
        }
        context.fillStyle = '#161616';
        context.font = `600 ${Math.max(11, Math.min(14, width / 70))}px "Nunito Sans", sans-serif`;
        context.textAlign = 'center';
        context.fillText(language === 'ru' ? marker.ru : marker.en, x, y + iconSize / 2 + 18);
      });
    };

    tree.onload = draw;
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    draw();
    return () => observer.disconnect();
  }, [language]);

  return (
    <canvas
      ref={canvasRef}
      className="russia-map-canvas"
      role="img"
      aria-label={language === 'ru' ? 'Карта России: Москва, Санкт-Петербург, Тюмень и Алтай' : 'Map of Russia: Moscow, Saint Petersburg, Tyumen and Altai'}
    />
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('ru');
  const [menuOpen, setMenuOpen] = useState(false);
  const ru = language === 'ru';

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={ru ? 'Солнце.Культура — на главную' : 'Solntse.Culture — home'}>
          <span>СОЛНЦЕ.</span><strong>КУЛЬТУРА</strong>
        </a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="main-navigation">
          {ru ? 'Меню' : 'Menu'}
        </button>
        <nav id="main-navigation" className={menuOpen ? 'is-open' : ''} aria-label={ru ? 'Основная навигация' : 'Main navigation'}>
          <a href="#top" onClick={closeMenu}>{ru ? 'Главная' : 'Home'}</a>
          <a href="#idea" onClick={closeMenu}>{ru ? 'Живой мир' : 'Living world'}</a>
          <a href="#project" onClick={closeMenu}>{ru ? 'Проект' : 'Project'}</a>
          <a href="#panel" onClick={closeMenu}>{ru ? 'О панно' : 'The panel'}</a>
          <a href="#geography" onClick={closeMenu}>{ru ? 'Мы в России' : 'In Russia'}</a>
          <a href="#contacts" onClick={closeMenu}>{ru ? 'Контакты' : 'Contacts'}</a>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label={ru ? 'Выбор языка' : 'Choose language'}>
            <button type="button" className={ru ? 'active' : ''} onClick={() => setLanguage('ru')} aria-pressed={ru}>RU</button>
            <span aria-hidden="true">/</span>
            <button type="button" className={!ru ? 'active' : ''} onClick={() => setLanguage('en')} aria-pressed={!ru}>EN</button>
          </div>
          <a className="header-contact" href="tel:+79151643278">{ru ? 'Связаться' : 'Contact'}</a>
        </div>
      </header>

      <section className="site-section hero" id="top">
        <div className="hero-intro">
          <p className="eyebrow">{ru ? 'Культурный проект «Солнце.Культура»' : 'A Solntse.Culture project'}</p>
          <h1>{ru ? 'Древо жизни' : 'The Tree of Life'}</h1>
          <p className="hero-quote">{ru ? '«С севера пришли они, отважные мужчины и женщины, образующие сильный Народ, продолжающие следовать путём Духа, Души, Сознания, Крови, Совести, Воли и Сокровенной Истины».' : '“They came from the North, courageous men and women forming a strong people, continuing along the path of Spirit, Soul, Consciousness, Blood, Conscience, Will and Innermost Truth.”'}</p>
        </div>
        <figure className="tree-figure">
          <img src="./assets/hero-tree-v2.png" alt={ru ? 'Авторская иллюстрация Древа жизни с двумя оленями' : 'Original illustration of the Tree of Life with two deer'} />
        </figure>
      </section>

      <section className="site-section idea-section" id="idea">
        <article className="narrative-block">
          <h2 className="section-title">{ru ? 'Живой мир' : 'Living world'}</h2>
          <p className="lead">{ru ? 'Мир находится в точке выбора дальнейшего пути: пути жизни или пути вымирания.' : 'The world has reached a point of choice: the path of life or the path of extinction.'}</p>
          <p>{ru ? 'Первое, что проявляет этот выбор в Мир и формирует импульс и путь его реализации, — это Культура.' : 'Culture is the first force that expresses this choice and shapes the impulse and the path of its realisation.'}</p>
          <p>{ru ? 'Проект «СОЛНЦЕ.КУЛЬТУРА» выбирает путь жизни: помогает раскрыть Творца в Человеке, проявить Культурный Код, сформировать Культурное Поле жизни и жизнетворения, укрепить Национальную Идентичность Народа и Культурный Суверенитет Родины.' : 'SOLNTSE.CULTURE chooses the path of life: it helps reveal the creator within each person, express a cultural code, form a life-giving cultural field and strengthen national identity and cultural sovereignty.'}</p>
          <p className="statement">{ru ? 'Мы предлагаем творческий объект «ДРЕВО ЖИЗНИ» как символ для всех, кто выбирает путь жизни и жизнетворения.' : 'We offer THE TREE OF LIFE as a creative symbol for everyone who chooses life and creation.'}</p>
        </article>
      </section>

      <section className="site-section project-section" id="project">
        <div className="project-copy">
          <p className="eyebrow">{ru ? 'Монументальное панно' : 'Monumental panel'}</p>
          <h2 className="section-title">{ru ? 'Проект «Древо жизни»' : 'The Tree of Life project'}</h2>
          <p>{ru ? '«ДРЕВО ЖИЗНИ» представлено в формате монументального панно. Его основной смысл — наше волеизъявление в выборе жизни и жизнетворения.' : 'THE TREE OF LIFE is conceived as a monumental panel. Its central meaning is our conscious choice of life and life-giving creation.'}</p>
        </div>
        <figure className="panel-fragment">
          <img src="./assets/panel-detail.png" alt={ru ? 'Фрагмент панно с жемчужной вышивкой' : 'Detail of the pearl-embroidered panel'} />
          <figcaption>{ru ? 'Фрагмент панно в процессе создания' : 'A fragment of the panel in progress'}</figcaption>
        </figure>
      </section>

      <section className="site-section technique-section">
        <article className="narrative-block technique-copy">
          <h2 className="section-title">{ru ? 'Сажение по бели' : 'Sazhene po beli'}</h2>
          <p>{ru ? 'В Европе и Азии рельефное жемчужное шитьё было привилегией знати и высшего духовенства. На Руси сложилась иная традиция.' : 'Across Europe and Asia, raised pearl embroidery was reserved for nobility and senior clergy. In Rus, a different tradition emerged.'}</p>
          <div className="numbered-copy">
            <p><span>01</span>{ru ? 'Реки Русского Севера были естественным ареалом пресноводной жемчужницы. Добыча речного жемчуга стала промыслом, доступным местному населению.' : 'The rivers of the Russian North were a natural habitat for freshwater pearl mussels, making river pearls available to local communities.'}</p>
            <p><span>02</span>{ru ? 'До начала XVIII века не существовало строгой государственной монополии на ношение жемчуга. Техника вошла во все слои общества и стала общенациональным Культурным Кодом.' : 'Until the early eighteenth century there was no strict state monopoly on wearing pearls. The technique spread throughout society and became a national cultural code.'}</p>
          </div>
          <p>{ru ? 'Прокладывая льняной шнур и покрывая его жемчугом, мастерица структурировала хаос, создавая защитный сакральный контур для себя, своего рода, народа и Родины. Она плела узор будущего.' : 'By laying linen cord and covering it with pearls, the artisan shaped chaos into a protective sacred contour for herself, her family, her people and her homeland — weaving a pattern for the future.'}</p>
        </article>
      </section>

      <section className="site-section craft-section">
        <div className="craft-message">
          <p className="lead">{ru ? 'Искусство русского «сажения по бели» не имеет мировых аналогов.' : 'The Russian art of sazhene po beli has no equivalent in the world.'}</p>
          <p>{ru ? 'Русская традиция соединила надёжную органическую инженерию и доступность сакральной красоты — свидетельство высокой внутренней культуры и эстетической свободы Древней Руси.' : 'The Russian tradition united resilient organic engineering with accessible sacred beauty — a testament to the inner culture and aesthetic freedom of ancient Rus.'}</p>
        </div>
        <div className="video-placeholder" aria-label={ru ? 'Видео о создании панно будет добавлено позже' : 'A film about the making of the panel will be added later'}>
          <img src="./assets/panel-detail.png" alt="" />
          <div className="video-overlay"><span aria-hidden="true">▶</span><p>{ru ? 'Видео процесса создания панно готовится' : 'The making-of film is in production'}</p></div>
        </div>
      </section>

      <section className="site-section panel-section" id="panel">
        <h2 className="section-title">{ru ? 'О панно' : 'The panel'}</h2>
        <ol className="fact-list">
          {panelFacts[language].map((fact, index) => <li key={fact}><span>{String(index + 1).padStart(2, '0')}</span><p>{fact}</p></li>)}
        </ol>
        <p className="museum-note">{ru ? 'Это первое в России панно такого масштаба и смысла, выполненное в этой технике. Экспонат музейного уровня для выставочных пространств, общественной и жилой среды.' : 'This is the first panel in Russia of this scale and meaning created in this technique — a museum-level artwork for exhibition, public and residential spaces.'}</p>
      </section>

      <section className="site-section offer-section" id="offer">
        <h2 className="section-title">{ru ? 'Наше предложение' : 'Our proposal'}</h2>
        <div className="offer-grid">
          <article><span className="card-number">01</span><h3>{ru ? 'Продвижение' : 'Partnerships'}</h3><p>{ru ? 'Демонстрация панно и совместные проекты с выставочными площадками, информационными партнёрами, деятелями культуры, меценатами и предпринимателями.' : 'Exhibitions and joint projects with cultural venues, media partners, cultural leaders, patrons and entrepreneurs.'}</p><a href="tel:+79151643278">{ru ? 'Обсудить сотрудничество' : 'Discuss a partnership'}</a></article>
          <article><span className="card-number">02</span><h3>{ru ? 'Индивидуальный заказ' : 'Bespoke commission'}</h3><p>{ru ? 'Уникальное панно для частных лиц, организаций и регионов: индивидуальная история, смыслы, художественный эскиз и подбор натуральных материалов.' : 'A unique panel for individuals, organisations and regions: a personal story, meanings, an original sketch and selected natural materials.'}</p><a href="tel:+79151643278">{ru ? 'Заказать панно' : 'Commission a panel'}</a></article>
          <article><span className="card-number">03</span><h3>{ru ? 'Предварительный просмотр' : 'Private preview'}</h3><p>{ru ? 'Панно находится в работе и завершится в 2026 году. Для партнёров и заказчиков открыта предварительная запись на индивидуальный просмотр.' : 'The panel is in progress and will be completed in 2026. Partners and clients can join the waiting list for a private preview.'}</p><a href="tel:+79151643278">{ru ? 'Записаться' : 'Join the waiting list'}</a></article>
        </div>
      </section>

      <section className="site-section legacy-section">
        <p className="eyebrow">{ru ? 'Наследие' : 'Legacy'}</p>
        <blockquote>{ru ? '«То, что будет вечно и передаваться из поколения в поколение»' : '“Something eternal, passed from one generation to the next.”'}</blockquote>
      </section>

      <section className="site-section geography-section" id="geography">
        <h2 className="section-title">{ru ? 'Мы в России' : 'In Russia'}</h2>
        <RussiaMapCanvas language={language} />
        <p>{ru ? 'Если вы хотите присоединиться и заказать Древо как символ жизни и жизнетворения для вашего региона, свяжитесь с нами.' : 'If you would like your region to join the project and commission a Tree as a symbol of life and creation, contact us.'}</p>
        <a className="primary-button" href="tel:+79151643278">{ru ? 'Связаться' : 'Contact us'}</a>
      </section>

      <footer className="site-footer" id="contacts">
        <img className="footer-sun" src="./assets/sun.png" alt="" />
        <div className="footer-heading"><p className="eyebrow">СОЛНЦЕ.КУЛЬТУРА</p><h2 className="section-title">{ru ? 'Контакты' : 'Contacts'}</h2></div>
        <div className="footer-contact"><span>{ru ? 'Телефон' : 'Telephone'}</span><a href="tel:+79151643278">+7 915 164-32-78</a><span>{ru ? 'Почта' : 'Email'}</span><p>{ru ? 'Адрес будет создан на домене проекта' : 'An address on the project domain is being prepared'}</p></div>
        <div className="footer-resources"><span>{ru ? 'Информационные ресурсы' : 'Project resources'}</span>{resources.map((resource) => <p key={resource}>{resource}</p>)}</div>
        <div className="footer-socials" aria-label={ru ? 'Социальные сети проекта' : 'Project social networks'}><span>VK</span><span>RU</span><span>TG</span><span>YT</span><small>{ru ? 'Ссылки будут добавлены после передачи адресов' : 'Links will be added when the official addresses are supplied'}</small></div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} СОЛНЦЕ.КУЛЬТУРА</p><p>{ru ? 'Политика конфиденциальности и пользовательское соглашение — в подготовке' : 'Privacy policy and terms of use are being prepared'}</p></div>
      </footer>
    </main>
  );
}
