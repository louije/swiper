import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const datasetID = "6233723c2c1e4a54af2f6b2d";

export async function downloadDatasets() {
  const url = `https://www.data.gouv.fr/api/1/datasets/${datasetID}/`;

  const { data } = await axios.get(url);

  const structuresURL = findResource(data, /^structures-inclusion.*json$/);
  const servicesURL = findResource(data, /^services-inclusion.*json$/);

  const { data: structures } = await axios.get(structuresURL);
  const { data: services } = await axios.get(servicesURL);

  fs.writeFileSync(join(__dirname, `../data/${fileNameFromURL(structuresURL)}`), JSON.stringify(structures));
  fs.writeFileSync(join(__dirname, `../data/${fileNameFromURL(servicesURL)}`), JSON.stringify(services));
}

function findResource(data, key) {
  const resources = data.resources;
  const res = resources.find(r => r.title.match(key));
  return res.url;
}

function fileNameFromURL(url) {
  return url.split("/").pop();
}
