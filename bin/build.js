#!/usr/bin/env node
process.env.MEILI_URL = process.env.MEILI_URL || "http://localhost:7700";

import { setup } from "../lib/setup.js";
setup();