import "dotenv/config";
import express from "express";

import { search } from "./lib/search.js";
import { reindex } from "./lib/indexData.js";
import { setup } from "./lib/setup.js";
import { geocode, getToken } from "./lib/mapkit.js";

const app = express();

app.use(express.static("public"));

app.get("/mapkit-token", (request, response) => {
  response.json({ token: getToken() });
});

app.get("/data/setup", (request, response) => {
  setup();
  response.send("...setup...");
});

app.get("/data/reindex", (request, response) => {
  reindex();
  response.send("...Reindexing...");
});

app.get("/search/", async (request, response) => {
  const q = request.query.q;
  const address = request.query.address;

  const { coordinate, error: geocodingError } = await geocode(address);

  const options = coordinate;
  const { results, error: searchError } = await search(q, options);
    
  response.json({ results, searchError, geocodingError });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
