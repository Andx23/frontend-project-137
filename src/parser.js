const parseRss = (xmlText) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(xmlText, 'application/xml');

  const parserError = document.querySelector('parsererror');

  if (parserError) {
    throw new Error('parseError');
  }

  const channel = document.querySelector('channel');

  if (!channel) {
    throw new Error('parseError');
  }

  const title = channel.querySelector('title')?.textContent?.trim();
  const description = channel.querySelector('description')?.textContent?.trim();

  if (!title || !description) {
    throw new Error('parseError');
  }

  const posts = Array.from(channel.querySelectorAll('item'))
    .map((item) => {
      const postTitle = item.querySelector('title')?.textContent?.trim();
      const link = item.querySelector('link')?.textContent?.trim();

      if (!postTitle || !link) {
        return null;
      }

      return {
        title: postTitle,
        link,
      };
    })
    .filter(Boolean);

  return {
    title,
    description,
    posts,
  };
};

export default parseRss;
