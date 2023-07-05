import { MeiliSearch } from "meilisearch";
import data from "./data/combined-data-inclusion.json" assert { type: 'json' };

export async function buildAll() {
  const client = new MeiliSearch({ host: "http://localhost:7700", apiKey: process.env.MS_ADMIN_KEY });
  
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

//   await client.index("data").updateFilterableAttributes([
//     "_geo", "typologie", "source", "services.srv_types", "services.srv_thematiques", "services.srv_source", "services.srv_modes_accueil"
//   ]);
// 
//   await client.index("structures").updateSearchableAttributes([
//     "labels_autres",
//     "labels_nationaux",
//     "nom",
//     "presentation_detail",
//     "presentation_resume",
//     "site_web",
//     "thematiques",
//     "typologie",  
//     "services.srv_modes_accueil",
//     "services.srv_modes_orientation_accompagnateur",
//     "services.srv_modes_orientation_beneficiaire",
//     "services.srv_nom",
//     "services.srv_pre_requis",
//     "services.srv_presentation_detail",
//     "services.srv_presentation_resume",
//     "services.srv_profils",
//     "services.srv_thematiques",
//     "services.srv_types",
//   ]);


  const index = await client.index("data").addDocuments(data);
  console.log("index", index);
    
  console.log("...indexing...");
  
  setInterval(async () => {
    const task = await client.getTask(index.taskUid);
    console.log(task);
  }, 2000);
}
