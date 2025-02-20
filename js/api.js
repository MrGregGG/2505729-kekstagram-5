const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

// Загрузка данных с сервера
const getData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/data`);
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error; // Пробрасываем ошибку дальше для обработки в UI
  }
};

// Отправка данных на сервер
const sendData = async (data) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      body: data,
    });
    if (!response.ok) {
      throw new Error('Ошибка отправки данных');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { getData, sendData };
