import getValeurPatrimoine from "./getValeurPatrimoine.js";

export default async function getRange(range) {
  const dateActuelle = new Date(range.dateDebut);
  const dateFin = new Date(range.dateFin);
  dateActuelle.setDate(parseInt(range.jour));
  dateFin.setDate(parseInt(range.jour));
  const result = {};

  while (dateActuelle.toString() != dateFin.toString()) {
    const valeur = await getValeurPatrimoine(dateActuelle);
    const key = `${dateActuelle.getFullYear()}-${dateActuelle.getMonth() + 1}-${dateActuelle.getDate()}`;
    // console.log(new Date(key).getDate());
    result[key] = valeur;
    dateActuelle.setMonth(dateActuelle.getMonth() + 1);
  }

  return result;
}
