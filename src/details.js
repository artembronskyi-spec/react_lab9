import { getShow } from './state.js';

/**
 * C4. Відкриває діалог #details для серіалу: назва, опис, посилання на сторінку TVmaze і форма
 * з моєю оцінкою й нотаткою. Специфікація — ТЗ, C4.
 *
 * @param {number} id
 */
export function openDetails(id) {
  const show = getShow(id);
  const dialog = document.querySelector('#details');
  const title = document.querySelector('#details-title');
  const summary = document.querySelector('#details-summary');
  const link = document.querySelector('#details-link');

  if (!(dialog instanceof HTMLDialogElement)) throw new TypeError('Не знайдено діалог #details');
  if (!(title instanceof HTMLElement)) throw new TypeError('Не знайдено заголовок #details-title');
  if (!(summary instanceof HTMLElement)) throw new TypeError('Не знайдено опис #details-summary');
  if (!(link instanceof HTMLAnchorElement)) throw new TypeError('Не знайдено посилання #details-link');

  title.textContent = show.name;
  summary.textContent = new DOMParser().parseFromString(show.summary, 'text/html').body.textContent ?? '';
  link.href = show.url;
  if (!dialog.open) dialog.showModal();
}

/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
  void refresh;

  const dialog = document.querySelector('#details');
  const cancel = document.querySelector('#note-form button[type="button"]');

  if (!(dialog instanceof HTMLDialogElement)) throw new TypeError('Не знайдено діалог #details');
  if (!(cancel instanceof HTMLButtonElement)) {
    throw new TypeError('Не знайдено кнопку скасування у формі #note-form');
  }

  cancel.addEventListener('click', () => dialog.close());
}
