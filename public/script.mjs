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
    const address = form.querySelector("[name=address]");
    
    form.addEventListener("submit", this.submit.bind(this));
    q.addEventListener("input", this.submit.bind(this));
    address.addEventListener("input", this.submit.bind(this));
  }
  async submit(event) {
    event.preventDefault();
    const form = document.querySelector(".Form");
    const data = new FormData(form);
    const query = data.get("q");
    const address = data.get("address");
    if (!query || query.trim().length === 0) { return; }

    this.search(query, address);
  }
  async search(query, address) {
    const req = `/search?q=${encodeURIComponent(query)}&address=${encodeURIComponent(address)}`;
    const res = await fetch(req);
    const { results, error } = await res.json();
    if (error) {
      console.error("Server error:", error);
      return;
    }
    this.render(results);
  }
  render(data) {
    const items = data.hits.map(h => this.template(h));
    const results = document.querySelector(".Results");
    results.innerHTML = items.join(" ");
  }
  template(hit) {
    let presentation = (hit.presentation_resume && hit.presentation_resume.trim.length) ? hit.presentation_resume : hit.presentation_detail;
    let link = (hit.lien_source) ? `<a href="${hit.lien_source}">${hit.nom}</a>` : hit.nom;
    return `
      <details class="Item">
        <summary>
          <h3>
            ${link}
          </h3>
        </summary>
        <p class="Address">${hit.address || ""}  ${hit.commune || ""}</p>
        <p class="Presentation">${presentation || ""}</p>
      </details>
    `;
  }
}