import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({ host: "http://search:7700" });

export async function search(query, coords) {
  let options = {};
  if (coords && coords.lat && coords.lng) {
    options.filter = [`_geoRadius(${coords.lat}, ${coords.lng}, 10000)`];
  }
  try {
    const results = await client.index("data").search(query, options);
    return { results };
  } catch (error) {
    return { error };
  }
}

export async function command(query) {
  return await client.index("data").updateDisplayedAttributes([
  "nom",
  "presentation_detail",
  "presentation_resume",
  "_geo",
  "accessibilite",
  "adresse",
  "code_postal",
  "commune",
  "complement_adresse",
  "courriel",
  "date_maj",
  "labels_autres",
  "labels_nationaux",
  "lien_source",
  "site_web",
  "telephone",
  "thematiques",
  "typologie",
]);
}
