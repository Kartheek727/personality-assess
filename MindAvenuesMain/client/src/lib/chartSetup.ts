// src/lib/chartSetup.ts
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  // Register Chart.js components
  export const registerChartJs = () => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      LineElement, // Added for line charts
      PointElement, // Added for line chart points
      ArcElement, // For pie charts
      Title,
      Tooltip,
      Legend
    );
  };