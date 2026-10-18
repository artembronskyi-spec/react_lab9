/** @typedef {import('./state.js').Show} Show */

import { notes, shows, watchlist } from './state.js';

/**
 * C1. Показує серіали в списку #results — по картці з шаблону #show-card на кожен, у тому
 * самому порядку, — і оновлює рядок статусу #status. Специфікація — ТЗ, C1.
 *
 * @param {readonly Show[]} list серіали, які треба показати
 */
export function renderShows(list) {
  const results = document.querySelector('#results');
  const template = document.querySelector('#show-card');
  const status = document.querySelector('#status');
  const count = document.querySelector('#watchlist-count');

  if (!results || !template || !status) return;

  const cards = list.map((show) => {
    const clone = template.content.firstElementChild.cloneNode(true);

    // Зберігаємо id
    clone.dataset.id = String(show.id);

    // Основна інформація через textContent (C1.2, C1.3)
    const fields = {
      name: show.name ?? '—',
      year: show.year === null || show.year === undefined ? '—' : String(show.year),
      genres: show.genres && show.genres.length ? show.genres.join(', ') : '—',
      rating: show.rating === null || show.rating === undefined ? '—' : String(show.rating),
    };

    for (const [field, value] of Object.entries(fields)) {
      clone.querySelectorAll(`[data-field="${field}"]`).forEach((el) => {
        el.textContent = value;
      });
    }

    // Налаштування кнопки "До списку" (C1.5, C2.2)
    const toggleBtn = clone.querySelector('[data-action="toggle"]');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', String(watchlist.has(show.id)));
      toggleBtn.setAttribute('aria-label', `До списку: ${show.name}`);
    }

    // Налаштування кнопки "Детальніше" (C1.5)
    const detailsBtn = clone.querySelector('[data-action="details"]');
    if (detailsBtn) {
      detailsBtn.setAttribute('aria-label', `Детальніше про ${show.name}`);
    }

    // Поля моєї оцінки та нотатки (C4)
    const note = notes.get(show.id);
    const mineEl = clone.querySelector('.card__mine');
    const noteEl = clone.querySelector('.card__note');
    const ratingEl = clone.querySelector('[data-field="my-rating"]');
    const noteTextEl = clone.querySelector('[data-field="note"]');

    if (mineEl) mineEl.hidden = !note;
    if (noteEl) noteEl.hidden = !note?.text;
    if (ratingEl) ratingEl.textContent = note ? String(note.rating) : '';
    if (noteTextEl) noteTextEl.textContent = note?.text ?? '';

    return clone;
  });

  // Оновлюємо список і статус (C1.1, C1.6, C1.7)
  results.replaceChildren(...cards);

  status.textContent = list.length
    ? `Знайдено: ${list.length} з ${shows.length}`
    : 'Нічого не знайдено';

  if (count) {
    count.textContent = String(watchlist.size);
  }
}