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

  if (!(results instanceof HTMLUListElement)) throw new TypeError('Не знайдено список #results');
  if (!(template instanceof HTMLTemplateElement)) throw new TypeError('Не знайдено шаблон #show-card');
  if (!(status instanceof HTMLElement)) throw new TypeError('Не знайдено рядок статусу #status');

  const cards = list.map((show) => {
    const cardTemplate = template.content.firstElementChild;
    if (!(cardTemplate instanceof HTMLLIElement)) {
      throw new TypeError('Шаблон #show-card не містить картку <li>');
    }
    const card = cardTemplate.cloneNode(true);

    card.dataset.id = String(show.id);
    const fields = {
      name: show.name,
      year: show.year === null ? '—' : String(show.year),
      genres: show.genres.length ? show.genres.join(', ') : '—',
      rating: show.rating === null ? '—' : String(show.rating),
    };

    for (const [field, value] of Object.entries(fields)) {
      card.querySelectorAll(`[data-field="${field}"]`).forEach((element) => {
        element.textContent = value;
      });
    }

    const toggle = card.querySelector('[data-action="toggle"]');
    if (!(toggle instanceof HTMLButtonElement)) {
      throw new TypeError(`У шаблоні #show-card немає кнопки [data-action="toggle"]`);
    }
    toggle.setAttribute('aria-pressed', String(watchlist.has(show.id)));

    const note = notes.get(show.id);
    const mine = card.querySelector('.card__mine');
    const noteElement = card.querySelector('.card__note');
    const ratingElement = card.querySelector('[data-field="my-rating"]');
    const noteTextElement = card.querySelector('[data-field="note"]');
    if (
      !(mine instanceof HTMLElement) ||
      !(noteElement instanceof HTMLElement) ||
      !(ratingElement instanceof HTMLElement) ||
      !(noteTextElement instanceof HTMLElement)
    ) {
      throw new TypeError('У шаблоні #show-card немає полів моєї оцінки й нотатки');
    }
    mine.hidden = !note;
    noteElement.hidden = !note?.text;
    ratingElement.textContent = note ? String(note.rating) : '';
    noteTextElement.textContent = note?.text ?? '';

    return card;
  });

  results.replaceChildren(...cards);
  status.textContent = list.length
    ? `Знайдено: ${list.length} з ${shows.length}`
    : 'Нічого не знайдено';
  if (count) count.textContent = String(watchlist.size);
}
