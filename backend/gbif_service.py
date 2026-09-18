import requests


GBIF_API_URL = "https://api.gbif.org/v1/occurrence/search"


def get_biodiversity_data(polygon_wkt: str):
    """
    Fetch real GBIF biodiversity observations within a polygon.

    Returns:
        total_observations:
            Total GBIF occurrence records matching the polygon.

        species_count:
            Number of distinct species found in the retrieved sample.

        yearly_observations:
            Observation counts grouped by year from GBIF aggregation.

        sample_size:
            Number of individual records retrieved for species analysis.
    """

    # ---------------------------------------------------------
    # 1. Get the exact total number of observations
    # ---------------------------------------------------------
    count_response = requests.get(
        GBIF_API_URL,
        params={
            "geometry": polygon_wkt,
            "hasCoordinate": "true",
            "limit": 0,
        },
        timeout=30,
    )

    count_response.raise_for_status()

    count_data = count_response.json()

    total_observations = count_data.get("count", 0)

    # ---------------------------------------------------------
    # 2. Retrieve a sample of records for species information
    # ---------------------------------------------------------
    records_response = requests.get(
        GBIF_API_URL,
        params={
            "geometry": polygon_wkt,
            "hasCoordinate": "true",
            "limit": 300,
            "offset": 0,
        },
        timeout=30,
    )

    records_response.raise_for_status()

    records_data = records_response.json()

    records = records_data.get("results", [])

    species_keys = set()

    for record in records:
        species_key = record.get("speciesKey")

        if species_key:
            species_keys.add(species_key)

    # ---------------------------------------------------------
    # 3. Get yearly observation counts using GBIF facets
    # ---------------------------------------------------------
    yearly_response = requests.get(
        GBIF_API_URL,
        params={
            "geometry": polygon_wkt,
            "hasCoordinate": "true",
            "limit": 0,
            "facet": "year",
            "facetMincount": 1,
            "facetLimit": 100,
        },
        timeout=30,
    )

    yearly_response.raise_for_status()

    yearly_data = yearly_response.json()

    yearly_observations = {}

    for facet in yearly_data.get("facets", []):
        if facet.get("field", "").lower() != "year":
            continue

        for item in facet.get("counts", []):
            try:
                year = int(item["name"])
                count = int(item["count"])

                yearly_observations[year] = count

            except (KeyError, TypeError, ValueError):
                continue

        break

    return {
        "total_observations": total_observations,
        "species_count": len(species_keys),
        "yearly_observations": dict(
            sorted(yearly_observations.items())
        ),
        "sample_size": len(records),
    }