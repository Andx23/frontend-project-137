import { proxy } from 'valtio/vanilla';
import * as yup from 'yup';

const state = proxy({
  feeds: [],
  form: {
    input: '',
    error: '',
    valid: false,
  },
});

const urlSchema = yup.string()
  .required('No puede estar vac\u00edo')
  .url('El enlace debe ser una URL v\u00e1lida');

const validateUrl = (url) => urlSchema
  .validate(url)
  .then((validatedUrl) => {
    const exists = state.feeds.some((feed) => feed.url === validatedUrl);

    if (exists) {
      throw new yup.ValidationError('Este feed ya existe');
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
