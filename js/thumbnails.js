import { openBigPicture } from './big-picture.js';

const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');


function createThumbnail(photoData) {
  const thumbnail = thumbnailTemplate.cloneNode(true);
  const img = thumbnail.querySelector('.picture__img');
  img.src = photoData.url;
  img.alt = photoData.description;
  thumbnail.querySelector('.picture__likes').textContent = photoData.likes;
  thumbnail.querySelector('.picture__comments').textContent = photoData.comments.length;
  // Открытие полноразмерного изображения при клике
  thumbnail.addEventListener('click', function () {
    openBigPicture(photoData); // Открываем большое изображение
  });
  return thumbnail;
}


function renderThumbnails(photoArray) {
  const thumbnailContainer = document.querySelector('.pictures');
  const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');

  photoArray.forEach((photo) => {
    const thumbnailElement = createThumbnail(photo);
    thumbnailElement.querySelector('.picture__img').src = photo.url;
    thumbnailElement.querySelector('.picture__likes').textContent = photo.likes;
    thumbnailElement.querySelector('.picture__comments').textContent = photo.comments.length;

    // Применяем эффект к миниатюре
    if (photo.effect && photo.effect !== 'none') {
      thumbnailElement.querySelector('.picture__img').classList.add(`effects__preview--${photo.effect}`);
    }

    thumbnailContainer.appendChild(thumbnailElement);
  });
}

export { renderThumbnails };



