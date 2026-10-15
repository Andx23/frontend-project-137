
import { subscribe } from 'valtio/vanilla';
import { state, validateUrl, addFeed } from './model.js';
import { i18next } from './i18n.js';

let validationId = 0;

const renderList = (container, items, createItem) => {
  container.replaceChildren();

  items.forEach((item) => {
    container.append(createItem(item));
  });
};

const render = () => {
  const input = document.querySelector('#rss-url');
  const error = document.querySelector('#rss-error');
  const button = document.querySelector('#rss-submit');
  const loading = document.querySelector('#rss-loading');
  const loadingError = document.querySelector('#rss-load-error');
  const feedsList = document.querySelector('#feeds-list');
  const postsList = document.querySelector('#posts-list');

  input.value = state.form.input;
  input.disabled = state.loading;
  input.classList.toggle('is-invalid', Boolean(state.form.error));
  input.classList.toggle('is-valid', state.form.valid);

  error.textContent = state.form.error
    ? i18next.t(`errors.${state.form.error}`)
    : '';

  button.disabled = !state.form.valid || state.loading;
  button.textContent = state.loading
    ? i18next.t('loading')
    : i18next.t('form.submit');

  loading.textContent = state.loading
    ? i18next.t('loading')
    : '';

  loadingError.textContent = state.loadingError
    ? i18next.t(`errors.${state.loadingError}`)
    : '';

  renderList(feedsList, state.feeds, (feed) => {
    const item = document.createElement('li');
    const title = document.createElement('h3');
    const description = document.createElement('p');

    title.textContent = feed.title;
    description.textContent = feed.description;

    item.append(title, description);

    return item;
  });

  renderList(postsList, state.posts, (post) => {
    const item = document.createElement('li');
    const link = document.createElement('a');

    link.textContent = post.title;

    try {
      const postUrl = new URL(post.link);

      if (postUrl.protocol === 'http:' || postUrl.protocol === 'https:') {
        link.href = postUrl.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        item.append(link);
      } else {
        item.textContent = post.title;
      }
    } catch {
      item.textContent = post.title;
    }

    return item;
  });
};

const initView = () => {
  document.querySelector('#app').innerHTML = `
    <header class="bg-primary text-white py-4 mb-5">
      <div class="container">
        <h1 class="display-5">${i18next.t('title')}</h1>
        <p class="lead mb-0">${i18next.t('description')}</p>
      </div>
    </header>

    <section class="container">
      <form id="rss-form" novalidate>
        <div class="mb-3">
          <label for="rss-url" class="form-label">${i18next.t('form.label')}</label>
          <input
            id="rss-url"
            name="url"
            type="text"
            class="form-control"
            placeholder="${i18next.t('form.placeholder')}"
            aria-describedby="rss-error"
            required
          >
          <div id="rss-error" class="invalid-feedback"></div>
        </div>

        <button id="rss-submit" type="submit" class="btn btn-primary" disabled>
          ${i18next.t('form.submit')}
        </button>

        <p id="rss-loading" role="status" aria-live="polite"></p>
        <p id="rss-load-error" class="text-danger" role="alert"></p>
      </form>

      <section class="mt-5">
        <h2>${i18next.t('feeds')}</h2>
        <ul id="feeds-list"></ul>
      </section>

      <section class="mt-5">
        <h2>${i18next.t('posts')}</h2>
        <ul id="posts-list"></ul>
      </section>
    </section>
  `;

  const form = document.querySelector('#rss-form');
  const input = document.querySelector('#rss-url');

  input.addEventListener('input', (event) => {
    const currentValidationId = ++validationId;

    state.form.input = event.target.value;
    state.form.error = '';
    state.form.valid = false;
    state.loadingError = '';

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

    if (state.loading) {
      return;
    }

    const currentValidationId = ++validationId;

    validateUrl(state.form.input)
      .then((url) => {
        if (currentValidationId !== validationId) {
          return null;
        }

        return addFeed(url);
      })
      .catch((submitError) => {
        if (currentValidationId !== validationId) {
          return;
        }

        if (submitError.name === 'ValidationError') {
          state.form.error = submitError.message;
          state.form.valid = false;
        }
      })
      .finally(() => {
        if (currentValidationId !== validationId) {
          return;
        }

        render();
        input.focus();
      });
  });

  subscribe(state, render);
  render();
};

export default initView;
