
import { proxy } from 'valtio/vanilla';
import * as yup from 'yup';

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
  form: {
    input: '',
    error: '',
    valid: false,
  },
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
  state.feeds.push({ url });
  state.form.input = '';
  state.form.error = '';
  state.form.valid = false;
};

export { state, validateUrl, addFeed };
