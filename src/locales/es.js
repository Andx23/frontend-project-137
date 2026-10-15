
const resources = {
  translation: {
    title: 'RSS Reader',
    description: 'Agrega tus fuentes RSS y consulta sus publicaciones favoritas.',
    form: {
      label: 'RSS link',
      placeholder: 'https://example.com/feed.xml',
      submit: 'Añadir',
    },
    errors: {
      required: 'No puede estar vacío',
      invalidUrl: 'El enlace debe ser una URL válida',
      duplicate: 'Este feed ya existe',
      parseError: 'No se pudo interpretar el contenido del feed RSS. Verifica que el enlace corresponda a un feed válido.',
      networkError: 'No se pudo descargar el feed. Comprueba tu conexión e inténtalo de nuevo.',
    },
    loading: 'Cargando feed...',
    feeds: 'Feeds',
    posts: 'Posts',
  },
};

export default resources;

