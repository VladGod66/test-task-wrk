//Находим поле ввода url
const urlInput = document.querySelector('.define__input');
//Находим кнопку Определить движок
const define = document.querySelector('.define__submit');
//Находим кнопку Очистить поле
const reset = document.querySelector('.define__reset');
//Находим место вывода результата запроса
const info = document.querySelector('.define__info');

//Функция преобразования в строку содержимого страницы
const getStringForDoc = (doc) => {
    return [ doc.head.innerHTML, doc.body.innerHTML ].map(str => str.toLowerCase().trim()).join(" ");
  };

//Функция проверки наличия и контента метатега generator, а также поиска ключевых слов при отсутствии метатега
const checkCms = (doc) => {
    const metaGenerator = doc.querySelector('meta[name="generator"]');
    if (metaGenerator && metaGenerator.getAttribute('content').includes('WordPress')) {
        info.innerHTML = `Сайт ${urlInput.value} работает на CMS WordPress`;
    } else if (metaGenerator == null) {
        info.innerHTML = `Не существует метатега о генераторе страницы у сайта ${urlInput.value}`;
        const string = getStringForDoc(doc);
        if (string.indexOf('bitrix' ) != -1) {info.innerHTML = 'Сайт на bitrix'; return}
        if (string.indexOf('wordpress' || 'wp') != -1) {info.innerHTML = 'Сайт на wordpress'; return}
        if (string.indexOf('joomla') != -1) {info.innerHTML = 'Сайт на joomla'; return}
        if (string.indexOf('wix') != -1) {info.innerHTML = 'Сайт на wix'; return}
        if (string.indexOf('ucoz') != -1) {info.innerHTML = 'Сайт на uCoz'; return}
        info.innerHTML = 'Не обнаружено следов CMS или конструкторов';
    } else {
        info.innerHTML = `Сайт ${urlInput.value} работает на: ${metaGenerator.getAttribute('content')}`;

    }
  }

//Функция запроса, распарса и поиска инфы о движке страницы заданного сайта
const requestDOM = (url) => {
  if (url != '') {
  fetch(url)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      checkCms(doc);
    })
    .catch(error => {
        console.error('Error:', error);
        info.innerHTML = `Cайта ${urlInput.value} не существует в сети`;
    });
  } else info.innerHTML = '';
}

//Функция очистки поля url и вывода
const resetInput = () => {
    urlInput.value = '';
    info.innerHTML = '';
}

//Подписываемся на запрос данных с сервера сайта по событию click на кнопку Определить движок
define.addEventListener('click', () => requestDOM(urlInput.value));

//Подписываемся на очистку поля url по событию click на кнопку Очистить поле
reset.addEventListener('click', () => resetInput());