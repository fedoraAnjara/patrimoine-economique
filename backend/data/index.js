import fs from "node:fs/promises";

async function readFile(path) {
  try {
    const data = await fs.readFile(path, { encoding: "utf8" });
    return {
      status: "OK",
      data: JSON.parse(data),
    };
  } catch (err) {
    return {
      status: "ERROR",
      error: err,
    };
  }
}

async function writeFile(path, data) {
  try {
    await fs.writeFile(path, JSON.stringify(data), {
      encoding: "utf8",
    });
    return {
      status: "OK",
    };
  } catch (err) {
    return {
      status: "ERROR",
      error: err,
    };
  }
}

export { readFile, writeFile };
/*
TODO:
react bootstrap
une page avec un tableau

liste de possession sous forme de tableau bootstrap
libelle, valeur, date debut - fin, taux amortissement, valeur final

liste valeur du patrimoine
date picker avec bouton valider qui permet de calculer le patrimoine

video qui presente comment ca marche
envoyer par mail avec le code source

data sous forme de json et persistance

*/
