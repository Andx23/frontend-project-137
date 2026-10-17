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
      invalidUrl: 'Debes ingresar una URL válida',
      duplicate: 'El RSS ya existe',
      parseError: 'El recurso no contiene un RSS valido',
      networkError: 'Error de red',
    },
    loading: 'Cargando feed...',
    success: 'El RSS se cargó correctamente',
    feeds: 'Fuentes',
    posts: 'Publicaciones',
    preview: {
      description: 'Objetivo: aprender a extraer del árbol los datos necesarios',
      close: 'Cerrar',
      readMore: 'Leer completo',
      button: 'Vista previa',
    },
  },
};

export default resources;
