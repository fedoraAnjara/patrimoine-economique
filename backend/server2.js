import express from "express";
import cors from "cors";
import getValeurPatrimoine from "./getValeurPatrimoine.js";
import getRange from "./getRange.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3003;
app.use(express.json());
app.use(cors());


app.post("/patrimoine/range", (req, res) => {
  res.set({
    "Content-Type": "application/json",
  });
  getRange(req.body)
    .then((result) => res.status(200).send({ data: result }))
    .catch((err) => res.status(400).send({ status: "failed", error: err }));
});

//Update value  
app.get("/patrimoine/:date", (req, res) => {
  const jour = req.params.date;
  res.set({
    "Content-Type": "application/json",
  });
  getValeurPatrimoine(new Date(jour))
    .then((result) => {
      // console.log("i was here");
      res.status(200).send({ valeurPatrimoine: result });
    })
    .catch((err) => res.status(400).send({ status: "failed", error: err }));
});

app.listen(port, () => {
  console.log(`Patrimoine app listening on port ${port}`);
});
