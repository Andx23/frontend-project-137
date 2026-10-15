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
    },
  },
};

export default resources;
