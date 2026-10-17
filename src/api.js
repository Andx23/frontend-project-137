import axios from 'axios';

const fetchRss = (url) => axios
  .get('https://api.rss2json.com/v1/api.json', {
    params: {
      rss_url: url,
    },
  })
  .then((response) => {
    if (response.data.status !== 'ok') {
      throw new Error('networkError');
    }

    return response.data;
  });

export default fetchRss;
