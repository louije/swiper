import "dotenv/config";
import express from "express";
import ejs from "ejs";
import dirname from "./lib/util/dirname.js";

const { __dirname } = dirname(import.meta.url);

import { search, command } from "./lib/search.js";
import { buildAll } from "./lib/indexData.js";
import { setup } from "./lib/setup.js";

const app = express();
app.set("view engine", "ejs");

app.get("/", (request, response) => {
  const mapkitToken = process.env.MAPKIT_TOKEN
  const params = { mapkitToken };
  response.render("index", params);
});

app.get("/data/setup", (request, response) => {
  setup();
  response.send("...setup...");
});

app.get("/data/reindex", (request, response) => {
  buildAll();
  response.send("...Reindexing...");
});

app.get("/console", async (request, response) => {
  const results = await command(request.query);
  response.send(`<pre>${JSON.stringify(results, null, 2)}</pre>`);
});

app.get("/search/", async (request, response) => {
  const q = request.query.q;
  const coords = request.query.coords;
  let lat, lng;
  if (coords) {
    [lat, lng] = coords.split(",");
  }
  const options = (lat && lng) ? { lat, lng } : {};
  const { results, error } = await search(q, options);
    
  response.json({ results, error });
});

app.use(express.static("public"));

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
