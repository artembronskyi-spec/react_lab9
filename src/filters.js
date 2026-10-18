/** @typedef {import('./state.js').Filters} Filters */

/**
 * C3. Повертає поточні значення форми фільтрів #filters. Поки C3 не виконано, фільтрів немає,
 * і список показує всі серіали. Специфікація — ТЗ, C3.
 *
 * @returns {Filters}
 */
export function readFilters() {
  const form = document.querySelector('#filters');
  if (!(form instanceof HTMLFormElement)) throw new TypeError('Не знайдено форму #filters');

  const query = form.elements.namedItem('query');
  const genre = form.elements.namedItem('genre');
  const mine = form.elements.namedItem('mine');
  if (!(query instanceof HTMLInputElement)) throw new TypeError('Не знайдено поле query у #filters');
  if (!(genre instanceof HTMLSelectElement)) throw new TypeError('Не знайдено поле genre у #filters');
  if (!(mine instanceof HTMLInputElement) || mine.type !== 'checkbox') {
    throw new TypeError('Не знайдено прапорець mine у #filters');
  }

  return { query: query.value, genre: genre.value, mine: mine.checked };
}

/**
 * C3. Підключає форму фільтрів: після кожної зміни — refresh(). main.js викликає цю функцію
 * один раз. Специфікація — ТЗ, C3.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initFilters(refresh) {
  const form = document.querySelector('#filters');
  if (!(form instanceof HTMLFormElement)) throw new TypeError('Не знайдено форму #filters');

  const query = form.elements.namedItem('query');
  const genre = form.elements.namedItem('genre');
  const mine = form.elements.namedItem('mine');
  if (!(query instanceof HTMLInputElement)) throw new TypeError('Не знайдено поле query у #filters');
  if (!(genre instanceof HTMLSelectElement)) throw new TypeError('Не знайдено поле genre у #filters');
  if (!(mine instanceof HTMLInputElement) || mine.type !== 'checkbox') {
    throw new TypeError('Не знайдено прапорець mine у #filters');
  }

  query.addEventListener('input', refresh);
  genre.addEventListener('change', refresh);
  mine.addEventListener('change', refresh);

  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('reset', (event) => {
    event.preventDefault();
    query.value = '';
    genre.value = '';
    mine.checked = false;
    refresh();
  });
}
