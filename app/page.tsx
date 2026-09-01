'use client';

import { useEffect, useRef, useState } from 'react';

type Language = 'ru' | 'en';

const panelFacts = {
  ru: [
    'Мы создаем – символ Нового Мира живого и животворящего.',
    'Наша Формула Творения – Многомерность.',
    'Обращаемся к высоко-художественной традиционной техника узорочья.',
    'Мы используем древнейший русский приём вышивки сажение по бели.',
    'Размер панно 3 метра х 3 метра.',
    'Проработка эскизов и подготовка образцов элементов панно – 3 месяца.',
    '4 мастера работают над панно 1 год.',
    'Используемый материал – натуральный лен, 3 500 метров хлопкового шнура, перевитого вручную и выложенного непрерывно.',
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

function MapCanvas({ language, kind }: { language: Language; kind: 'russia' | 'world' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isWorld = kind === 'world';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const basePath = window.location.pathname.startsWith('/drevo-zhizni') ? '/drevo-zhizni' : '';
    const mapImage = new Image();
    const worldLandMask = new Image();
    const locationLogo = new Image();
    let mapPath: Path2D | null = null;
    let treeLayer: HTMLCanvasElement | null = null;
    let mapBounds = { x: 0, y: 0, width: 1, height: 1 };

    mapImage.src = `${basePath}/assets/${isWorld ? 'world-map-trace.png' : 'russia-map-source.jpg'}`;
    if (isWorld) worldLandMask.src = `${basePath}/assets/world-map-land-mask.png`;
    locationLogo.src = `${basePath}/assets/tree-mark.png`;

    const prepareTreeLayer = () => {
      if (!locationLogo.naturalWidth || !locationLogo.naturalHeight) return;
      treeLayer = document.createElement('canvas');
      treeLayer.width = locationLogo.naturalWidth;
      treeLayer.height = locationLogo.naturalHeight;
      const treeContext = treeLayer.getContext('2d', { willReadFrequently: true });
      if (!treeContext) return;
      treeContext.drawImage(locationLogo, 0, 0);
      const pixels = treeContext.getImageData(0, 0, treeLayer.width, treeLayer.height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        const luminance = pixels.data[index] * 0.299 + pixels.data[index + 1] * 0.587 + pixels.data[index + 2] * 0.114;
        pixels.data[index + 3] = Math.max(0, Math.min(255, (238 - luminance) * 6));
      }
      treeContext.putImageData(pixels, 0, 0);
    };

    const prepareMapPath = () => {
      if (isWorld) {
        mapPath = new Path2D();
        mapBounds = {
          x: 0,
          y: 0,
          width: mapImage.naturalWidth,
          height: mapImage.naturalHeight,
        };
        return;
      }

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
      const sealRadius = 1;
      for (let y = sealRadius; y < height - sealRadius; y += 1) {
        for (let x = sealRadius; x < width - sealRadius; x += 1) {
          const index = y * width + x;
          if (!sealed[index]) continue;
          for (let offsetY = -sealRadius; offsetY <= sealRadius; offsetY += 1) {
            for (let offsetX = -sealRadius; offsetX <= sealRadius; offsetX += 1) {
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

      const inside = new Uint8Array(width * height);
      let minX = width;
      let minY = height;
      let maxX = 0;
      let maxY = 0;
      for (let index = 0; index < width * height; index += 1) {
        if (!outside[index]) {
          inside[index] = 1;
          const x = index % width;
          const y = Math.floor(index / width);
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }

      type Point = { x: number; y: number };
      type Edge = { from: Point; to: Point; used: boolean };
      const edges: Edge[] = [];
      const edgesByStart = new Map<string, number[]>();
      const pointKey = (point: Point) => `${point.x},${point.y}`;
      const addEdge = (from: Point, to: Point) => {
        const edgeIndex = edges.length;
        edges.push({ from, to, used: false });
        const key = pointKey(from);
        const matches = edgesByStart.get(key);
        if (matches) matches.push(edgeIndex);
        else edgesByStart.set(key, [edgeIndex]);
      };

      for (let y = minY; y <= maxY; y += 1) {
        for (let x = minX; x <= maxX; x += 1) {
          const index = y * width + x;
          if (!inside[index]) continue;
          if (y === 0 || !inside[index - width]) addEdge({ x, y }, { x: x + 1, y });
          if (x === width - 1 || !inside[index + 1]) addEdge({ x: x + 1, y }, { x: x + 1, y: y + 1 });
          if (y === height - 1 || !inside[index + width]) addEdge({ x: x + 1, y: y + 1 }, { x, y: y + 1 });
          if (x === 0 || !inside[index - 1]) addEdge({ x, y: y + 1 }, { x, y });
        }
      }

      const pointDistance = (point: Point, start: Point, end: Point) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        if (!dx && !dy) return Math.hypot(point.x - start.x, point.y - start.y);
        const position = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
        return Math.hypot(point.x - (start.x + position * dx), point.y - (start.y + position * dy));
      };
      const simplify = (points: Point[], tolerance: number): Point[] => {
        if (points.length <= 2) return points;
        let furthestIndex = 0;
        let furthestDistance = 0;
        for (let index = 1; index < points.length - 1; index += 1) {
          const distance = pointDistance(points[index], points[0], points[points.length - 1]);
          if (distance > furthestDistance) {
            furthestDistance = distance;
            furthestIndex = index;
          }
        }
        if (furthestDistance <= tolerance) return [points[0], points[points.length - 1]];
        const first = simplify(points.slice(0, furthestIndex + 1), tolerance);
        const second = simplify(points.slice(furthestIndex), tolerance);
        return [...first.slice(0, -1), ...second];
      };

      const vectorPath = new Path2D();
      edges.forEach((edge) => {
        if (edge.used) return;
        const loop: Point[] = [edge.from];
        let currentEdge = edge;
        while (!currentEdge.used) {
          currentEdge.used = true;
          loop.push(currentEdge.to);
          if (pointKey(currentEdge.to) === pointKey(loop[0])) break;
          const nextIndex = edgesByStart.get(pointKey(currentEdge.to))?.find((index) => !edges[index].used);
          if (nextIndex === undefined) break;
          currentEdge = edges[nextIndex];
        }
        if (loop.length < 16 || pointKey(loop[0]) !== pointKey(loop[loop.length - 1])) return;
        const simplified = simplify(loop.slice(0, -1), 2.2);
        if (simplified.length < 3) return;
        vectorPath.moveTo(simplified[0].x, simplified[0].y);
        for (let index = 0; index < simplified.length; index += 1) {
          const point = simplified[index];
          const next = simplified[(index + 1) % simplified.length];
          vectorPath.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
        }
        vectorPath.closePath();
      });
      mapPath = vectorPath;
      mapBounds = {
        x: Math.max(0, minX - 8),
        y: Math.max(0, minY - 8),
        width: Math.min(width, maxX + 9) - Math.max(0, minX - 8),
        height: Math.min(height, maxY + 9) - Math.max(0, minY - 8),
      };
    };

    const draw = () => {
      if (!mapPath) return;
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

      const gold = context.createLinearGradient(mapX, mapY, mapX + mapWidth, mapY + mapHeight);
      gold.addColorStop(0, '#c99545');
      gold.addColorStop(0.5, '#f1d47d');
      gold.addColorStop(1, '#d7a650');
      if (isWorld) {
        if (!worldLandMask.naturalWidth) return;
        const landLayer = document.createElement('canvas');
        landLayer.width = canvas.width;
        landLayer.height = canvas.height;
        const landContext = landLayer.getContext('2d');
        if (!landContext) return;
        landContext.setTransform(ratio, 0, 0, ratio, 0, 0);
        const landGold = landContext.createLinearGradient(mapX, mapY, mapX + mapWidth, mapY + mapHeight);
        landGold.addColorStop(0, '#c99545');
        landGold.addColorStop(0.5, '#f1d47d');
        landGold.addColorStop(1, '#d7a650');
        landContext.fillStyle = landGold;
        landContext.fillRect(mapX, mapY, mapWidth, mapHeight);
        landContext.globalCompositeOperation = 'destination-in';
        landContext.drawImage(worldLandMask, mapX, mapY, mapWidth, mapHeight);
        context.drawImage(landLayer, 0, 0, width, height);
        context.drawImage(mapImage, mapX, mapY, mapWidth, mapHeight);
      } else {
        context.save();
        context.translate(mapX - mapBounds.x * (mapWidth / mapBounds.width), mapY - mapBounds.y * (mapHeight / mapBounds.height));
        context.scale(mapWidth / mapBounds.width, mapHeight / mapBounds.height);
        context.fillStyle = gold;
        context.fill(mapPath);
        context.strokeStyle = '#111111';
        context.lineWidth = Math.max(1.6, 2.2 * mapBounds.width / mapWidth);
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.stroke(mapPath);
        context.restore();
      }

      const markers = isWorld
        ? [{ name: 'Москва', x: 0.6044, y: 0.1903 }]
        : [
            // Albers equal-area projection (central meridian 90° E) fitted to the source outline and its 8 px mask padding.
            { name: 'Санкт-Петербург', x: 0.144063, y: 0.457566 },
            { name: 'Москва', x: 0.139739, y: 0.589989 },
            { name: 'Тюмень', x: 0.322546, y: 0.742538 },
            { name: 'Центр Республики Алтай', x: 0.469130, y: 0.944220 },
          ];
      const iconSize = Math.max(28, Math.min(46, mapWidth / 22));

      markers.forEach((marker) => {
        const halfIcon = iconSize / 2;
        const x = Math.max(mapX + halfIcon, Math.min(mapX + mapWidth - halfIcon, mapX + marker.x * mapWidth));
        const y = Math.max(mapY + halfIcon, Math.min(mapY + mapHeight - halfIcon, mapY + marker.y * mapHeight));
        if (treeLayer) {
          context.save();
          context.beginPath();
          context.rect(mapX, mapY, mapWidth, mapHeight);
          context.clip();

          const goldMarker = context.createLinearGradient(x - halfIcon, y - halfIcon, x + halfIcon, y + halfIcon);
          goldMarker.addColorStop(0, '#c99545');
          goldMarker.addColorStop(0.5, '#f1d47d');
          goldMarker.addColorStop(1, '#d7a650');
          context.beginPath();
          context.arc(x, y, halfIcon - 1, 0, Math.PI * 2);
          context.fillStyle = goldMarker;
          context.fill();

          const redOutline = context.createLinearGradient(x - halfIcon, y - halfIcon, x + halfIcon, y + halfIcon);
          redOutline.addColorStop(0, '#7d0d12');
          redOutline.addColorStop(0.48, '#c93b42');
          redOutline.addColorStop(1, '#8f1116');
          context.strokeStyle = redOutline;
          context.lineWidth = 2;
          context.stroke();

          const treeSize = iconSize;
          context.drawImage(treeLayer, x - treeSize / 2, y - treeSize / 2, treeSize, treeSize);
          context.restore();
        }
      });
    };

    mapImage.onload = () => {
      prepareMapPath();
      draw();
    };
    locationLogo.onload = () => {
      prepareTreeLayer();
      draw();
    };
    worldLandMask.onload = draw;
    if (mapImage.complete && mapImage.naturalWidth) prepareMapPath();
    if (locationLogo.complete && locationLogo.naturalWidth) prepareTreeLayer();
    if (isWorld && worldLandMask.complete && worldLandMask.naturalWidth) draw();
    if (mapImage.complete && locationLogo.complete) draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [isWorld]);

  return (
    <canvas
      ref={canvasRef}
      className={isWorld ? 'world-map-canvas' : 'russia-map-canvas'}
      role="img"
      aria-label={isWorld
        ? (language === 'ru' ? 'Карта мира: Москва' : 'World map: Moscow')
        : (language === 'ru' ? 'Карта России: Москва, Санкт-Петербург, Тюмень и центр Республики Алтай' : 'Map of Russia: Moscow, Saint Petersburg, Tyumen and the centre of the Altai Republic')}
    />
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('ru');
  const [menuOpen, setMenuOpen] = useState(false);
  const panelAlignmentAnchorRef = useRef<HTMLSpanElement>(null);
  const ru = language === 'ru';

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const anchor = panelAlignmentAnchorRef.current;
    if (!anchor) return;

    const updatePanelAlignment = () => {
      document.documentElement.style.setProperty('--panel-content-left', `${anchor.getBoundingClientRect().right}px`);
    };

    updatePanelAlignment();
    document.fonts.ready.then(updatePanelAlignment);
    const observer = new ResizeObserver(updatePanelAlignment);
    observer.observe(anchor);
    window.addEventListener('resize', updatePanelAlignment);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePanelAlignment);
    };
  }, [language]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const containers = document.querySelectorAll<HTMLElement>('main > section, .site-footer');
    const revealItems: HTMLElement[] = [];

    containers.forEach((container) => {
      const selector = container.matches('.site-footer')
        ? ':scope > h2, :scope > .footer-contact'
        : 'h1, h2, h3, p, li, .text-button, .panel-wide, .section-divider, .russia-map-canvas, .world-map-canvas, .events-table, .offer-gallery';
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
        <button className={`menu-toggle${menuOpen ? ' is-open' : ''}`} type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? (ru ? 'Закрыть меню' : 'Close menu') : (ru ? 'Открыть меню' : 'Open menu')}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
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
          <p className="hero-quote">{ru ? 'С Севера пришли они, мужчины и женщины, образующие сильный Народ, продолжающие следовать путём Духа, Души, Сознания, Крови, Совести, Воли, Света и Сокровенной Истины, в ком сильна Память. Именно это вдохнуло в них огромную силу Предназначения. В их сердцах пылает огонь стремления, и пламя это позволяет им Созидать, СоТворять.' : '“They came from the North, courageous men and women forming a strong people, continuing along the path of Spirit, Soul, Consciousness, Blood, Conscience, Will and Innermost Truth. This breathed into them the immense power of purpose. The fire of aspiration burns in their hearts, and this flame enables them to act and create.”'}</p>
        </div>
        <figure className="panel-wide">
          <img src="./assets/panel-tree-cutout.png" alt={ru ? 'Эскиз панно «Древо жизни»' : 'Tree of Life panel sketch'} />
        </figure>
      </section>

      <section className="site-section idea-section" id="idea">
        <article className="text-block">
          <p>{ru ? 'Мир находится в точке выбора дальнейшего пути: пути жизни или пути вымирания.' : 'The world has reached a point of choice: the path of life or the path of extinction.'}</p>
          <p>{ru ? 'Первое, что проявляет этот выбор в Мир, формирует импульс и путь его реализации – это Культура.' : 'Culture is the first force that expresses this choice and shapes the impulse and the path of its realisation.'}</p>
          <p className="dark-gradient-text">
            {ru ? <><span ref={panelAlignmentAnchorRef}>П</span>роект “СОЛНЦЕ.КУЛЬТУРА” выбирает путь жизни: помогает раскрыть Творца в Человеке, запускает импульс проявления Культурного Кода, формирования Культурного Поля жизни и жизнетворения, формирования Среды СоТворения, укрепляет Национальную Идентичность Народа и Культурный Суверенитет Родины для формирования Нового Мира.</> : <><span ref={panelAlignmentAnchorRef}>S</span>OLNTSE.CULTURE chooses the path of life: it helps reveal the creator within each person, gives an impulse to the Cultural Code and a life-giving Cultural Field, creates an environment of co-creation, and strengthens national identity and cultural sovereignty.</>}
          </p>
          <p>{ru ? 'Мы предлагаем творческий объект “ДРЕВО ЖИЗНИ” как символ, образ для всех, кто выбирает путь жизни и жизнетворения, предлагаем объединяться и СоТворять Новый Мир.' : 'We offer THE TREE OF LIFE as a symbol for everyone choosing life and life-giving creation, and invite people to unite and co-create a New World.'}</p>
        </article>
      </section>

      <section className="site-section project-section" id="project">
        <div className="project-copy">
          <h2>{ru ? 'Проект Древо жизни' : 'The Tree of Life project'}</h2>
          <p>{ru ? '“ДРЕВО ЖИЗНИ” представлено в формате монументального панно.' : 'THE TREE OF LIFE is presented as a monumental panel.'}</p>
          <p className="dark-gradient-text">{ru ? <span className="red-gradient-underline">Основной смысл панно – наше волеизъявление в выборе жизни и жизнетворения.</span> : 'The central meaning of the panel is our conscious choice of life and life-giving creation.'}</p>
        </div>
      </section>

      <section className="site-section panel-section" id="panel">
        <div className="panel-content">
          <h3 className="subsection-title">{ru ? 'О панно' : 'The panel'}</h3>
          <ul>{panelFacts[language].map((fact, index) => (
            <li key={fact} className={index === panelFacts[language].length - 3 ? 'panel-fact-two-lines' : undefined}>
              {index === panelFacts[language].length - 3
                ? (ru
                    ? <><span>Используемый материал – натуральный лен, 3 500 метров</span>{' '}<span>хлопкового шнура, перевитого вручную и выложенного непрерывно.</span></>
                    : <><span>The materials are natural linen and 3,500 metres of cotton cord,</span>{' '}<span>twisted by hand and laid continuously.</span></>)
                : fact}
            </li>
          ))}</ul>
        </div>
        <figure className="panel-video">
          <video autoPlay loop playsInline controls preload="auto" aria-label={ru ? 'Видео о создании панно «Древо жизни»' : 'Video showing the creation of the Tree of Life panel'}>
            <source src="./assets/panel-process.mp4" type="video/mp4" />
          </video>
        </figure>
        <article className="technique-copy">
          <h3 className="subsection-title">{ru ? 'О технике сажение по бели' : 'About the sazhene po beli technique'}</h3>
          <p>{ru ? 'Изучение европейской и азиатской истории искусств показывает, что рельефное жемчужное шитье всегда оставалось прерогативой узкого круга — верховной знати и высшего духовенства. На Руси сложилась диаметрально противоположная ситуация, обусловленная двумя факторами.' : 'The history of European and Asian art shows that raised pearl embroidery remained the privilege of a narrow circle — the highest nobility and senior clergy. In Rus, a diametrically opposite situation emerged due to two factors.'}</p>
          <ol>
            <li>{ru ? 'Реки Русского Севера (бассейны Северной Двины, Онеги, реки Кольского полуострова) были естественным ареалом обитания пресноводной жемчужницы. Добыча речного (скатного) жемчуга была традиционным промыслом, доступным местному населению.' : 'The rivers of the Russian North (the basins of the Northern Dvina and Onega and the rivers of the Kola Peninsula) were a natural habitat for freshwater pearl mussels. Harvesting river pearls was a traditional craft available to local communities.'}</li>
            <li>{ru ? 'В русском обществе до начала XVIII века отсутствовала строгая государственная монополия на ношение жемчуга. Это привело к тому, что сажение по бели проникло во все слои общества, став не просто элитарным искусством, но общенациональным Культурным Кодом.' : 'Until the early eighteenth century, Russian society had no strict state monopoly on wearing pearls. This allowed sazhene po beli to spread throughout society and become a national Cultural Code.'}</li>
          </ol>
          <p>{ru ? 'Орнаментика жемчужного шитья представляла собой строгую знаковую систему. Жемчуг в древнерусской традиции символизировал чистоту, радость и небесный свет. Прокладывая льняной шнур и покрывая его жемчугом, мастерица буквально структурировала хаос, создавая защитный сакральный контур для себя, своего рода, народа, Родины. Она плела узор будущего.' : 'The ornamentation of pearl embroidery formed a strict symbolic system. In ancient Russian tradition, pearls symbolised purity, joy and heavenly light. By laying linen cord and covering it with pearls, the artisan shaped chaos into a sacred protective contour for herself, her family, her people and her homeland. She wove the pattern of the future.'}</p>
          <p>{ru ? 'Искусство русского «сажения по бели» не имеет мировых аналогов!' : 'The Russian art of sazhene po beli has no equivalent in the world!'}</p>
          <p>{ru ? 'Русская традиция явила миру идеальный симбиоз надежной органической инженерии (льняная бель) и абсолютной доступности сакральной красоты. Массовое бытование сложнейшего жемчужного шитья свидетельствует о высочайшем уровне внутренней культуры, экономической состоятельности народа и удивительном торжестве эстетической свободы в Древней Руси.' : 'The Russian tradition united reliable organic engineering with access to sacred beauty. The widespread use of complex pearl embroidery testifies to the extraordinary inner culture, prosperity and aesthetic freedom of ancient Rus.'}</p>
        </article>
        <div className="section-divider" aria-hidden="true" />
        <article className="panel-summary">
          <p>{ru ? 'Это первое и единственное в России панно с соответствующей целью, смыслом, символами, образом такого размера, выполненного в данной технике исполнения.' : 'This is the first and only panel in Russia with this purpose, meaning and symbolism, at this scale and in this technique.'}</p>
          <p>{ru ? 'Панно является экспонатом музейного уровня, уникальным культурным объектом для выставочных пространств, общественной и жилой среды.' : 'The panel is a museum-level exhibit and a unique cultural object for exhibition spaces, public interiors and homes.'}</p>
        </article>
      </section>

      <section className="site-section offer-section" id="offer">
        <h2>{ru ? 'Наше предложение' : 'Our proposal'}</h2>
        <article className="offer-promotion">
          <h3 className="offer-label">{ru ? 'Продвижение' : 'Promotion'}</h3>
          <p>{ru ? 'Сотрудничество с целью демонстрации панно и совместных проектов с выставочными площадками, информационными партнерами, деятелями культуры, меценатами, предпринимателями и другими заинтересованными лицами.' : 'Cooperation to present the panel and create joint projects with exhibition venues, media partners, cultural practitioners, patrons, entrepreneurs and other interested parties.'}</p>
          <a className="text-button" href="tel:+79151643278">{ru ? 'Связаться' : 'Contact us'}</a>
        </article>
        <div className="offer-divider" aria-hidden="true" />
        <article className="offer-order">
          <h3 className="offer-label">{ru ? 'Индивидуальный заказ' : 'Bespoke commission'}</h3>
          <p>{ru ? 'Изготовление панно по индивидуальному заказу для частных лиц, организаций, государственных структур в поддержку общего волеизъявления в выборе жизни и жизнетворения.' : 'A bespoke panel for individuals, organisations and government bodies in support of the shared choice of life and life-giving creation.'}</p>
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
        <div className="offer-gallery" aria-label={ru ? 'Примеры художественных деталей панно' : 'Examples of artistic panel details'}>
          {[0, 1, 2].map((item) => (
            <figure className={`offer-gallery-item offer-gallery-item-${item + 1}`} key={item}>
              <img src="./assets/panel-detail.png" alt={ru ? `Фрагмент техники панно ${item + 1}` : `Panel technique detail ${item + 1}`} />
            </figure>
          ))}
        </div>
        <div className="preview-copy">
          <p>{ru ? 'Сейчас “ДРЕВО ЖИЗНИ” находится в исполнении, завершение — 2026 год. Панно открыто для индивидуального просмотра партнёрами и заказчиками.' : 'THE TREE OF LIFE is currently in production and will be completed in 2026. The panel is open for private previews by partners and clients.'}</p>
          <a className="text-button" href="tel:+79151643278">{ru ? 'Связаться для предварительного просмотра' : 'Arrange a private preview'}</a>
        </div>
      </section>

      <section className="site-section events-section" id="events">
        <h2>{ru ? 'Презентация панно Древо жизни' : 'Tree of Life panel presentation'}</h2>
        <div className="events-content">
          <h3 className="subsection-title">{ru ? 'Будущие мероприятия' : 'Upcoming events'}</h3>
          <div className="events-table-wrap">
            <table className="events-table">
              <thead>
                <tr>
                  <th scope="col">{ru ? 'Дата' : 'Date'}</th>
                  <th scope="col">{ru ? 'Мероприятие' : 'Event'}</th>
                  <th scope="col">{ru ? 'Место проведения' : 'Venue'}</th>
                  <th scope="col">{ru ? 'Ссылка на мероприятие' : 'Event link'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="events-empty-row">
                  <td colSpan={4}>{ru ? 'Информация о ближайших мероприятиях появится здесь.' : 'Information about upcoming events will appear here.'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="site-section geography-section" id="geography">
        <h2>{ru ? 'Мы в России' : 'In Russia'}</h2>
        <MapCanvas language={language} kind="russia" />
        <p>{ru ? 'Связаться с нами для участия Вашего региона в проекте.' : 'Contact us if you would like your region to take part in the project.'}</p>
        <a className="text-button" href="tel:+79151643278">{ru ? 'Связаться' : 'Contact us'}</a>
      </section>

      <section className="site-section geography-section world-section" id="world">
        <h2>{ru ? 'Мы в мире' : 'In the world'}</h2>
        <MapCanvas language={language} kind="world" />
        <p>{ru ? 'Связаться с нами для участия Вашей страны в проекте.' : 'Contact us if you would like your country to take part in the project.'}</p>
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
