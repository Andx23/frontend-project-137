
import axios from 'axios';

const fetchRss = (url) => axios
  .get('https://api.allorigins.win/get', {
    params: {
      url,
      disableCache: true,
    },
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  })
  .then((response) => response.data.contents);

export default fetchRss;
