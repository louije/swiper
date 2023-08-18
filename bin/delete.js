#!/usr/bin/env node
process.env.MS_ADDRESS = "http://localhost:7700";

import { deleteAll } from "../lib/indexData.js";
deleteAll();
