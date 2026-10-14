import { subscribe } from 'valtio/vanilla';
import { state, validateUrl, addFeed } from './model.js';

let validationId = 0;

const render = () => {
  const input = document.querySelector('#rss-url');
  const error = document.querySelector('#rss-error');
  const button = document.querySelector('#rss-submit');

  input.value = state.form.input;
  input.classList.toggle('is-invalid', Boolean(state.form.error));
  input.classList.toggle('is-valid', state.form.valid);
  error.textContent = state.form.error;
  button.disabled = !state.form.valid;
};

const initView = () => {
  document.querySelector('#app').innerHTML = `
    <header class="bg-primary text-white py-4 mb-5">
      <div class="container">
        <h1 class="display-5">RSS Reader</h1>
        <p class="lead mb-0">Agrega tus fuentes RSS y consulta sus publicaciones favoritas.</p>
      </div>
    </header>

    <section class="container">
      <form id="rss-form" novalidate>
        <div class="mb-3">
          <label for="rss-url" class="form-label">RSS link</label>
          <input
            id="rss-url"
            name="url"
            type="text"
            class="form-control"
            placeholder="https://example.com/feed.xml"
            aria-describedby="rss-error"
            required
          >
          <div id="rss-error" class="invalid-feedback"></div>
        </div>

        <button id="rss-submit" type="submit" class="btn btn-primary" disabled>
          A\u00f1adir
        </button>
      </form>
    </section>
  `;

  const form = document.querySelector('#rss-form');
  const input = document.querySelector('#rss-url');

  input.addEventListener('input', (event) => {
    const currentValidationId = ++validationId;

    state.form.input = event.target.value;
    state.form.error = '';
    state.form.valid = false;
    render();

    validateUrl(state.form.input)
      .then(() => {
        if (currentValidationId !== validationId) {
          return;
        }

        state.form.valid = true;
        state.form.error = '';
      })
      .catch((validationError) => {
        if (currentValidationId !== validationId) {
          return;
        }

        state.form.valid = false;
        state.form.error = validationError.message;
      });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const currentValidationId = ++validationId;

    validateUrl(state.form.input)
      .then((url) => {
        if (currentValidationId !== validationId) {
          return;
        }

        addFeed(url);
        input.focus();
        render();
      })
      .catch((validationError) => {
        if (currentValidationId !== validationId) {
          return;
        }

        state.form.error = validationError.message;
        state.form.valid = false;
        render();
        input.focus();
      });
  });

  subscribe(state, render);
  render();
};

export default initView;
