import Possession from "../models/possessions/Possession.js";
import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON path
const filePath = path.join(__dirname, "data/data.json");

app.use(cors());
app.use(express.json());

async function readData() {
  try {
    const data = await fs.readFile(filePath, { encoding: "utf8" });
    console.log("Contenu brut du fichier lu :", data);
    const parsedData = JSON.parse(data);

    if (!parsedData.possessions) {
      parsedData.possessions = [];
    }

    return parsedData;
  } catch (error) {
    console.error("Erreur lors de la lecture des données :", error);
    throw error;
  }
}

// Write data in JSON file
async function writeData(data) {
  console.log("Écriture des données dans le fichier...");
  console.log("Données à écrire :", JSON.stringify(data, null, 2));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), {
    encoding: "utf8",
  });
  console.log("Données écrites avec succès.");
}

// 1. GET /possession: Get Possession list
app.get("/possession", async (req, res) => {
  try {
    const possessions = await readData();
    res.json(possessions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des possessions." });
  }
});

// 2. POST /possession: Create Possession
app.post("/possession", async (req, res) => {
  try {
    const newPossession = new Possession(
      req.body.possesseur,
      req.body.libelle,
      req.body.valeur,
      new Date(req.body.dateDebut),
      req.body.dateFin ? new Date(req.body.dateFin) : null,
      req.body.tauxAmortissement
    );

    const data = await readData();

    const patrimoineData = data.find((item) => item.model === "Patrimoine");

    if (!patrimoineData) {
      return res.status(404).json({ error: "Modèle Patrimoine non trouvé." });
    }

    if (!patrimoineData.data.possessions) {
      patrimoineData.data.possessions = [];
    }

    patrimoineData.data.possessions.push(newPossession);
    await writeData(data);

    res.status(201).json(newPossession);
  } catch (error) {
    console.error("Erreur lors de la création de la possession :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la possession." });
  }
});

// 3. PUT /possession/:libelle: Update Possession by libelle
app.put("/possession/:libelle", async (req, res) => {
  try {
    const { libelle } = req.params;
    const data = await readData();

    // access to possessionsTable
    const patrimoineData = data.find((item) => item.model === "Patrimoine");

    if (
      patrimoineData &&
      patrimoineData.data &&
      patrimoineData.data.possessions
    ) {
      const possession = patrimoineData.data.possessions.find(
        (p) => p.libelle === libelle
      );

      if (possession) {
        // update POssession value
        possession.libelle = req.body.libelle || possession.libelle;
        possession.dateFin = req.body.dateFin
          ? new Date(req.body.dateFin)
          : possession.dateFin;

        await writeData(data);
        res.json(possession);
      } else {
        res.status(404).json({ error: "Possession non trouvée." });
      }
    } else {
      res.status(404).json({ error: "Aucune possession trouvée." });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la possession :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la possession." });
  }
});

// 4. POST /possession/:libelle/close: Close Possession by setting dateFin to current Date
app.post("/possession/:libelle/close", async (req, res) => {
  try {
    const { libelle } = req.params;
    const data = await readData();

    const patrimoineData = data.find((item) => item.model === "Patrimoine");

    if (
      patrimoineData &&
      patrimoineData.data &&
      patrimoineData.data.possessions
    ) {
      const possession = patrimoineData.data.possessions.find(
        (p) => p.libelle === libelle
      );

      if (possession) {
        possession.dateFin = new Date();
        await writeData(data);
        res.json(possession);
      } else {
        res.status(404).json({ error: "Possession non trouvée." });
      }
    } else {
      res.status(404).json({ error: "Aucune possession trouvée." });
    }
  } catch (error) {
    console.error("Erreur lors de la fermeture de la possession :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la fermeture de la possession." });
  }
});
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
