import { getShow, notes, saveNote } from './state.js';

/** @type {number | null} */
let activeShowId = null;
/** @type {HTMLElement | null} */
let detailsOpener = null;

function clearRatingError() {
  const rating = document.querySelector('#note-rating');
  const error = document.querySelector('#note-rating-error');
  if (!(rating instanceof HTMLInputElement) || !(error instanceof HTMLElement)) {
    throw new TypeError('Не знайдено поле оцінки або повідомлення про помилку');
  }

  rating.removeAttribute('aria-invalid');
  rating.removeAttribute('aria-describedby');
  error.textContent = '';
}

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
  const form = document.querySelector('#note-form');
  const rating = document.querySelector('#note-rating');
  const text = document.querySelector('#note-text');

  if (!(dialog instanceof HTMLDialogElement)) throw new TypeError('Не знайдено діалог #details');
  if (!(title instanceof HTMLElement)) throw new TypeError('Не знайдено заголовок #details-title');
  if (!(summary instanceof HTMLElement)) throw new TypeError('Не знайдено опис #details-summary');
  if (!(link instanceof HTMLAnchorElement)) throw new TypeError('Не знайдено посилання #details-link');
  if (!(form instanceof HTMLFormElement)) throw new TypeError('Не знайдено форму #note-form');
  if (!(rating instanceof HTMLInputElement)) throw new TypeError('Не знайдено поле #note-rating');
  if (!(text instanceof HTMLTextAreaElement)) throw new TypeError('Не знайдено поле #note-text');

  title.textContent = show.name;
  const parsedSummary = new DOMParser().parseFromString(show.summary, 'text/html');
  const paragraphs = [...parsedSummary.body.querySelectorAll('p')]
    .map((paragraph) => paragraph.textContent.trim())
    .filter(Boolean);
  const description = paragraphs.length
    ? paragraphs
    : [parsedSummary.body.textContent.trim()].filter(Boolean);
  summary.replaceChildren(
    ...description.map((paragraph) => {
      const element = document.createElement('p');
      element.textContent = paragraph;
      return element;
    }),
  );
  link.href = show.url;

  form.reset();
  clearRatingError();
  const note = notes.get(id);
  rating.value = note ? String(note.rating) : '';
  text.value = note?.text ?? '';
  activeShowId = id;
  if (!dialog.open) {
    detailsOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
  }
}

/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
  const dialog = document.querySelector('#details');
  const form = document.querySelector('#note-form');
  const cancel = document.querySelector('#note-form button[type="button"]');
  const rating = document.querySelector('#note-rating');
  const text = document.querySelector('#note-text');
  const error = document.querySelector('#note-rating-error');
  const status = document.querySelector('#status');
  const heading = document.querySelector('#results-heading');

  if (!(dialog instanceof HTMLDialogElement)) throw new TypeError('Не знайдено діалог #details');
  if (!(form instanceof HTMLFormElement)) throw new TypeError('Не знайдено форму #note-form');
  if (!(cancel instanceof HTMLButtonElement)) {
    throw new TypeError('Не знайдено кнопку скасування у формі #note-form');
  }
  if (!(rating instanceof HTMLInputElement)) throw new TypeError('Не знайдено поле #note-rating');
  if (!(text instanceof HTMLTextAreaElement)) throw new TypeError('Не знайдено поле #note-text');
  if (!(error instanceof HTMLElement)) throw new TypeError('Не знайдено повідомлення #note-rating-error');

  cancel.addEventListener('click', () => dialog.close());

  dialog.addEventListener('close', () => {
    const currentOpener =
      detailsOpener?.isConnected
        ? detailsOpener
        : activeShowId === null
          ? null
          : document.querySelector(
              `#results li[data-id="${activeShowId}"] button[data-action="details"]`,
            );
    if (currentOpener instanceof HTMLElement) currentOpener.focus();
    detailsOpener = null;
  });

  const ratingIsValid = () => {
    const value = rating.valueAsNumber;
    return rating.value !== '' && Number.isInteger(value) && value >= 1 && value <= 10;
  };

  rating.addEventListener('input', () => {
    if (ratingIsValid()) clearRatingError();
  });

  form.noValidate = true;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!ratingIsValid()) {
      const message =
        rating.value === ''
          ? 'Введіть оцінку від 1 до 10.'
          : 'Оцінка має бути цілим числом від 1 до 10.';
      rating.setAttribute('aria-invalid', 'true');
      rating.setAttribute('aria-describedby', error.id);
      error.textContent = message;
      rating.focus();
      return;
    }

    if (activeShowId === null) throw new TypeError('Не вибрано серіал для збереження нотатки');
    const show = getShow(activeShowId);
    saveNote(activeShowId, { rating: rating.valueAsNumber, text: text.value });

    dialog.close();
    refresh();
    if (status instanceof HTMLElement) {
      status.textContent = `Нотатку до ${show.name} збережено`;
    }

    const detailsButton = document.querySelector(
      `#results li[data-id="${activeShowId}"] button[data-action="details"]`,
    );
    if (detailsButton instanceof HTMLElement) detailsButton.focus();
    else heading?.focus();
  });
}
