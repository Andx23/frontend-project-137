
import { proxy } from 'valtio/vanilla';
import * as yup from 'yup';
import fetchRss from './api.js';
import parseRss from './parser.js';

yup.setLocale({
  mixed: {
    required: () => 'required',
  },
  string: {
    url: () => 'invalidUrl',
  },
});

const state = proxy({
  feeds: [],
  posts: [],
  form: {
    input: '',
    error: '',
    valid: false,
  },
  loading: false,
  loadingError: '',
});

const urlSchema = yup.string()
  .required()
  .url();

const validateUrl = (url) => urlSchema
  .validate(url)
  .then((validatedUrl) => {
    const exists = state.feeds.some((feed) => feed.url === validatedUrl);

    if (exists) {
      throw new yup.ValidationError('duplicate');
    }

    return validatedUrl;
  });

const addFeed = (url) => {
  state.loading = true;
  state.loadingError = '';

  return fetchRss(url)
    .then((xmlText) => parseRss(xmlText))
    .then((parsedFeed) => {
      const feedId = crypto.randomUUID();

      const feed = {
        id: feedId,
        url,
        title: parsedFeed.title,
        description: parsedFeed.description,
      };

      const posts = parsedFeed.posts.map((post) => ({
        id: crypto.randomUUID(),
        feedId,
        title: post.title,
        link: post.link,
      }));

      state.feeds.push(feed);
      state.posts.push(...posts);
      state.form.input = '';
      state.form.error = '';
      state.form.valid = false;
    })
    .catch((error) => {
      state.loadingError = error.message === 'parseError'
        ? 'parseError'
        : 'networkError';

      throw error;
    })
    .finally(() => {
      state.loading = false;
    });
};

export { state, validateUrl, addFeed };
