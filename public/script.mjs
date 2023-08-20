import Map from "./map.mjs";

document.addEventListener("DOMContentLoaded", () => {
  new App();
});

class App {
  constructor() {
    this.handlers();
    this.map = new Map();
    this.map.setToFrance();
    this.debouncedSearch = this._debounce(this.search, 500);
  }
  handlers() {
    const form = document.querySelector(".Form");
    const q = form.querySelector("[name=q]");
    const address = form.querySelector("[name=address]");
    const results = document.querySelector(".Results");

    form.addEventListener("submit", this.submit.bind(this));
    q.addEventListener("input", this.submit.bind(this));
    address.addEventListener("input", this.submit.bind(this));
    results.addEventListener("click", this.clickResult.bind(this));
  }
  async submit(event) {
    event.preventDefault();
    const form = document.querySelector(".Form");
    const data = new FormData(form);
    const query = data.get("q");
    const address = data.get("address");
    if (!query || query.trim().length === 0) {
      return;
    }

    this.debouncedSearch(query, address);
  }
  async search(query, address) {
    console.log("search", query, address);
    const req = `/search?q=${encodeURIComponent(
      query
    )}&address=${encodeURIComponent(address)}`;
    const res = await fetch(req);
    const { results, error } = await res.json();
    if (error) {
      console.error("Server error:", error);
      return;
    }
    const structures = results.hits;
    this.map.clearAnnotations();
    this.render(structures);
    this.map.addAnnotations(structures);
    this.map.zoomOnAnnotations();
  }
  render(structures) {
    const items = structures.map((h) => this.template(h));
    const results = document.querySelector(".Results");
    results.innerHTML = items.join(" ");
  }
  template(hit) {
    let presentation =
      (hit.presentation_resume && hit.presentation_resume.trim.length
        ? hit.presentation_resume
        : hit.presentation_detail) || "";
    return `
      <tr class="Item" data-resultid="${hit._di_surrogate_id}">
        <td>
          <h4 class="Name">${hit.nom}</h4>
          <p class="Address">${hit.address || ""} ${hit.commune || ""}</p>
          <p class="Presentation">${presentation}</p>
        </td>
      </tr>
    `;
  }
  clickResult(event) {
    const result = event.target.closest(".Item");
    if (!result) {
      return;
    }
    const id = result.dataset.resultid;
    this.map.selectAnnotation(id);
  }
  _debounce(fn, delay) {
    let timer = null;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }
}
