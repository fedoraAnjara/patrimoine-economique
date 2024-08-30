import { readFile, writeFile } from "../data/index.js";
import Patrimoine from "../models/Patrimoine.js";
import Personne from "../models/Personne.js";
import Flux from "../models/possessions/Flux.js";
import Possession from "../models/possessions/Possession.js";

export default async function getValeurPatrimoine(date) {
  const possesseur = new Personne("John Doe");
  const possessionList = [];

  const response = await readFile("../data/data.json");
  const data = response.data;
  const possessions = data[1].data.possessions;

  for (const possession of possessions) {
    if (possession.jour == undefined) {
      possessionList.push(
        new Possession(
          possesseur,
          possession.libelle,
          possession.valeur,
          new Date(possession.dateDebut),
          possession.dateFin,
          possession.tauxAmortissement,
        ),
      );
    } else {
      possessionList.push(
        new Flux(
          possesseur,
          possession.libelle,
          possession.valeur,
          new Date(possession.dateDebut),
          possession.dateFin,
          possession.tauxAmortissement,
          possession.jour,
        ),
      );
    }
  }

  const patrimoine = new Patrimoine(possesseur, possessionList);
  return patrimoine.getValeur(date);
}