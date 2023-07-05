import { MeiliSearch } from "meilisearch";
import structures from "./data/structures.json" assert { type: 'json' };
import services from "./data/services.json" assert { type: 'json' };

export async function buildAll() {
  const client = new MeiliSearch({ host: "http://localhost:7700", apiKey: process.env.MS_ADMIN_KEY });
  
  await client.createIndex("structures", { primaryKey: "_di_surrogate_id" });
  await client.index("structures").updateFilterableAttributes([
    "_geo", "typologie", "source"
  ]);
  await client.index("structures").updateDisplayedAttributes([
    "_di_adresse_surrogate_id",
    "_di_surrogate_id",
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
    "nom",
    "presentation_detail",
    "presentation_resume",
    "site_web",
    "telephone",
    "thematiques",
    "typologie",
  ]);
  await client.index("structures").updateSearchableAttributes([
    "labels_autres",
    "labels_nationaux",
    "nom",
    "presentation_detail",
    "presentation_resume",
    "site_web",
    "thematiques",
    "typologie",  
  ]);
  
  await client.createIndex("services", { primaryKey: "_di_surrogate_id" });
  await client.index("services").updateFilterableAttributes([
    "types", "modes_accueil", "source"
  ]);
  await client.index("services").updateDisplayedAttributes([
    "telephone",
    "_di_adresse_surrogate_id",
    "_di_structure_surrogate_id",
    "_di_surrogate_id",
    "adresse",
    "code_postal",
    "commune",
    "complement_adresse",
    "courriel",
    "formulaire_en_ligne",
    "frais_autres",
    "frais",
    "justificatifs",
    "lien_source",
    "modes_accueil",
    "modes_orientation_accompagnateur",
    "modes_orientation_beneficiaire",
    "nom",
    "pre_requis",
    "presentation_detail",
    "presentation_resume",
    "profils",
    "recurrence",
    "source",
    "structure_id",
    "thematiques",
    "types",
    "zone_diffusion_code",
    "zone_diffusion_nom",
    "zone_diffusion_type",
  ]);
  await client.index("services").updateSearchableAttributes([
    "modes_accueil",
    "modes_orientation_accompagnateur",
    "modes_orientation_beneficiaire",
    "nom",
    "pre_requis",
    "presentation_detail",
    "presentation_resume",
    "profils",
    "thematiques",
    "types",
  ]);

  const structuresIndex = await client.index("structures").addDocuments(structures);
  console.log("index structures", structuresIndex);
  
  const servicesIndex = await client.index("services").addDocuments(services);
  console.log("index services", servicesIndex);
  
  console.log("...indexing...");
  
  setInterval(async () => {
    const structuresTask = await client.getTask(structuresIndex.taskUid);
    console.log(structuresTask);
  
    const servicesTask = await client.getTask(servicesIndex.taskUid);
    console.log(servicesTask);
  }, 2000);
}
