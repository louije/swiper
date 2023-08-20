import { join } from "path";
import dirname from "./util/dirname.js";
import fs from "fs";
import axios from "axios";

const { __dirname } = dirname(import.meta.url);
const datasetID = "6233723c2c1e4a54af2f6b2d";

export async function downloadDatasets() {
  const url = `https://www.data.gouv.fr/api/1/datasets/${datasetID}/`;

  const { data } = await axios.get(url);

  const structuresURL = findResource(data, /^structures-inclusion.*json$/);
  const servicesURL = findResource(data, /^services-inclusion.*json$/);

  const { data: structures } = await axios.get(structuresURL);
  fs.writeFileSync(join(__dirname, `../data/${fileNameFromURL(structuresURL)}`), JSON.stringify(structures));
  
  const { data: services } = await axios.get(servicesURL);
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
