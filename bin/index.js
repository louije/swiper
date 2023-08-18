#!/usr/bin/env node
process.env.MEILI_URL = process.env.MEILI_URL || "http://localhost:7700";
import { buildAll } from "../lib/indexData.js";
buildAll();
