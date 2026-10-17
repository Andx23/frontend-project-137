import axios from 'axios';

const fetchRss = (url) => axios
  .get(url)
  .then((response) => response.data);

export default fetchRss;
