export default class Map {
  constructor() {
    this.annotations = [];
    window.mapkit.init({
      authorizationCallback: function(done) {
        fetch("/mapkit-token")
          .then(res => res.json())
          .then(json => done(json.token));
      },
      language: "fr",
    });

    this.instance = new window.mapkit.Map("map");
  }

  setToFrance() {
    const mapkit = window.mapkit;
    let center = new mapkit.Coordinate(47, 2.25),
    span = new mapkit.CoordinateSpan(10, 10),
    region = new mapkit.CoordinateRegion(center, span);
    this.instance.setRegionAnimated(region);
  }

  clearAnnotations() {
    this.annotations.forEach(a => this.instance.removeAnnotation(a));
  }
  clearPin() {
    this.instance.removeAnnotation(this.clickAnnotation);
    this.clickAnnotation = null;
  }
  addAnnotations(structures) {
    this.annotations = structures.map(s => this._createStructureAnnotation(s));
    this.annotations = this.annotations.filter(a => a); // filter empty elements
    this.annotations.forEach(a => this.instance.addAnnotation(a));
  }
  calloutDelegate() {
    function title(annotation) {
      let link;
      if (annotation.data.lien_source) {
        link = `<a class="AnnotationLink" href="${annotation.data.lien_source}" target="_blank">➡️</a>`;
      }
      return `
        <div class="AnnotationTitle">
          <h1>${annotation.title}</h1>
          ${link || ""}
        </div>
      `;
    }
    function presentation(annotation) {
      return annotation.subtitle ? `<div class="u-GradientContainer"><p class="AnnotationPrez">${annotation.subtitle}</p></div>` : "";
    }
    function contact(annotation) {
      let contactModes = [];
      if (annotation.data.telephone) {
        contactModes.push(`<a href="tel:${annotation.data.telephone}">${annotation.data.telephone}</a>`);
      }
      if (annotation.data.courriel) {
        contactModes.push(`<a href="mailto:${annotation.data.courriel}">${annotation.data.courriel}</a>`);
      }
      return contactModes.length > 0 ? `<p class="AnnotationContact">${contactModes.join(" / ")}</p>` : "";
    }

    return {
      calloutElementForAnnotation: (annotation) => {
        console.log(annotation, annotation.data);
        const html = `
          <div class="Annotation">
            ${title(annotation)}
            ${presentation(annotation)}
            ${contact(annotation)}
          </div>
        `
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        return doc.body.firstChild;
      },
    };
  }
  _createStructureAnnotation(structure) {
    const mapkit = window.mapkit;
  
    const { nom, lien_source, presentation_resume, presentation_detail, code_postal, courriel, telephone, _geo: { lat, lng } } = structure;
    if (!lat || !lng) { return; }

    const presentation = ((presentation_resume && presentation_resume.length > 0) ? presentation_resume : presentation_detail) || "";
    const loc = new mapkit.Coordinate(lat, lng);
    const annotation = new mapkit.MarkerAnnotation(loc, {
      title: nom,
      subtitle: presentation,
      glyphText: "ℹ︎",
      color: "#6a6af4",
      glyphColor: "white",
      clusteringIdentifier: "cluster", // code_postal is too precise, there's still overlap
      callout: this.calloutDelegate(),
      data: structure,
    });
    return annotation;
  }
  selectAnnotation(id) {
    const annotation = this.instance.annotations.find(a => a.data._di_surrogate_id === id);
    if (!annotation) {
      return;
    }
    this.instance.selectedAnnotation = annotation;
  }
  zoomOnAnnotations() {
    this.instance.showItems(this.annotations);
  }

}