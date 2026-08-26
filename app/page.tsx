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

function RussiaMapCanvas({ language }: { language: Language }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const basePath = window.location.pathname.startsWith('/drevo-zhizni') ? '/drevo-zhizni' : '';
    const mapImage = new Image();
    const locationLogo = new Image();
    let fillMask: HTMLCanvasElement | null = null;
    let outlineLayer: HTMLCanvasElement | null = null;
    let mapBounds = { x: 0, y: 0, width: 1, height: 1 };

    mapImage.src = `${basePath}/assets/russia-map-source.jpg`;
    locationLogo.src = `${basePath}/assets/map-location-logo.svg`;

    const prepareMapLayers = () => {
      const source = document.createElement('canvas');
      source.width = mapImage.naturalWidth;
      source.height = mapImage.naturalHeight;
      const sourceContext = source.getContext('2d', { willReadFrequently: true });
      if (!sourceContext) return;
      sourceContext.drawImage(mapImage, 0, 0);

      const { width, height } = source;
      const sourcePixels = sourceContext.getImageData(0, 0, width, height);
      const sealed = new Uint8Array(width * height);
      const outside = new Uint8Array(width * height);

      for (let index = 0; index < width * height; index += 1) {
        const pixel = index * 4;
        const luminance = sourcePixels.data[pixel] * 0.299 + sourcePixels.data[pixel + 1] * 0.587 + sourcePixels.data[pixel + 2] * 0.114;
        if (luminance < 115) sealed[index] = 1;
      }

      const closedOutline = sealed.slice();
      for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
          const index = y * width + x;
          if (!sealed[index]) continue;
          for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
            for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
              closedOutline[(y + offsetY) * width + x + offsetX] = 1;
            }
          }
        }
      }

      const queue = new Int32Array(width * height);
      let head = 0;
      let tail = 0;
      const enqueue = (index: number) => {
        if (outside[index] || closedOutline[index]) return;
        outside[index] = 1;
        queue[tail] = index;
        tail += 1;
      };

      for (let x = 0; x < width; x += 1) {
        enqueue(x);
        enqueue((height - 1) * width + x);
      }
      for (let y = 0; y < height; y += 1) {
        enqueue(y * width);
        enqueue(y * width + width - 1);
      }

      while (head < tail) {
        const index = queue[head];
        head += 1;
        const x = index % width;
        if (x > 0) enqueue(index - 1);
        if (x < width - 1) enqueue(index + 1);
        if (index >= width) enqueue(index - width);
        if (index < width * (height - 1)) enqueue(index + width);
      }

      fillMask = document.createElement('canvas');
      fillMask.width = width;
      fillMask.height = height;
      const fillContext = fillMask.getContext('2d');
      const fillPixels = fillContext?.createImageData(width, height);

      outlineLayer = document.createElement('canvas');
      outlineLayer.width = width;
      outlineLayer.height = height;
      const outlineContext = outlineLayer.getContext('2d');
      const outlinePixels = outlineContext?.createImageData(width, height);
      if (!fillContext || !fillPixels || !outlineContext || !outlinePixels) return;

      let minX = width;
      let minY = height;
      let maxX = 0;
      let maxY = 0;
      for (let index = 0; index < width * height; index += 1) {
        const pixel = index * 4;
        if (!outside[index]) {
          const x = index % width;
          const y = Math.floor(index / width);
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          fillPixels.data[pixel] = 255;
          fillPixels.data[pixel + 1] = 255;
          fillPixels.data[pixel + 2] = 255;
          fillPixels.data[pixel + 3] = 255;
        }
        if (sealed[index]) {
          outlinePixels.data[pixel] = 17;
          outlinePixels.data[pixel + 1] = 17;
          outlinePixels.data[pixel + 2] = 17;
          outlinePixels.data[pixel + 3] = 255;
        }
      }
      fillContext.putImageData(fillPixels, 0, 0);
      outlineContext.putImageData(outlinePixels, 0, 0);
      mapBounds = {
        x: Math.max(0, minX - 8),
        y: Math.max(0, minY - 8),
        width: Math.min(width, maxX + 9) - Math.max(0, minX - 8),
        height: Math.min(height, maxY + 9) - Math.max(0, minY - 8),
      };
    };

    const draw = () => {
      if (!fillMask || !outlineLayer) return;
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

      const sourceRatio = mapBounds.width / mapBounds.height;
      const destinationRatio = width / height;
      const mapWidth = destinationRatio > sourceRatio ? height * sourceRatio : width;
      const mapHeight = destinationRatio > sourceRatio ? height : width / sourceRatio;
      const mapX = (width - mapWidth) / 2;
      const mapY = (height - mapHeight) / 2;

      context.drawImage(fillMask, mapBounds.x, mapBounds.y, mapBounds.width, mapBounds.height, mapX, mapY, mapWidth, mapHeight);
      context.globalCompositeOperation = 'source-in';

      const gold = context.createLinearGradient(mapX, mapY, mapX + mapWidth, mapY + mapHeight);
      gold.addColorStop(0, '#c99545');
      gold.addColorStop(0.5, '#f1d47d');
      gold.addColorStop(1, '#d7a650');
      context.fillStyle = gold;
      context.fillRect(mapX, mapY, mapWidth, mapHeight);
      context.globalCompositeOperation = 'source-over';
      context.drawImage(outlineLayer, mapBounds.x, mapBounds.y, mapBounds.width, mapBounds.height, mapX, mapY, mapWidth, mapHeight);

      const markers = [
        { name: 'Санкт-Петербург', x: 0.145, y: 0.43 },
        { name: 'Москва', x: 0.18, y: 0.54 },
        { name: 'Тюмень', x: 0.34, y: 0.60 },
        { name: 'Алтай', x: 0.47, y: 0.80 },
      ];
      const iconSize = Math.max(28, Math.min(52, mapWidth / 20));

      markers.forEach((marker) => {
        const x = mapX + marker.x * mapWidth;
        const y = mapY + marker.y * mapHeight;
        if (locationLogo.complete && locationLogo.naturalWidth) {
          context.drawImage(locationLogo, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
        }
      });
    };

    mapImage.onload = () => {
      prepareMapLayers();
      draw();
    };
    locationLogo.onload = draw;
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
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

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const containers = document.querySelectorAll<HTMLElement>('main > section, .site-footer');
    const revealItems: HTMLElement[] = [];

    containers.forEach((container) => {
      const selector = container.matches('.site-footer')
        ? ':scope > h2, :scope > .footer-contact'
        : 'h1, h2, h3, p, li, .text-button, .panel-wide, .section-divider, .russia-map-canvas';
      const items = container.querySelectorAll<HTMLElement>(selector);
      items.forEach((item, index) => {
        item.classList.add('reveal-item');
        item.style.setProperty('--reveal-delay', `${Math.min(index, 8) * 80}ms`);
        revealItems.push(item);
      });
    });

    if (reduceMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

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
          <a href="#top" onClick={closeMenu}>{ru ? 'Древо жизни' : 'Tree of Life'}</a>
          <a href="#project" onClick={closeMenu}>{ru ? 'Проект' : 'Project'}</a>
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
        <figure className="panel-wide">
          <img src="./assets/panel-tree-cutout.png" alt={ru ? 'Эскиз панно «Древо жизни»' : 'Tree of Life panel sketch'} />
        </figure>
      </section>

      <section className="site-section idea-section" id="idea">
        <article className="text-block">
          <p>{ru ? 'Мир находится в точке выбора дальнейшего пути: пути жизни или пути вымирания.' : 'The world has reached a point of choice: the path of life or the path of extinction.'}</p>
          <p>{ru ? 'Первое, что проявляет этот выбор в Мир, формирует импульс и путь его реализации — это Культура.' : 'Culture is the first force that expresses this choice and shapes the impulse and the path of its realisation.'}</p>
          <p className="dark-gradient-text">{ru ? 'Проект «СОЛНЦЕ.КУЛЬТУРА» выбирает путь жизни: помогает раскрыть Творца в Человеке, запускает импульс проявления Культурного Кода, формирования Культурного Поля жизни и жизнетворения, формирования Среды СоТворения, укрепляет Национальную Идентичность Народа и Культурный Суверенитет Родины для формирования Нового Мира.' : 'SOLNTSE.CULTURE chooses the path of life: it helps reveal the creator within each person, gives an impulse to the Cultural Code and a life-giving Cultural Field, creates an environment of co-creation, and strengthens national identity and cultural sovereignty.'}</p>
          <p>{ru ? 'Мы — деятели Культуры, предлагаем творческий объект «ДРЕВО ЖИЗНИ» как символ, образ для всех, кто выбирает путь жизни и жизнетворения, предлагаем объединяться и СоТворять Новый Мир.' : 'We, cultural practitioners, offer THE TREE OF LIFE as a symbol for everyone choosing life and life-giving creation, and invite people to unite and co-create a New World.'}</p>
        </article>
      </section>

      <section className="site-section project-section" id="project">
        <div className="project-copy">
          <h2>{ru ? 'Проект Древо жизни' : 'The Tree of Life project'}</h2>
          <p>{ru ? '«ДРЕВО ЖИЗНИ» представлено в формате монументального панно.' : 'THE TREE OF LIFE is presented as a monumental panel.'}</p>
          <p className="dark-gradient-text">{ru ? 'Основной смысл панно — наше волеизъявление в выборе жизни и жизнетворения.' : 'The central meaning of the panel is our conscious choice of life and life-giving creation.'}</p>
        </div>
      </section>

      <section className="site-section panel-section" id="panel">
        <div className="panel-content">
          <h3 className="subsection-title">{ru ? 'О панно' : 'The panel'}</h3>
          <ul>{panelFacts[language].map((fact) => <li key={fact}>{fact}</li>)}</ul>
        </div>
        <figure className="panel-video">
          <video autoPlay muted loop playsInline preload="metadata" aria-label={ru ? 'Видео о создании панно «Древо жизни»' : 'Video showing the creation of the Tree of Life panel'}>
            <source src="./assets/panel-process.mp4" type="video/mp4" />
          </video>
        </figure>
        <article className="technique-copy">
          <h3 className="subsection-title">{ru ? 'О технике сажение по бели' : 'About the sazhene po beli technique'}</h3>
          <p>{ru ? 'Изучение европейской и азиатской истории искусств показывает, что рельефное жемчужное шитьё всегда оставалось прерогативой узкого круга — верховной знати и высшего духовенства. На Руси сложилась диаметрально противоположная ситуация, обусловленная двумя факторами.' : 'The history of European and Asian art shows that raised pearl embroidery remained the privilege of a narrow circle — the highest nobility and senior clergy. In Rus, a diametrically opposite situation emerged due to two factors.'}</p>
          <ol>
            <li>{ru ? 'Реки Русского Севера — бассейны Северной Двины, Онеги и реки Кольского полуострова — были естественным ареалом обитания пресноводной жемчужницы. Добыча речного жемчуга была традиционным промыслом, доступным местному населению.' : 'The rivers of the Russian North were a natural habitat for freshwater pearl mussels. Harvesting river pearls was a traditional craft available to local communities.'}</li>
            <li>{ru ? 'В русском обществе до начала XVIII века отсутствовала строгая государственная монополия на ношение жемчуга. Поэтому сажение по бели проникло во все слои общества, став не просто элитарным искусством, но общенациональным Культурным Кодом.' : 'Until the early eighteenth century, Russian society had no strict state monopoly on wearing pearls. Sazhene po beli therefore spread throughout society and became a national Cultural Code.'}</li>
          </ol>
          <p>{ru ? 'Орнаментика жемчужного шитья представляла собой строгую знаковую систему. Жемчуг в древнерусской традиции символизировал чистоту, радость и небесный свет. Прокладывая льняной шнур и покрывая его жемчугом, мастерица буквально структурировала хаос, создавая защитный сакральный контур для себя, своего рода, народа, Родины. Она плела узор будущего.' : 'The ornamentation of pearl embroidery formed a strict symbolic system. In ancient Russian tradition, pearls symbolised purity, joy and heavenly light. By laying linen cord and covering it with pearls, the artisan shaped chaos into a sacred protective contour for herself, her family, her people and her homeland. She wove the pattern of the future.'}</p>
          <p>{ru ? 'Искусство русского «сажения по бели» не имеет мировых аналогов!' : 'The Russian art of sazhene po beli has no equivalent in the world!'}</p>
          <p>{ru ? 'Русская традиция явила миру идеальный симбиоз надёжной органической инженерии — льняная бель — и абсолютной доступности сакральной красоты. Массовое бытование сложнейшего жемчужного шитья свидетельствует о высочайшем уровне внутренней культуры, экономической состоятельности народа и удивительном торжестве эстетической свободы в Древней Руси.' : 'The Russian tradition united reliable organic engineering with access to sacred beauty. The widespread use of complex pearl embroidery testifies to the extraordinary inner culture, prosperity and aesthetic freedom of ancient Rus.'}</p>
        </article>
        <div className="section-divider" aria-hidden="true" />
        <article className="panel-summary">
          <p>{ru ? 'Это первое и единственное в России панно с соответствующей целью, смыслом, символами, образом такого размера, выполненное в данной технике исполнения.' : 'This is the first and only panel in Russia with this purpose, meaning and symbolism, at this scale and in this technique.'}</p>
          <p>{ru ? 'Панно является экспонатом музейного уровня, уникальным культурным объектом для выставочных пространств, общественной и жилой среды.' : 'The panel is a museum-level exhibit and a unique cultural object for exhibition spaces, public interiors and homes.'}</p>
        </article>
      </section>

      <section className="site-section geography-section" id="geography">
        <h2>{ru ? 'Мы в России' : 'In Russia'}</h2>
        <RussiaMapCanvas language={language} />
        <p>{ru ? 'Связаться с нами, если хотите, чтобы Ваш регион принял участие в проекте.' : 'Contact us if you would like your region to take part in the project.'}</p>
        <a className="text-button" href="tel:+79151643278">{ru ? 'Связаться' : 'Contact us'}</a>
      </section>

      <footer className="site-footer" id="contacts">
        <h2>{ru ? 'КОНТАКТЫ' : 'CONTACTS'}</h2>
        <div className="footer-contact">
          <p><strong>{ru ? 'ТЕЛЕФОН' : 'TELEPHONE'}</strong> 8 915 164 32 78</p>
          <p><strong>{ru ? 'ПОЧТА' : 'EMAIL'}</strong> solntse.kultura@mail.ru</p>
        </div>
      </footer>
    </main>
  );
}
