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

//Функция проверки наличия в DOM метатега generator, а также поиска ключевых слов в DOM при отсутствии метатега на сайте
const checkDOM = (doc) => {
    const metaGenerator = doc.querySelector('meta[name="generator"]');
    if (metaGenerator) {info.innerHTML = `Сайт ${urlInput.value} работает на ${metaGenerator.getAttribute('content')}`; return} 
    check(doc);
}
//Функция проверки поиска ключевых слов в файле robots.txt сайта
const checkRobots = (docTxt) => check(docTxt);

//Функция поиска ключевых слов
const check = (docs) => {
    const string = getStringForDoc(docs);
    if (string.indexOf('bitrix' ) != -1) {info.innerHTML = 'Сайт работает на bitrix'; return}
    if (string.indexOf('wordpress' || 'wp') != -1) {info.innerHTML = 'Сайт работает  на wordpress'; return}
    if (string.indexOf('joomla') != -1) {info.innerHTML = 'Сайт работает на joomla'; return}
    if (string.indexOf('wix') != -1) {info.innerHTML = 'Сайт работает на wix'; return}
    if (string.indexOf('ucoz') != -1) {info.innerHTML = 'Сайт работает на uCoz'; return}
    if (string.indexOf('tilda') != -1) {info.innerHTML = 'Сайт работает на tilda'; return}
    info.innerHTML = `На сайте ${urlInput.value} не обнаружено следов CMS или конструкторов`;
}

//Функция запроса, распарса и поиска инфы о движке страницы заданного сайта
const requestDOM = (url) => {
    console.log('//' + url);
  if (url != '') {
  //Запрос DOM загрузочной страницы сайта
  fetch('//' + url)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      console.log(doc);
      checkDOM(doc);
      //Запрос файла robots.txt сайта
      fetch('//' + url + '/robots.txt')
        .then(response => response.text())
        .then(txt => {
            const parserTxt = new DOMParser();
            const docTxt = parserTxt.parseFromString(txt, 'text/html');
            if (getStringForDoc(docTxt).indexOf('не найдено' || 'not found') != -1) return;
            console.log(docTxt);
            checkRobots(docTxt);
        })
        .catch(error => {
            console.error('Error:', error);
            info.innerHTML = `Файла ${urlInput.value} не существует`;
        });
        
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