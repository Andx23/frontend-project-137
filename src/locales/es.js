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
      duplicate: 'El RSS ya existe',
      parseError: 'El recurso no contiene un RSS válido',
      networkError: 'Error de red',
    },
    loading: 'Cargando feed...',
    success: 'RSS cargado correctamente',
    feeds: 'Feeds',
    posts: 'Posts',
    preview: {
      description: 'Objetivo: aprender a extraer del árbol los datos necesarios',
      close: 'Cerrar',
      readMore: 'Leer completo',
      button: 'Vista previa',
    },
  },
};

export default resources;
