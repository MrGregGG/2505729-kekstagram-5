const bigPicture = document.querySelector('.big-picture');
const imageElement = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const descriptionElement = bigPicture.querySelector('.social__caption');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const commentsPerPage = 5;

let currentComments = [];
let displayedCommentsCount = 0;

function renderComments() {
  const nextComments = currentComments.slice(displayedCommentsCount, displayedCommentsCount + commentsPerPage);

  nextComments.forEach((comment) => {
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');

    commentElement.innerHTML = `
            <img
                class='social__picture'
                src='${comment.avatar}'
                alt='${comment.name}'
                width='35' height='35'>
            <p class='social__text'>${comment.message}</p>
        `;
    socialComments.appendChild(commentElement);
  });

  displayedCommentsCount += nextComments.length;

  commentCountBlock.textContent = `${displayedCommentsCount} из ${currentComments.length} комментариев`;

  if (displayedCommentsCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  }
}

function openBigPicture(photoData) {
  imageElement.src = photoData.url;
  imageElement.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;
  descriptionElement.textContent = photoData.description;

  socialComments.innerHTML = '';

  imageElement.className = '';

  // Применение эффекта, если он есть
  if (photoData.effect && photoData.effect !== 'none') {
    imageElement.classList.add(`effects__preview--${photoData.effect}`);
  }

  currentComments = photoData.comments;
  displayedCommentsCount = 0;

  renderComments();

  if (currentComments.length > 0) {
    commentCountBlock.classList.remove('hidden');
    if (currentComments.length > commentsPerPage) {
      commentsLoader.classList.remove('hidden');
    } else {
      commentsLoader.classList.add('hidden');
    }
  } else {
    commentCountBlock.classList.add('hidden');
    commentsLoader.classList.add('hidden');
  }

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeButton.addEventListener('click', closeBigPicture);
  document.addEventListener('keydown', onEscapePress);
}


function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  closeButton.removeEventListener('click', closeBigPicture);
  document.removeEventListener('keydown', onEscapePress);
}
function onEscapePress(evt) {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
}

commentsLoader.addEventListener('click', renderComments);

export { openBigPicture };
