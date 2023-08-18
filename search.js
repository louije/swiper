import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({ host: process.env.MS_ADDRESS });

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
  return { nothing: null }
  // return await client.index("data").updateFilterableAttributes([
  //   "_geo",
  //   "code_postal",
  //   "commune",
  //   "thematiques",
  //   "typologie",
  // ]);
}
