import { Modal } from 'bootstrap';
import { subscribe } from 'valtio/vanilla';
import {
  state,
  validateUrl,
  addFeed,
  selectPost,
  closePostPreview,
} from './model.js';
import { i18next } from './i18n.js';

let validationId = 0;
let previewModal;

const renderList = (container, items, createItem) => {
  container.replaceChildren();

  items.forEach((item) => {
    container.append(createItem(item));
  });
};

const isSafeUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

const render = () => {
  const input = document.querySelector('#rss-url');
  const error = document.querySelector('#rss-error');
  const button = document.querySelector('#rss-submit');
  const loading = document.querySelector('#rss-loading');
  const loadingError = document.querySelector('#rss-load-error');
  const feedsList = document.querySelector('#feeds-list');
  const postsList = document.querySelector('#posts-list');
  const previewTitle = document.querySelector('#post-preview-title');
  const previewDescription = document.querySelector('#post-preview-description');
  const previewLink = document.querySelector('#post-preview-link');

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

  loading.textContent = state.loading ? i18next.t('loading') : '';

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
    const title = document.createElement('span');
    const previewButton = document.createElement('button');

    title.textContent = post.title;
    title.classList.add(post.read ? 'fw-normal' : 'fw-bold');

    if (isSafeUrl(post.link)) {
      const link = document.createElement('a');

      link.href = new URL(post.link).href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = post.read ? 'fw-normal' : 'fw-bold';
      link.textContent = post.title;
      item.append(link);
    } else {
      item.append(title);
    }

    previewButton.type = 'button';
    previewButton.className = 'btn btn-outline-primary btn-sm ms-2';
    previewButton.textContent = 'Vista previa';

    previewButton.addEventListener('click', () => {
      selectPost(post.id);
      previewModal.show();
    });

    item.append(previewButton);

    return item;
  });

  const selectedPost = state.selectedPost;

  previewTitle.textContent = selectedPost?.title || '';
  previewDescription.textContent = selectedPost?.description || '';

  if (selectedPost && isSafeUrl(selectedPost.link)) {
    previewLink.href = new URL(selectedPost.link).href;
    previewLink.classList.remove('disabled');
    previewLink.removeAttribute('aria-disabled');
  } else {
    previewLink.removeAttribute('href');
    previewLink.classList.add('disabled');
    previewLink.setAttribute('aria-disabled', 'true');
  }
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

    <div
      class="modal fade"
      id="post-preview-modal"
      tabindex="-1"
      aria-labelledby="post-preview-title"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="post-preview-title"></h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body" id="post-preview-description"></div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
            <a
              id="post-preview-link"
              class="btn btn-primary disabled"
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled="true"
            >
              Leer completo
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = document.querySelector('#rss-form');
  const input = document.querySelector('#rss-url');
  const modalElement = document.querySelector('#post-preview-modal');

  previewModal = new Modal(modalElement);

  modalElement.addEventListener('hidden.bs.modal', () => {
    closePostPreview();
  });

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
