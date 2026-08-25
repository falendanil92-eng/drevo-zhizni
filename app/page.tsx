'use client';

import { useEffect, useRef, useState } from 'react';

type Language = 'ru' | 'en';

const panelFacts = {
  ru: [
    'Мы создаём символ Нового Мира — живого и животворящего.',
    'Наша Формула Творения — Многомерность.',
    'Обращаемся к высокохудожественной традиционной технике узорочья.',
    'Мы используем древнейший русский приём вышивки — сажение по бели.',
    'Размер панно — 3 метра × 3 метра.',
    'Проработка эскизов и подготовка образцов элементов панно — 3 месяца.',
    '4 мастера работают над панно 1 год.',
    'Используемый материал — натуральный лён, 3 500 метров хлопкового шнура, перевитого вручную и выложенного непрерывно.',
    'Используется 7 кг жемчуга и бусин из натурального камня.',
    'Сделано 500 000 стежков.',
  ],
  en: [
    'We are creating a symbol of a New World — alive and life-giving.',
    'Our Formula of Creation is Multidimensionality.',
    'We turn to the highly artistic traditional technique of ornamental decoration.',
    'We use the ancient Russian embroidery technique known as sazhene po beli.',
    'The panel measures 3 metres × 3 metres.',
    'Sketch development and preparation of element samples take 3 months.',
    '4 artisans work on the panel for 1 year.',
    'The materials are natural linen and 3,500 metres of cotton cord, twisted by hand and laid continuously.',
    '7 kg of pearls and natural-stone beads are used.',
    '500,000 stitches are made.',
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
    tree.src = `${basePath}/assets/final-tree-ring.png`;

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
        if (index === 0) context.moveTo(x * sx, y * sy);
        else context.lineTo(x * sx, y * sy);
      });
      context.closePath();

      const gold = context.createLinearGradient(0, 0, width, height);
      gold.addColorStop(0, '#a7742d');
      gold.addColorStop(0.5, '#e0b652');
      gold.addColorStop(1, '#b87f32');
      context.fillStyle = gold;
      context.fill();
      context.strokeStyle = '#111111';
      context.lineWidth = Math.max(2, width / 420);
      context.lineJoin = 'round';
      context.stroke();

      const markers = [
        { x: 190, y: 250, ru: 'Санкт-Петербург', en: 'Saint Petersburg' },
        { x: 232, y: 300, ru: 'Москва', en: 'Moscow' },
        { x: 468, y: 322, ru: 'Тюмень', en: 'Tyumen' },
        { x: 560, y: 375, ru: 'Алтай', en: 'Altai' },
      ];
      const iconSize = Math.max(42, Math.min(86, width / 11));

      markers.forEach((marker) => {
        const x = marker.x * sx;
        const y = marker.y * sy;
        if (tree.complete && tree.naturalWidth) {
          context.drawImage(tree, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
        }
        context.fillStyle = '#111111';
        const bodyFontSize = Number.parseFloat(window.getComputedStyle(document.body).fontSize);
        context.font = `600 ${bodyFontSize}px "Nunito Sans", sans-serif`;
        context.textAlign = 'center';
        context.fillText(language === 'ru' ? marker.ru : marker.en, x, y + iconSize / 2 + 20);
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
          <a href="#idea" onClick={closeMenu}>{ru ? 'Живой мир' : 'Living world'}</a>
          <a href="#project" onClick={closeMenu}>{ru ? 'Проект' : 'Project'}</a>
          <a href="#panel" onClick={closeMenu}>{ru ? 'О панно' : 'The panel'}</a>
          <a href="#offer" onClick={closeMenu}>{ru ? 'Предложение' : 'Proposal'}</a>
          <a href="#geography" onClick={closeMenu}>{ru ? 'Мы в России' : 'In Russia'}</a>
          <a href="#contacts" onClick={closeMenu}>{ru ? 'Контакты' : 'Contacts'}</a>
        </nav>
        <div className="language-switch" aria-label={ru ? 'Выбор языка' : 'Choose language'}>
          <button type="button" className={ru ? 'active' : ''} onClick={() => setLanguage('ru')} aria-pressed={ru}>RU</button>
          <span aria-hidden="true">/</span>
          <button type="button" className={!ru ? 'active' : ''} onClick={() => setLanguage('en')} aria-pressed={!ru}>EN</button>
        </div>
      </header>

      <section className="site-section hero" id="top">
        <div className="hero-intro">
          <h1>{ru ? 'Древо жизни' : 'The Tree of Life'}</h1>
          <p className="hero-quote">{ru ? '«С севера пришли они, отважные мужчины и женщины, образующие сильный Народ, продолжающие следовать путём Духа, Души, Сознания, Крови, Совести, Воли и Сокровенной Истины. Именно это вдохнуло в них огромную силу предназначения. В их сердцах пылает огонь стремления, и пламя это позволяет им действовать и созидать».' : '“They came from the North, courageous men and women forming a strong people, continuing along the path of Spirit, Soul, Consciousness, Blood, Conscience, Will and Innermost Truth. This breathed into them the immense power of purpose. The fire of aspiration burns in their hearts, and this flame enables them to act and create.”'}</p>
        </div>
        <figure className="tree-figure">
          <img src="./assets/final-tree.png" alt={ru ? 'Древо жизни с двумя оленями' : 'The Tree of Life with two deer'} />
        </figure>
      </section>

      <section className="site-section idea-section" id="idea">
        <article className="text-block">
          <h2>{ru ? 'Живой мир' : 'Living world'}</h2>
          <p>{ru ? 'Мир находится в точке выбора дальнейшего пути: пути жизни или пути вымирания.' : 'The world has reached a point of choice: the path of life or the path of extinction.'}</p>
          <p>{ru ? 'Первое, что проявляет этот выбор в Мир, формирует импульс и путь его реализации — это Культура.' : 'Culture is the first force that expresses this choice and shapes the impulse and the path of its realisation.'}</p>
          <p>{ru ? 'Проект «СОЛНЦЕ.КУЛЬТУРА» выбирает путь жизни: помогает раскрыть Творца в Человеке, запускает импульс проявления Культурного Кода, формирования Культурного Поля жизни и жизнетворения, формирования Среды СоТворения, укрепляет Национальную Идентичность Народа и Культурный Суверенитет Родины для формирования Нового Мира.' : 'SOLNTSE.CULTURE chooses the path of life: it helps reveal the creator within each person, gives an impulse to the Cultural Code and a life-giving Cultural Field, creates an environment of co-creation, and strengthens national identity and cultural sovereignty.'}</p>
          <p>{ru ? 'Концепция проекта «СОЛНЦЕ.КУЛЬТУРА» — это очень глубокая и многомерная идея, которая объединяет духовное, культурное и творческое развитие страны через призму Национальной идентичности, Культурного Кода и Культурного Поля.' : 'The concept of SOLNTSE.CULTURE is a deep, multidimensional idea uniting the spiritual, cultural and creative development of the country through national identity, Cultural Code and Cultural Field.'}</p>
          <p>{ru ? 'Мы — деятели Культуры, предлагаем творческий объект «ДРЕВО ЖИЗНИ» как символ, образ для всех, кто выбирает путь жизни и жизнетворения, предлагаем объединяться и СоТворять Новый Мир.' : 'We, cultural practitioners, offer THE TREE OF LIFE as a symbol for everyone choosing life and life-giving creation, and invite people to unite and co-create a New World.'}</p>
        </article>
      </section>

      <section className="site-section project-section" id="project">
        <div className="project-copy">
          <h2>{ru ? 'Проект Древо жизни' : 'The Tree of Life project'}</h2>
          <p>{ru ? '«ДРЕВО ЖИЗНИ» представлено в формате монументального панно.' : 'THE TREE OF LIFE is presented as a monumental panel.'}</p>
          <p>{ru ? 'Основной смысл этого объекта — наше волеизъявление в выборе пути жизни и жизнетворения, проявленного через символ «ДРЕВО ЖИЗНИ».' : 'The central meaning of this object is our conscious choice of the path of life and life-giving creation, expressed through the TREE OF LIFE symbol.'}</p>
        </div>
        <figure className="panel-wide">
          <img src="./assets/panel-detail.png" alt={ru ? 'Фрагмент панно в процессе создания' : 'Detail of the panel in progress'} />
        </figure>
      </section>

      <section className="site-section technique-section">
        <article className="text-block technique-copy">
          <p>{ru ? 'Изучение европейской и азиатской истории искусств показывает, что рельефное жемчужное шитьё всегда оставалось прерогативой узкого круга — верховной знати и высшего духовенства. На Руси сложилась диаметрально противоположная ситуация, обусловленная двумя факторами.' : 'The history of European and Asian art shows that raised pearl embroidery remained the privilege of a narrow circle — the highest nobility and senior clergy. In Rus, a diametrically opposite situation emerged due to two factors.'}</p>
          <ol>
            <li>{ru ? 'Реки Русского Севера — бассейны Северной Двины, Онеги и реки Кольского полуострова — были естественным ареалом обитания пресноводной жемчужницы. Добыча речного жемчуга была традиционным промыслом, доступным местному населению.' : 'The rivers of the Russian North were a natural habitat for freshwater pearl mussels. Harvesting river pearls was a traditional craft available to local communities.'}</li>
            <li>{ru ? 'В русском обществе до начала XVIII века отсутствовала строгая государственная монополия на ношение жемчуга. Поэтому сажение по бели проникло во все слои общества, став не просто элитарным искусством, но общенациональным Культурным Кодом.' : 'Until the early eighteenth century, Russian society had no strict state monopoly on wearing pearls. Sazhene po beli therefore spread throughout society and became a national Cultural Code.'}</li>
          </ol>
          <p>{ru ? 'Орнаментика жемчужного шитья представляла собой строгую знаковую систему. Жемчуг в древнерусской традиции символизировал чистоту, радость и небесный свет. Прокладывая льняной шнур и покрывая его жемчугом, мастерица буквально структурировала хаос, создавая защитный сакральный контур для себя, своего рода, народа, Родины. Она плела узор будущего.' : 'The ornamentation of pearl embroidery formed a strict symbolic system. In ancient Russian tradition, pearls symbolised purity, joy and heavenly light. By laying linen cord and covering it with pearls, the artisan shaped chaos into a sacred protective contour for herself, her family, her people and her homeland. She wove the pattern of the future.'}</p>
        </article>
      </section>

      <section className="site-section panel-section" id="panel">
        <article className="technique-conclusion">
          <p>{ru ? 'Искусство русского «сажения по бели» не имеет мировых аналогов!' : 'The Russian art of sazhene po beli has no equivalent in the world!'}</p>
          <p>{ru ? 'Русская традиция явила миру идеальный симбиоз надёжной органической инженерии — льняная бель — и абсолютной доступности сакральной красоты. Массовое бытование сложнейшего жемчужного шитья свидетельствует о высочайшем уровне внутренней культуры, экономической состоятельности народа и удивительном торжестве эстетической свободы в Древней Руси.' : 'The Russian tradition united reliable organic engineering with access to sacred beauty. The widespread use of complex pearl embroidery testifies to the extraordinary inner culture, prosperity and aesthetic freedom of ancient Rus.'}</p>
        </article>
        <div className="panel-content">
          <h2>{ru ? 'О панно' : 'The panel'}</h2>
          <ul>{panelFacts[language].map((fact) => <li key={fact}>{fact}</li>)}</ul>
        </div>
        <div className="video-placeholder" aria-label={ru ? 'Место для видео о создании панно' : 'Placeholder for the making-of film'}>
          <img src="./assets/panel-detail.png" alt="" />
        </div>
        <article className="panel-summary">
          <p>{ru ? 'Это первое и единственное в России панно с соответствующей целью, смыслом, символами, образом такого размера, выполненное в данной технике исполнения.' : 'This is the first and only panel in Russia with this purpose, meaning and symbolism, at this scale and in this technique.'}</p>
          <p>{ru ? 'Панно является экспонатом музейного уровня, уникальным арт-объектом для выставочных пространств, общественной и жилой среды.' : 'The panel is a museum-level exhibit and a unique art object for exhibition spaces, public interiors and homes.'}</p>
        </article>
      </section>

      <section className="site-section offer-section" id="offer">
        <h2>{ru ? 'Наше предложение' : 'Our proposal'}</h2>
        <article className="offer-promotion">
          <p className="offer-label">{ru ? '1. Продвижение' : '1. Promotion'}</p>
          <p>{ru ? 'Сотрудничество с целью демонстрации панно и совместных проектов с выставочными площадками, информационными партнёрами, деятелями культуры, меценатами, предпринимателями и другими заинтересованными лицами.' : 'Cooperation to present the panel and create joint projects with exhibition venues, media partners, cultural practitioners, patrons, entrepreneurs and other interested parties.'}</p>
          <a className="text-button" href="tel:+79151643278">{ru ? 'Связаться' : 'Contact us'}</a>
        </article>
        <article className="offer-order">
          <p className="offer-label">{ru ? '2. Индивидуальный заказ' : '2. Bespoke commission'}</p>
          <p>{ru ? 'Изготовление панно по индивидуальному заказу для частных лиц, общественных и коммерческих организаций, государственных структур.' : 'A bespoke panel for individuals, public and commercial organisations, and government bodies.'}</p>
          <p>{ru ? 'Панно изготавливается индивидуально с учётом цели:' : 'Each panel is created individually according to its purpose:'}</p>
          <ul>
            <li>{ru ? 'Символ живого мира.' : 'A symbol of a living world.'}</li>
            <li>{ru ? 'Родовое древо для Вашей истории.' : 'A family tree for your story.'}</li>
            <li>{ru ? 'Древо — символ устойчивости и развития организации.' : 'A tree symbolising the resilience and growth of an organisation.'}</li>
            <li>{ru ? 'Древо — символ устойчивости и развития региона.' : 'A tree symbolising the resilience and growth of a region.'}</li>
          </ul>
          <p>{ru ? 'Разработка индивидуального концепта включает в себя: подбор смыслов, разработку индивидуальной истории, высокохудожественного эскиза, подбор материалов. Уникальное для Вас панно изготавливается в единственном экземпляре.' : 'The bespoke concept includes meanings, an individual story, a highly artistic sketch and selected materials. Your unique panel is made as a single edition.'}</p>
          <p>{ru ? 'Это то, что будет вечно и передаваться из поколения в поколение.' : 'It is something eternal, passed from one generation to the next.'}</p>
          <a className="text-button" href="tel:+79151643278">{ru ? 'Связаться' : 'Contact us'}</a>
        </article>
        <figure className="offer-image">
          <img src="./assets/panel-detail.png" alt={ru ? 'Фрагмент создаваемого панно' : 'Detail of the panel being created'} />
        </figure>
        <div className="preview-copy">
          <p>{ru ? 'Сейчас «ДРЕВО ЖИЗНИ» находится в исполнении, завершение — 2026 год. Панно открыто для индивидуального просмотра партнёрами и заказчиками.' : 'THE TREE OF LIFE is currently in production and will be completed in 2026. The panel is open for private previews by partners and clients.'}</p>
          <a className="text-button" href="tel:+79151643278">{ru ? 'Связаться для предварительного просмотра' : 'Arrange a private preview'}</a>
        </div>
      </section>

      <section className="site-section geography-section" id="geography">
        <h2>{ru ? 'Мы в России' : 'In Russia'}</h2>
        <RussiaMapCanvas language={language} />
        <p>{ru ? 'Связаться с нами, если хотите, чтобы Ваш регион принял участие в проекте.' : 'Contact us if you would like your region to take part in the project.'}</p>
        <a className="text-button" href="tel:+79151643278">{ru ? 'Связаться' : 'Contact us'}</a>
      </section>

      <footer className="site-footer" id="contacts">
        <h2>{ru ? 'Контакты' : 'Contacts'}</h2>
        <div className="footer-contact">
          <p>{ru ? 'Телефон' : 'Telephone'}</p>
          <a href="tel:+79151643278">8 915 164 32 78</a>
          <p>{ru ? 'Почта' : 'Email'}</p>
        </div>
        <div className="footer-resources">
          {resources.map((resource) => <p key={resource}>● {resource}</p>)}
        </div>
        <div className="footer-socials" aria-label={ru ? 'Информационные ресурсы проекта' : 'Project information channels'}>
          <span>TG</span><span>RU</span><span>VK</span><span>▶</span>
          <span></span><span></span><span>VK</span><span>▶</span>
          <span></span><span></span><span></span><span>▶</span>
          <span></span><span></span><span>VK</span><span>▶</span>
        </div>
      </footer>
    </main>
  );
}
