import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import getValeurPatrimoine from "./getValeurPatrimoine.js";
import getRange from "./getRange.js";
import Possession from "../models/possessions/Possession.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const filePath = path.join(__dirname, "data/data.json");

app.use(express.json());
app.use(cors());

// Helper functions for reading and writing JSON data
async function readData() {
  try {
    const data = await fs.readFile(filePath, { encoding: "utf8" });
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

async function writeData(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), { encoding: "utf8" });
    console.log("Données écrites avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'écriture des données :", error);
    throw error;
  }
}

// 1. GET /possession: Get Possession list
app.get("/possession", async (req, res) => {
  try {
    const possessions = await readData();
    res.json(possessions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des possessions." });
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
    res.status(500).json({ error: "Erreur lors de la création de la possession." });
  }
});

// 3. PUT /possession/:libelle: Update Possession by libelle
app.put("/possession/:libelle", async (req, res) => {
  try {
    const { libelle } = req.params;
    const data = await readData();
    const patrimoineData = data.find((item) => item.model === "Patrimoine");

    if (patrimoineData?.data?.possessions) {
      const possession = patrimoineData.data.possessions.find((p) => p.libelle === libelle);

      if (possession) {
        possession.libelle = req.body.libelle || possession.libelle;
        possession.dateFin = req.body.dateFin ? new Date(req.body.dateFin) : possession.dateFin;

        await writeData(data);
        res.json(possession);
      } else {
        res.status(404).json({ error: "Possession non trouvée." });
      }
    } else {
      res.status(404).json({ error: "Aucune possession trouvée." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de la possession." });
  }
});

// 4. POST /possession/:libelle/close: Close Possession by setting dateFin to current Date
app.post("/possession/:libelle/close", async (req, res) => {
  try {
    const { libelle } = req.params;
    const data = await readData();
    const patrimoineData = data.find((item) => item.model === "Patrimoine");

    if (patrimoineData?.data?.possessions) {
      const possession = patrimoineData.data.possessions.find((p) => p.libelle === libelle);

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
    res.status(500).json({ error: "Erreur lors de la fermeture de la possession." });
  }
});

// 5. POST /patrimoine/range: Get Patrimoine Range
app.post("/patrimoine/range", (req, res) => {
  res.set({ "Content-Type": "application/json" });
  getRange(req.body)
    .then((result) => res.status(200).send({ data: result }))
    .catch((err) => res.status(400).send({ status: "failed", error: err }));
});

// 6. GET /patrimoine/:date: Get Patrimoine by Date
app.get("/patrimoine/:date", (req, res) => {
  const jour = req.params.date;
  res.set({ "Content-Type": "application/json" });
  getValeurPatrimoine(new Date(jour))
    .then((result) => res.status(200).send({ valeurPatrimoine: result }))
    .catch((err) => res.status(400).send({ status: "failed", error: err }));
});

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
