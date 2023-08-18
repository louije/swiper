import fs from "node:fs/promises";
import { MeiliSearch } from "meilisearch";

export async function deleteAll() {
  try {
    const client = new MeiliSearch({ host: process.env.MS_ADDRESS });
    await client.deleteIndex("data");
    console.log("Index deleted.")
  } catch (e) {
    console.error("Cannot delete index", e);
    return;
  }
}

export async function buildAll() {
  let data;
  try {
    const path = "./data/combined-data-inclusion.json";
    const fileData = await fs.readFile(path);
    data = JSON.parse(fileData);
  } catch (e) {
    console.error("Coulnd't read data file", e);
  }
  if (!data) {
    return;
  }
  try {
    const client = new MeiliSearch({ host: process.env.MS_ADDRESS });
    await client.createIndex("data", { primaryKey: "_di_surrogate_id" });
    await client.index("data").updateFilterableAttributes([
      "_geo",
      "code_postal",
      "commune",
      "thematiques",
      "typologie",
    ]);
    await client.index("data").updateDisplayedAttributes([
      "nom",
      "presentation_detail",
      "presentation_resume",
      "_geo",
      "accessibilite",
      "adresse",
      "code_postal",
      "commune",
      "complement_adresse",
      "courriel",
      "date_maj",
      "labels_autres",
      "labels_nationaux",
      "lien_source",
      "site_web",
      "telephone",
      "thematiques",
      "typologie",
    ]);
    const index = await client.index("data").addDocuments(data);

    console.log("...indexing...");
    
    let lastTaskState = null;
    
    const interval = setInterval(async () => {
      const task = await client.getTask(index.taskUid);
      switch (task.status) {
        // enqueued, processing, succeeded, failed, and canceled
        case "enqueued":
        case "processing":
          if (lastTaskState !== task.status) {
            lastTaskState = task.status;
            console.log(`*** ${task.status}`);
          } else {
            process.stdout.write(".");
          }
          break;
        case "succeeded":
          console.log("");
          console.log(`*** ${task.status}`);
          clearInterval(interval);
          break;
        case "failed":
        case "canceled":
          console.log("");
          console.log(task);
          clearInterval(interval);
          break;
      }      
    }, 1000);
    
  } catch (e) {
    console.error("Cannot run indexing task", e);
    return;
  }

}
