import { MeiliSearch } from "meilisearch";

const apiKey = process.env.MEILI_MASTER_KEY;

export async function search(query, coords) {
  const client = new MeiliSearch({ host: process.env.MEILI_URL, apiKey });
  console.log("host", process.env.MEILI_URL, "client", client);

  let options = {};
  if (coords && coords.lat && coords.lng) {
    options.filter = [`_geoRadius(${coords.lat}, ${coords.lng}, 10000)`];
  }
  try {
    const results = await client.index("data").search(query, options);
    return { results };
  } catch (error) {
    console.error("Error while performing search:", error.stack);
    return { error };
  }
}

export async function command(query) {
  return { nothing: null }
  // return await client.index("data").updateFilterableAttributes([
  //   "_geo",
  //   "code_postal",
  //   "commune",
  //   "thematiques",
  //   "typologie",
  // ]);
}
