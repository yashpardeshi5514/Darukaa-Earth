import { useEffect, useState } from "react";

import {
  Activity,
  BarChart3,
  CalendarRange,
  Leaf,
  TrendingUp
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { Line } from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);


function AnalyticsChart({ siteId }) {
  const [analytics, setAnalytics] = useState([]);
  const [realBiodiversity, setRealBiodiversity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!siteId) {
      setAnalytics([]);
      setRealBiodiversity(null);
      return;
    }


    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");


        const token = localStorage.getItem("access_token");


        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/analytics/site/${siteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );


        const data = await response.json();


        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to load analytics"
          );
        }


        setAnalytics(data.analytics || []);
        setRealBiodiversity(data.real_biodiversity || null);

      } catch (err) {
        console.error("Analytics error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    fetchAnalytics();

  }, [siteId]);


  if (!siteId) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-[#0b1511] px-6 text-center">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
          <BarChart3
            size={22}
            className="text-emerald-500"
          />
        </div>


        <h3 className="mt-4 text-sm font-semibold text-white">
          No site selected
        </h3>


        <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
          Select a monitoring site from the panel above to view
          historical carbon and biodiversity performance.
        </p>

      </div>
    );
  }


  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">

        <div className="flex items-center gap-3 text-sm text-slate-500">

          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500/20 border-t-emerald-400" />

          Loading site analytics...

        </div>

      </div>
    );
  }


  if (error) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center text-center">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <Activity size={20} />
        </div>


        <p className="mt-3 text-sm font-medium text-white">
          Unable to load analytics
        </p>


        <p className="mt-1 text-xs text-slate-500">
          {error}
        </p>

      </div>
    );
  }


  if (analytics.length === 0 && !realBiodiversity) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center text-center">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-slate-500">
          <BarChart3 size={20} />
        </div>


        <p className="mt-3 text-sm font-medium text-white">
          No analytics available
        </p>


        <p className="mt-1 text-xs text-slate-500">
          This site does not have historical observations yet.
        </p>

      </div>
    );
  }


  // ---------------------------------------------------------
  // Carbon data remains based on stored project analytics.
  // Biodiversity data is now sourced directly from GBIF.
  // ---------------------------------------------------------

  const carbonAnalytics = analytics.filter(
    (item) => item.carbon_value !== null && item.carbon_value !== undefined
  );

  const carbonLabels = carbonAnalytics.map((item) => item.year);

  const carbonValues = carbonAnalytics.map(
    (item) => item.carbon_value
  );

  const gbifYearlyObservations =
    realBiodiversity?.yearly_observations || {};

  const gbifYears = Object.keys(gbifYearlyObservations)
    .map(Number)
    .filter((year) => Number.isFinite(year))
    .sort((a, b) => a - b);

  const gbifValues = gbifYears.map(
    (year) => gbifYearlyObservations[String(year)]
  );

  const latestCarbon =
    carbonAnalytics.length > 0
      ? carbonAnalytics[carbonAnalytics.length - 1]
      : null;

  const firstCarbon =
    carbonAnalytics.length > 0
      ? carbonAnalytics[0]
      : null;

  const carbonChange =
    firstCarbon?.carbon_value
      ? (
          ((latestCarbon.carbon_value - firstCarbon.carbon_value) /
            firstCarbon.carbon_value) *
          100
        ).toFixed(1)
      : "0.0";

  const latestGbifYear =
    gbifYears.length > 0
      ? gbifYears[gbifYears.length - 1]
      : null;

  const latestGbifObservationCount =
    latestGbifYear !== null
      ? gbifYearlyObservations[String(latestGbifYear)]
      : 0;

  const chartLabels = Array.from(
    new Set([...carbonLabels, ...gbifYears])
  ).sort((a, b) => a - b);

  const carbonChartValues = chartLabels.map((year) => {
    const record = carbonAnalytics.find(
      (item) => item.year === year
    );

    return record ? record.carbon_value : null;
  });

  const gbifChartValues = chartLabels.map(
    (year) => gbifYearlyObservations[String(year)] ?? null
  );

  const chartData = {
    labels: chartLabels,

    datasets: [
      {
        label: "Carbon",
        data: carbonChartValues,
        borderColor: "#34d399",
        backgroundColor: "rgba(52, 211, 153, 0.08)",
        pointBackgroundColor: "#34d399",
        pointBorderColor: "#0b1511",
        pointBorderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        spanGaps: false
      },
      {
        label: "GBIF Observations",
        data: gbifChartValues,
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96, 165, 250, 0.04)",
        pointBackgroundColor: "#60a5fa",
        pointBorderColor: "#0b1511",
        pointBorderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        spanGaps: false
      }
    ]
  };


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false
    },

    plugins: {
      legend: {
        position: "top",
        align: "start",

        labels: {
          color: "#94a3b8",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          boxWidth: 7,
          font: {
            size: 11
          }
        }
      },

      tooltip: {
        backgroundColor: "#0b1511",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#ffffff",
        bodyColor: "#cbd5e1",
        padding: 12,
        cornerRadius: 10,
        displayColors: true
      }
    },

    scales: {
      x: {
        grid: {
          color: "rgba(255,255,255,0.04)"
        },

        ticks: {
          color: "#64748b",
          font: {
            size: 10
          }
        },

        border: {
          display: false
        }
      },

      y: {
        grid: {
          color: "rgba(255,255,255,0.05)"
        },

        ticks: {
          color: "#64748b",
          font: {
            size: 10
          }
        },

        border: {
          display: false
        }
      }
    }
  };


  return (
    <div>

      {/* Analytics summary */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">

        {/* Latest carbon */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0b1511] p-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Leaf
                  size={15}
                  className="text-emerald-400"
                />
              </div>

              <span className="text-xs text-slate-500">
                Carbon
              </span>

            </div>


            <TrendingUp
              size={14}
              className="text-emerald-400"
            />

          </div>


          <div className="mt-3 flex items-end justify-between">

            <div>

              <p className="text-xl font-semibold text-white">
                {latestCarbon ? latestCarbon.carbon_value : "—"}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-600">
                latest stored value
              </p>

            </div>


            {latestCarbon && (
              <span className="text-xs font-medium text-emerald-400">
                +{carbonChange}%
              </span>
            )}

          </div>

        </div>


        {/* Real GBIF biodiversity observations */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0b1511] p-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
                <Activity
                  size={15}
                  className="text-sky-400"
                />
              </div>

              <span className="text-xs text-slate-500">
                GBIF Observations
              </span>

            </div>


            <TrendingUp
              size={14}
              className="text-sky-400"
            />

          </div>


          <div className="mt-3 flex items-end justify-between">

            <div>

              <p className="text-xl font-semibold text-white">
                {realBiodiversity
                  ? realBiodiversity.total_observations.toLocaleString()
                  : "—"}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-600">
                total occurrence records
              </p>

            </div>


            {latestGbifYear !== null && (
              <span className="text-xs font-medium text-sky-400">
                {latestGbifObservationCount.toLocaleString()} in {latestGbifYear}
              </span>
            )}

          </div>

        </div>


        {/* Observation period */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0b1511] p-4">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <CalendarRange
                size={15}
                className="text-violet-400"
              />
            </div>

            <span className="text-xs text-slate-500">
              GBIF Observation Period
            </span>

          </div>


          <p className="mt-3 text-xl font-semibold text-white">
            {gbifYears.length > 0
              ? `${gbifYears[0]}–${gbifYears[gbifYears.length - 1]}`
              : "—"}
          </p>


          <p className="mt-0.5 text-[10px] text-slate-600">
            {gbifYears.length} recorded years from GBIF
          </p>

        </div>

      </div>


      {/* Real GBIF biodiversity summary */}
      {realBiodiversity && (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">
              Recorded Species
            </div>

            <div className="mt-2 text-2xl font-bold text-white">
              {realBiodiversity.species_count.toLocaleString()}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              Distinct species in the sampled GBIF records
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">
              GBIF Sample Size
            </div>

            <div className="mt-2 text-2xl font-bold text-white">
              {realBiodiversity.sample_size.toLocaleString()}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              Records used for species analysis
            </div>
          </div>
        </div>
      )}


      {/* Chart */}
      <div className="h-[360px]">

        <Line
          data={chartData}
          options={chartOptions}
        />

      </div>

    </div>
  );
}


export default AnalyticsChart;