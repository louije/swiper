import { downloadDatasets } from "../lib/downloadDatasets.js";
import { prepareData } from "../lib/prepareData.js";
import { reindex } from "../lib/indexData.js";

export async function setup() {
  console.log("*** STEP 1. Downloading new datasets");
  await downloadDatasets();
  console.log("*** Data downloded.\n");

  console.log("*** STEP 2. Normalizing data");
  await prepareData();
  console.log("*** Normalization done.\n");

  console.log("*** STEP 3. Indexing data");
  await reindex();
}
