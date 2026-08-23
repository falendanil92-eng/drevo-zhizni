'use client';

import { useState } from 'react';

const processSteps = [
  'Разработка эскизов',
  'Подготовка образцов элементов',
  'Работа мастеров над панно',
  'Сборка единого арт-объекта',
];

const projects = [
  'СОЛНЦЕ',
  'СОЛНЦЕ.КУЛЬТУРА',
  'СОЛНЦЕ.ЖИВОЕ ДЕЛО',
  'СОЛНЦЕ.ЖИВАЯ ПЛАНЕТА',
  'СОЛНЦЕ.СОТВОРЕНИЕ',
  'СОЛНЦЕ.РУССКИЙ ОБЛИК',
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [gridVisible, setGridVisible] = useState(true);
  const move = (direction: number) => {
    setSlide((current) => (current + direction + processSteps.length) % processSteps.length);
  };

  return (
    <main className={gridVisible ? 'show-grid' : ''}>
      <header className="site-header">
        <a className="wordmark" href="#top">СОЛНЦЕ.КУЛЬТУРА</a>
        <nav aria-label="Основная навигация">
          <a href="#top">Главная</a><a href="#idea">Идея</a><a href="#project">Проект</a>
          <a href="#panel">Панно</a><a href="#geography">География</a><a href="#contacts">Контакты</a>
        </nav>
        <button className="grid-toggle" onClick={() => setGridVisible((visible) => !visible)} aria-pressed={gridVisible}>
          {gridVisible ? 'Скрыть сетку' : 'Показать сетку'}
        </button>
      </header>

      <section className="section hero" id="top">
        <div className="hero-intro">
          <p className="kicker">Проект «Солнце.Культура»</p>
          <h1>Древо жизни</h1>
          <p className="hero-quote">«С севера пришли они, отважные мужчины и женщины, образующие сильный Народ, продолжающие следовать путём Духа, Души, Сознания, Крови, Совести, Воли и Сокровенной Истины».</p>
        </div>
        <div className="placeholder tree-placeholder" aria-label="Место для главного изображения Древа жизни">
          <div className="tree-mark" aria-hidden="true"><i /><span /></div>
          <small>Главное изображение проекта</small>
        </div>
      </section>

      <section className="section manifesto" id="idea">
        <article className="text-block">
          <h2>Живой мир</h2>
          <p><strong>Мир находится в точке выбора дальнейшего пути: пути жизни или пути вымирания.</strong></p>
          <p>Первое, что проявляет этот выбор в Мир и формирует импульс и путь его реализации — это Культура.</p>
          <p>Проект «СОЛНЦЕ.КУЛЬТУРА» выбирает путь жизни: раскрывает Творца в человеке, запускает импульс для формирования Культурного Кода и Культурного Поля жизни и жизнетворения.</p>
          <p>Концепция проекта объединяет духовное, культурное и творческое развитие страны через призму Национальной идентичности.</p>
          <p><strong>Мы предлагаем «Древо жизни» как образ для всех, кто выбирает путь жизни и созидания.</strong></p>
        </article>
      </section>

      <section className="section project-section" id="project">
        <div className="project-copy">
          <h2>Проект «Древо жизни»</h2>
          <p>Визуализация объекта представлена в формате монументального панно.</p>
          <p>Основной смысл объекта — наше волеизъявление в выборе пути жизни и жизнетворения, проявленного через символ «Древо жизни».</p>
        </div>
        <div className="placeholder project-media"><small>Фотография или видео панно</small></div>
      </section>

      <section className="section history-section">
        <article className="text-block history-copy">
          <h2>Традиция и культурный код</h2>
          <p>Изучение европейской и азиатской истории искусств показывает, что рельефное жемчужное шитьё всегда оставалось прерогативой узкого круга — верховной знати и высшего духовенства. На Руси сложилась противоположная ситуация.</p>
          <p><strong>1.</strong> Реки Русского Севера были естественным ареалом обитания пресноводной жемчужницы. Добыча речного жемчуга была традиционным промыслом, доступным местному населению.</p>
          <p><strong>2.</strong> В русском обществе отсутствовала строгая государственная монополия на ношение жемчуга. Сажение по бели проникло во все слои общества и стало общенациональным Культурным Кодом.</p>
          <p>Орнаментика жемчужного шитья представляла строгую знаковую систему. Мастерица структурировала хаос, создавая защитный сакральный контур для себя, своего рода, народа и Родины.</p>
        </article>
      </section>

      <section className="section craft-section">
        <div className="craft-copy">
          <p>Искусство русского «сажения по бели» не имеет мировых аналогов.</p>
          <p>Русская традиция явила миру симбиоз надёжной органической инженерии и абсолютной доступности сакральной красоты.</p>
        </div>
        <div className="carousel">
          <div className="placeholder"><small>Фотография процесса создания панно</small></div>
          <div className="carousel-caption"><span>Этап {slide + 1}</span><h3>{processSteps[slide]}</h3></div>
          <button className="prev" onClick={() => move(-1)} aria-label="Предыдущий этап">←</button>
          <button className="next" onClick={() => move(1)} aria-label="Следующий этап">→</button>
        </div>
      </section>

      <section className="section panel-section" id="panel">
        <h2>О панно</h2>
        <div className="panel-layout">
          <ul>
            <li>Мы создаём символ Нового Мира — живого и животворящего.</li>
            <li>Формула Творения проекта — многомерность.</li>
            <li>Используется древнейший русский приём вышивки сажение по бели.</li>
            <li>Размер панно — 3 метра × 3 метра.</li>
            <li>Подготовка образцов элементов занимает 3 месяца.</li>
            <li>Четыре мастера работают над панно один год.</li>
            <li>Используется 3 500 метров хлопкового шнура и 7 кг жемчуга.</li>
            <li>Сделано 500 000 стежков.</li>
          </ul>
          <div className="placeholder panel-video"><small>Видео процесса производства</small></div>
        </div>
        <p className="panel-note">Панно является экспонатом музейного уровня, уникальным арт-объектом для выставочных пространств и интерьеров.</p>
      </section>

      <section className="section legacy-section">
        <p className="legacy-label">Наследие</p>
        <blockquote>«То, что будет вечно и передаваться из поколения в поколение»</blockquote>
      </section>

      <section className="section cards-section">
        <h2>Три направления проекта</h2>
        <div className="three-cards">
          {['Смысл', 'Мастерство', 'Будущее'].map((title, index) => (
            <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>Место для содержания раздела, которое будет уточнено после получения технического задания.</p></article>
          ))}
        </div>
      </section>

      <section className="section geography-section" id="geography">
        <h2>Мы в России</h2>
        <div className="map-placeholder russian-map"><small>Карта проектов в регионах России</small><i /><i /><i /></div>
        <p>Связаться с нами, если хотите, чтобы ваш регион принял участие в проекте.</p>
        <a className="button" href="#contacts">Связаться</a>
      </section>

      <section className="section geography-section world-section">
        <h2>Мы в мире</h2>
        <div className="map-placeholder world-map"><small>Карта международных проектов</small><i /><i /><i /><i /></div>
      </section>

      <footer id="contacts">
        <h2>Контакты</h2>
        <div className="contact-data"><a href="tel:+79151643278">Телефон&nbsp; +7 915 164-32-78</a><a href="mailto:hello@example.ru">Почта&nbsp; hello@example.ru</a></div>
        <div className="project-links">{projects.map((project) => <a href="#top" key={project}>●&nbsp; {project}</a>)}</div>
        <div className="social-links"><a href="#contacts">VK</a><a href="#contacts">RU</a><a href="#contacts">TG</a><a href="#contacts">YT</a></div>
        <p className="copyright">© СОЛНЦЕ.КУЛЬТУРА</p>
      </footer>
    </main>
  );
}
