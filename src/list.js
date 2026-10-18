import { toggle } from './state.js';
import { openDetails } from './details.js';

/**
 * C2. Підключає кнопки карток у списку #results: «До списку» додає серіал до мого списку або
 * прибирає з нього, «Детальніше» відкриває діалог (openDetails з details.js). main.js викликає
 * цю функцію один раз, після першого показу списку. Специфікація — ТЗ, C2.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initList(refresh) {
  const results = document.querySelector('#results');
  const heading = document.querySelector('#results-heading');
  if (!(results instanceof HTMLUListElement)) throw new TypeError('Не знайдено список #results');
  if (heading instanceof HTMLElement) heading.tabIndex = -1;

  results.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest('button[data-action]');
    if (!(button instanceof HTMLButtonElement) || !results.contains(button)) return;

    const card = button.closest('li[data-id]');
    if (!(card instanceof HTMLLIElement) || !results.contains(card)) return;

    const id = Number(card.dataset.id);
    if (!Number.isSafeInteger(id)) throw new TypeError(`Некоректний id серіалу: ${card.dataset.id}`);

    if (button.dataset.action === 'toggle') {
      const cardsBeforeUpdate = [...results.querySelectorAll('li[data-id]')];
      const cardIndex = cardsBeforeUpdate.indexOf(card);
      toggle(id);
      refresh();

      const updatedButton = results.querySelector(
        `li[data-id="${id}"] button[data-action="toggle"]`,
      );
      if (updatedButton instanceof HTMLButtonElement) {
        updatedButton.focus();
      } else {
        const adjacentCards = [
          ...cardsBeforeUpdate.slice(cardIndex + 1),
          ...cardsBeforeUpdate.slice(0, cardIndex).reverse(),
        ];
        const nextButton = adjacentCards
          .map((previousCard) => {
            const previousId = previousCard.dataset.id;
            return previousId
              ? results.querySelector(`li[data-id="${previousId}"] button[data-action="toggle"]`)
              : null;
          })
          .find((candidate) => candidate instanceof HTMLButtonElement);

        if (nextButton instanceof HTMLButtonElement) nextButton.focus();
        else heading?.focus();
      }
    } else if (button.dataset.action === 'details') {
      openDetails(id);
    }
  });
}
