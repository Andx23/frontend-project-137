import './style.css';

document.querySelector('#app').innerHTML = `
  <header class="bg-primary text-white py-4 mb-5">
    <div class="container">
      <h1 class="display-5">RSS Reader</h1>
      <p class="lead mb-0">Agrega tus fuentes RSS y consulta sus publicaciones favoritas.</p>
    </div>
  </header>

  <section class="container">
    <form id="rss-form">
      <div class="mb-3">
        <label for="rss-url" class="form-label">URL de la fuente RSS</label>
        <input
          id="rss-url"
          name="url"
          type="url"
          class="form-control"
          placeholder="https://example.com/feed.xml"
          required
        >
      </div>

      <button type="submit" class="btn btn-primary">
        Agregar
      </button>
    </form>
  </section>
`;
