
import axios from 'axios';

const fetchRss = (url) => axios
  .get('https://allorigins.hexlet.app/get', {
    params: {
      url,
      disableCache: true,
    },
  })
  .then((response) => {
    const { data } = response;

    if (typeof data?.contents === 'string') {
      return data.contents;
    }

    throw new Error('networkError');
  });

export default fetchRss;
