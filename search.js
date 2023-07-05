import { MeiliSearch } from "meilisearch";

const apiKey = process.env.MS_ADMIN_KEY;
const client = new MeiliSearch({ host: "http://localhost:7700", apiKey });

export async function search(query, coords) {
  let options = {};
  if (coords && coords.lat && coords.lng) {
    options.filter = [`_geoRadius(${coords.lat}, ${coords.lng}, 10000)`];
  }
  const results = await client.index("data").search(query, options);
  return results;
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
