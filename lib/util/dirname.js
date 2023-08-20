import path from "path";
import { fileURLToPath } from "url";

export default function(url) {
  return { __dirname: path.dirname(fileURLToPath(url)) };
};
