const parseRss = (feedData) => {
  if (typeof feedData === 'string') {
    const parser = new DOMParser();
    const document = parser.parseFromString(feedData, 'application/xml');
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
        const postDescription = item.querySelector('description')?.textContent?.trim() || '';

        if (!postTitle || !link) {
          return null;
        }

        return {
          title: postTitle,
          description: postDescription,
          link,
        };
      })
      .filter(Boolean);

    return { title, description, posts };
  }

  if (!feedData || feedData.status !== 'ok' || !feedData.feed) {
    throw new Error('parseError');
  }

  const title = feedData.feed.title?.trim();
  const description = feedData.feed.description?.trim() || '';
  const posts = (feedData.items || [])
    .map((item) => ({
      title: item.title?.trim(),
      description: item.description || item.content || '',
      link: item.link?.trim(),
    }))
    .filter((post) => post.title && post.link);

  if (!title) {
    throw new Error('parseError');
  }

  return {
    title,
    description,
    posts,
  };
};

export default parseRss;
