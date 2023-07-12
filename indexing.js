import { MeiliSearch } from "meilisearch";
import data from "./data/combined-data-inclusion.json" assert { type: 'json' };

export async function deleteAll() {
  try {
    const client = new MeiliSearch({ host: "http://search:7700" });
    await client.deleteIndex("data");
    console.log("Index deleted.")
  } catch (e) {
    console.error("Cannot delete index", e);
    return;
  }
}

export async function buildAll() {
  try {
    const client = new MeiliSearch({ host: "http://search:7700" });
    await client.createIndex("data", { primaryKey: "_di_surrogate_id" });
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
            console.log(task)
          }
          break;
        case "succeeded":
        case "failed":
        case "canceled":
          console.log(task);
          clearInterval(interval);
          break;
      }      
    }, 2000);
    
  } catch (e) {
    console.error("Cannot run indexing task", e);
    return;
  }

}
