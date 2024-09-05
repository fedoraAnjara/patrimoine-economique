import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  BarElement,
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
        backgroundColor: "#a07e0d",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  });

  const handleGetValeur = async () => {
    try {
      const response = await fetch("http://localhost:3000/patrimoine/range", {
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
            backgroundColor: "#a07e0d",
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 1,
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
      <button className="btn-submit" onClick={handleGetValeur}>
        Valider
      </button>
      <div className="chart-container">
        <Bar
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
                stacked: true,
              },
              y: {
                stacked: true,
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
