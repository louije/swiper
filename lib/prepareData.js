import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { glob } from "glob";

export function prepareData() {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const serviceFiles = glob.sync(join(__dirname, "../data/services-inclusion-*.json")).sort().reverse();
  const structureFiles = glob.sync(join(__dirname, "../data/structures-inclusion-*.json")).sort().reverse();
  const latestServices = serviceFiles[0];
  const latestStructures = structureFiles[0];
  const rawServices = JSON.parse(fs.readFileSync(latestServices));
  const rawStructures = JSON.parse(fs.readFileSync(latestStructures));

  // NORMALIZING

  const services = normalizeIDs(rawServices);
  const structures = normalizeGeo(normalizeIDs(rawStructures));

  // NESTING

  // Create a dictionary from services.json
  let serviceDict = {};
  let combined = [...structures];

  services.forEach(service => {
    let key = service._di_structure_surrogate_id;
    
    const s = Object.keys(service).reduce((obj, k) => {
      obj[`s_${k}`] = service[k];
      return obj;
    }, {});

    if (key in serviceDict) {
      serviceDict[key].push(s);
    } else {
      serviceDict[key] = [s];
    }
  });

  // Merge the data
  combined.forEach(structure => {
    let key = structure._di_surrogate_id;
    structure.services = serviceDict[key] || [];
  });

  // WRITING

  fs.writeFileSync(join(__dirname, "../data/services.json"), JSON.stringify(services));
  fs.writeFileSync(join(__dirname, "../data/structures.json"), JSON.stringify(structures));
  fs.writeFileSync(join(__dirname, "../data/combined-data-inclusion.json"), JSON.stringify(combined));
}


function normalizeIDs(data) {
  return data.map(obj => {
    let newObj = {};
    for (let key in obj) {
      newObj[key] = key.endsWith("_id") ? obj[key].replace(/\W/g, "-") : obj[key];
    }
    return newObj;
  });
}

function normalizeGeo(data) {
  return data.map(obj => {
    if (obj.latitude && obj.longitude) {
      obj._geo = { lat: obj.latitude, lng: obj.longitude };
      delete obj.latitude;
      delete obj.longitude;
    }
    return obj;
  });
}
