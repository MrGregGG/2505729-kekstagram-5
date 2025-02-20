import { getData } from './api.js';
import { renderThumbnails } from './thumbnails.js';
import { initForm } from './form.js';

const photos = [];
const RERENDER_DELAY = 500; // Задержка для устранения дребезга
const RANDOM_PHOTOS_COUNT = 10; // Количество случайных фотографий
const filtersContainer = document.querySelector('.img-filters'); // Блок фильтров
const picturesContainer = document.querySelector('.pictures'); // Контейнер для фотографий
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture'); // Шаблон фотографии
const imgFiltersElement = document.querySelector('.img-filters');
let currentPhotos = []; // Текущие фотографии
let filteredPhotos = []; // Отфильтрованные фотографии

const debounce = (callback, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), delay);
  };
};

// Функция для получения случайных фотографий
const getRandomPhotos = (photos) => {
  const shuffled = photos.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
};

// Функция для получения самых обсуждаемых фотографий
const getDiscussedPhotos = (photos) => {
  return photos.slice().sort((a, b) => b.comments.length - a.comments.length);
};

// Функция для создания DOM-элемента фотографии
const createPhotoElement = (photo) => {
  const photoElement = pictureTemplate.cloneNode(true);
  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  return photoElement;
};

// Функция для отрисовки фотографий
const renderPhotos = (photos) => {
  const fragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    const photoElement = createPhotoElement(photo);
    fragment.appendChild(photoElement);
  });
  picturesContainer.appendChild(fragment);
};

// Функция для удаления всех фотографий
const clearPhotos = () => {
  picturesContainer.querySelectorAll('.picture').forEach((photo) => photo.remove());
};

// Функция для обработки фильтрации
const onFilterChange = debounce((filter) => {
  clearPhotos(); // Удаляем старые фотографии

  switch (filter) {
    case 'filter-default':
      filteredPhotos = currentPhotos; // Фотографии по умолчанию
      break;
    case 'filter-random':
      filteredPhotos = getRandomPhotos(currentPhotos); // Случайные фотографии
      break;
    case 'filter-discussed':
      filteredPhotos = getDiscussedPhotos(currentPhotos); // Самые обсуждаемые фотографии
      break;
  }

  renderThumbnails(filteredPhotos); // Отрисовываем фотографии
}, RERENDER_DELAY);

// Функция для инициализации фильтров
const initFilters = () => {
  filtersContainer.classList.remove('img-filters--inactive'); // Показываем блок фильтров

  filtersContainer.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('img-filters__button')) {
      // Убираем активный класс у предыдущей кнопки
      filtersContainer.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
      // Добавляем активный класс нажатой кнопке
      evt.target.classList.add('img-filters__button--active');

      // Вызываем функцию фильтрации
      onFilterChange(evt.target.id);
    }
  });
};

// Функция для загрузки данных с сервера
const loadPhotos = async () => {
  try {
    currentPhotos = await getData(); // Загружаем данные
    filteredPhotos = currentPhotos; // По умолчанию показываем все фотографии
    imgFiltersElement.classList.remove('img-filters--inactive'); // Показываем фильтры
    initFilters(); // Инициализируем фильтры
    renderThumbnails(filteredPhotos); // Добавляем обработку кликов для отображения фото на весь экран
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    // Показать сообщение об ошибке пользователю
    const errorBlock = document.createElement('div');
    errorBlock.textContent = 'Не удалось загрузить фотографии. Попробуйте позже.';
    errorBlock.style.cssText = `
      color: red;
      text-align: center;
      font-size: 20px;
      margin-top: 20px;
    `;
    document.body.appendChild(errorBlock);
  }
};

// Загружаем фотографии при старте
loadPhotos();

// Инициализируем форму
initForm(photos, renderThumbnails);
