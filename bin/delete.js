#!/usr/bin/env node
process.env.MEILI_URL = "http://localhost:7700";

import { deleteAll } from "../lib/indexData.js";
deleteAll();
