#!/usr/bin/env node
process.env.MS_ADDRESS = "http://localhost:7700";

import { downloadDatasets } from "../lib/downloadDatasets.js";
import { prepareData } from "../lib/prepareData.js";
import { buildAll } from "../lib/indexData.js";

console.log("");
console.log("*** STEP 1. Download new datasets");
await downloadDatasets();
console.log("*** Data downloded.");
console.log("");

console.log("");
console.log("*** STEP 2. Normalize data for indexing");
await prepareData();
console.log("*** Normalization done.");
console.log("");

console.log("");
console.log("*** STEP 3. Index data");
await buildAll();
