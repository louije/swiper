document.addEventListener("DOMContentLoaded", () => {
  new App();
});

class App {
  constructor() {
    this.handlers()
  }
  handlers() {
    const form = document.querySelector(".Form");
    const q = form.querySelector("[name=q]");
    const place = form.querySelector("[name=place]");
    
    form.addEventListener("submit", this.submit.bind(this));
    q.addEventListener("input", this.submit.bind(this));
    place.addEventListener("input", this.submit.bind(this));
  }
  async submit(event) {
    event.preventDefault();
    const form = document.querySelector(".Form");
    const data = new FormData(form);
    const query = data.get("q");
    if (!query || query.trim().length === 0) { return; }

    const place = data.get("place");
    const [lat, lng] = place.split(",");

    this.search(query, { lat, lng });
  }
  async search(query, { lat, lng }) {
    const req = `/search?q=${encodeURIComponent(query)}&coords=${lat},${lng}`;
    const results = await fetch(req);
    const data = await results.json();
    this.render(data);
  }
  render(data) {
    const items = data.hits.map(h => this.template(h));
    const results = document.querySelector(".Results");
    results.innerHTML = items.join(" ");
  }
  template(hit) {
    let presentation = (hit.presentation_resume && hit.presentation_resume.trim.length) ? hit.presentation_resume : hit.presentation_detail;
    return `
      <li>
        <h3>${hit.nom}</h3>
        <p class="Presentation">${presentation || ""}</p>
        <p class="Address">${hit.address || ""}  ${hit.commune || ""}</p>
      </li>
    `;
  }
}