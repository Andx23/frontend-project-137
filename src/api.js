import axios from 'axios';

const fetchRss = (url) => axios
  .get('https://allorigins.hexlet.app/get', {
    params: {
      url,
      disableCache: true,
    },
  })
  .then((response) => {
    if (!response.data || typeof response.data.contents !== 'string') {
      throw new Error('networkError');
    }

    return response.data.contents;
  });

export default fetchRss;
