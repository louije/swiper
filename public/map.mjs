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
      clusteringIdentifier: "cluster" // code_postal is too precise, there's still overlap
    });
    return annotation;
  }
  zoomOnAnnotations() {
    this.instance.showItems(this.annotations);
  }

}