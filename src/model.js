

import { proxy } from 'valtio/vanilla';
import * as yup from 'yup';
import fetchRss from './api.js';
import parseRss from './parser.js';

const UPDATE_INTERVAL = 5000;

yup.setLocale({
  mixed: {
    required: () => 'required',
  },
  string: {
    url: () => 'invalidUrl',
  },
});

const createModel = () => {
  const state = proxy({
    feeds: [],
    posts: [],
    selectedPost: null,
    form: {
      input: '',
      error: '',
      valid: false,
    },
    loading: false,
    loadingError: '',
    successMessage: '',
  });

  const urlSchema = yup.string()
    .required()
    .url();

  const validateUrl = (url) => urlSchema
    .validate(url)
    .then((validatedUrl) => {
      const exists = state.feeds.some(
        (feed) => feed.url === validatedUrl,
      );

      if (exists) {
        throw new yup.ValidationError('duplicate');
      }

      return validatedUrl;
    });

  const addNewPosts = (feed, parsedFeed) => {
    const existingLinks = new Set(
      state.posts
        .filter((post) => post.feedId === feed.id)
        .map((post) => post.link),
    );

    const newPosts = parsedFeed.posts
      .filter((post) => {
        if (existingLinks.has(post.link)) {
          return false;
        }

        existingLinks.add(post.link);
        return true;
      })
      .map((post) => ({
        id: crypto.randomUUID(),
        feedId: feed.id,
        title: post.title,
        description: post.description || '',
        link: post.link,
        read: false,
      }));

    state.posts.push(...newPosts);
  };

  const selectPost = (postId) => {
    const post = state.posts.find((item) => item.id === postId);

    if (!post) {
      return;
    }

    post.read = true;
    state.selectedPost = post;
  };

  const closePostPreview = () => {
    state.selectedPost = null;
  };

  const scheduleFeedUpdate = (feed) => {
    setTimeout(() => {
      fetchRss(feed.url)
        .then((feedData) => parseRss(feedData))
        .then((parsedFeed) => {
          addNewPosts(feed, parsedFeed);
        })
        .catch(() => {
          // Se conservan las publicaciones si falla una actualización.
        })
        .finally(() => {
          scheduleFeedUpdate(feed);
        });
    }, UPDATE_INTERVAL);
  };

  const addFeed = (url) => {
    state.loading = true;
    state.loadingError = '';
    state.successMessage = '';

    return fetchRss(url)
      .then((feedData) => parseRss(feedData))
      .then((parsedFeed) => {
        const feedId = crypto.randomUUID();

        const feed = {
          id: feedId,
          url,
          title: parsedFeed.title,
          description: parsedFeed.description,
        };

        state.feeds.push(feed);
        addNewPosts(feed, parsedFeed);

        state.form.input = '';
        state.form.error = '';
        state.form.valid = false;
        state.successMessage = 'success';

        scheduleFeedUpdate(feed);
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

  return {
    state,
    validateUrl,
    addFeed,
    selectPost,
    closePostPreview,
  };
};

export default createModel;
