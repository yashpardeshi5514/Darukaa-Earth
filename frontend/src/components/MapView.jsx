import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;


function MapView({
  onSiteSelect,
  projectId,
  startDrawing,
  onSiteCreated
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const drawRef = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [73.855, 18.525],
      zoom: 13
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      "top-right"
    );

    const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    }
    });

    drawRef.current = draw;

    map.current.addControl(draw, "top-right");
    map.current.on("draw.create", async (event) => {
    const feature = event.features?.[0];

    if (!feature) return;

    const name = window.prompt(
        "Enter a name for this site:"
    );

    if (!name) {
        alert("Site creation cancelled.");
        return;
    }

    const description = window.prompt(
        "Enter a description for this site:"
    );

    try {
        const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sites/${projectId}?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description || "")}`,
        {
            method: "POST",

            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },

            body: JSON.stringify(feature.geometry)
        }
        );

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            data.detail || "Failed to create site"
        );
        }

        console.log("Site created:", data);

        if (onSiteCreated) {
        onSiteCreated();
        }

        alert(
        `Site "${name}" created successfully!`
        );
    } catch (error) {
        console.error(
        "Site creation error:",
        error
        );

        alert(
        `Failed to create site: ${error.message}`
        );
    }
    });
    map.current.on("load", async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/sites/project/${projectId}/geojson`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch site data");
        }

        const geojson = await response.json();

        map.current.addSource("sites", {
          type: "geojson",
          data: geojson
        });

        map.current.addLayer({
        id: "sites-fill",
        type: "fill",
        source: "sites",
        paint: {
            "fill-color": "#10b981",
            "fill-opacity": 0.22
        }
        });


        map.current.addLayer({
        id: "sites-outline",
        type: "line",
        source: "sites",
        paint: {
            "line-color": "#34d399",
            "line-width": 2.5,
            "line-opacity": 0.9
        }
        });

        map.current.on("click", "sites-fill", (event) => {
        const feature = event.features?.[0];

        if (!feature) return;

        const properties = feature.properties;

        console.log("Selected site:", properties);

        if (onSiteSelect) {
        onSiteSelect(Number(properties.id));
        }

        new mapboxgl.Popup()
            .setLngLat(event.lngLat)
            .setHTML(`
            <div style="min-width: 180px">
                <h3 style="margin: 0 0 8px 0;">
                ${properties.name}
                </h3>

                <p style="margin: 0 0 8px 0;">
                ${properties.description || "No description"}
                </p>

                <p style="margin: 0;">
                <strong>Site ID:</strong> ${properties.id}
                </p>
            </div>
            `)
            .addTo(map.current);
        });

        map.current.on("mouseenter", "sites-fill", () => {
          map.current.getCanvas().style.cursor = "pointer";
        });

        map.current.on("mouseleave", "sites-fill", () => {
          map.current.getCanvas().style.cursor = "";
        });

      } catch (error) {
        console.error("Map data error:", error);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [projectId, onSiteSelect]);

  useEffect(() => {
    if (!startDrawing || !drawRef.current) return;

    drawRef.current.changeMode("draw_polygon");
  }, [startDrawing]);
    return (
    <div className="relative h-full w-full">

        {/* Map */}
        <div
        ref={mapContainer}
        className="h-full w-full"
        />


        {/* Map status */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-xl border border-white/10 bg-[#07110d]/90 px-3 py-2 shadow-xl backdrop-blur-md">

        <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
            Live Geospatial View
        </span>

        </div>


        {/* Site legend */}
        <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-white/10 bg-[#07110d]/90 p-3 shadow-xl backdrop-blur-md">

        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Map Legend
        </p>

        <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-sm border border-emerald-300/60 bg-emerald-400/30" />

            <span className="text-[10px] text-slate-300">
            Monitoring site
            </span>

        </div>

        </div>


        {/* Draw hint */}
        <div className="absolute right-4 top-4 z-10 hidden rounded-xl border border-white/10 bg-[#07110d]/90 px-3 py-2 shadow-xl backdrop-blur-md sm:block">

        <p className="text-[10px] text-slate-400">
            Use the polygon tool to add a site
        </p>

        </div>

    </div>
    );
}

export default MapView;