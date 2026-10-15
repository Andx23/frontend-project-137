import axios from 'axios';

const fetchRss = (url) => axios
  .get('https://api.allorigins.win/get', {
    params: {
      url,
      disableCache: true,
    },
  })
  .then((response) => response.data.contents);

export default fetchRss;
