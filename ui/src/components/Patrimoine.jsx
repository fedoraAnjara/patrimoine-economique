import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import '../assets/Patrimoine.css'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Patrimoine = () => {
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [jour, setJour] = useState(1);
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Valeur du Patrimoine",
        data: [],
        backgroundColor: "rgba(160, 126, 13, 0.2)",
        borderColor: "#a07e0d",
        borderWidth: 2,
        tension: 0.4,  // Pour lisser la ligne
        fill: true,    // Remplir la zone sous la courbe
        pointRadius: 0, // Supprimer les points
        pointHoverRadius: 0, // Supprimer les points au survol
      },
    ],
  });
  
  const [resultat, setResultat] = useState('');

  const handleCalculate = async () => {
    if (dateFin) {
      const date = new Date(dateFin);
      if (isNaN(date.getTime())) {
        setResultat('Format de Date non valide!');
        return;
      }
      
      try {
        const response = await fetch(`https://patrimoine-economique-backend-0yha.onrender.com/patrimoine/${date.toISOString().split('T')[0]}`);
        const result = await response.json();
        
        if (result.valeurPatrimoine !== undefined) {
          // Arrondir à deux chiffres après la virgule
          const valeurArrondie = parseFloat(result.valeurPatrimoine).toFixed(2);
          setResultat(`La valeur du patrimoine à la date sélectionnée est de ${valeurArrondie} Ar`);
        } else {
          setResultat('Erreur dans le calcul du patrimoine.');
        }
      } catch (error) {
        console.error('Erreur lors du calcul du patrimoine:', error);
        setResultat('Erreur lors du calcul du patrimoine.');
      }
    } else {
      setResultat('Date de fin non définie');
    }
  };

  const handleGetValeur = async () => {
    try {
      const response = await fetch("https://patrimoine-economique-backend-0yha.onrender.com/patrimoine/range", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateDebut, dateFin, jour }),
      });
      const result = await response.json();
      console.log("Données reçues:", result);

      const labels = Object.keys(result.data);
      const values = Object.values(result.data);

      const chartData = {
        labels,
        datasets: [
          {
            label: "Valeur du Patrimoine",
            data: values,
            backgroundColor: "rgba(160, 126, 13, 0.2)",
            borderColor: "#a07e0d",
            borderWidth: 2,
            tension: 0.4, // Pour lisser la ligne
            fill: true,
            pointRadius: 0,  // Supprimer les points
            pointHoverRadius: 0,  // Supprimer les points au survol
          },
        ],
      };

      setData(chartData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  return (
    <div className="patrimoine-container">
      <h2 className="patrimoine-header">Graphique du Patrimoine</h2>
      <div className="date-picker-container">
        <DatePicker
          selected={dateDebut}
          onChange={(date) => setDateDebut(date)}
          className="date-picker"
        />
        <DatePicker
          selected={dateFin}
          onChange={(date) => setDateFin(date)}
          className="date-picker"
        />
        <select
          value={jour}
          onChange={(e) => setJour(e.target.value)}
          className="select-day"
        >
          {[...Array(31).keys()].map((day) => (
            <option key={day + 1} value={day + 1}>
              {day + 1}
            </option>
          ))}
        </select>
      </div>
      {/* Button to calculate patrimoine */}
      <button className="btn-submit" onClick={handleCalculate}>
        Calculer le patrimoine
      </button>

      {/* Display patrimoine result in input with placeholder */}
      <input
        type="text"
        value={resultat}
        readOnly
        placeholder="Valeur du patrimoine"
        className="resultat-input"
      />

      <button className="btn-submit" onClick={handleGetValeur}>
        Valider
      </button>
      <div className="chart-container">
        <Line
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.dataset.label}: ${context.raw}`;
                  },
                },
              },
            },
            scales: {
              x: {
                stacked: false,
              },
              y: {
                stacked: false,
              },
            },
          }}
        />
      </div>
      <Link to="/" className="btn-return">
        Retourner à l'accueil
      </Link>
    </div>
  );
};

export default Patrimoine;
