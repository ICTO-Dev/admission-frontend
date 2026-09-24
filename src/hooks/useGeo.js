import { useQuery } from "@tanstack/react-query";
import geoService from "../services/geoService.js";

export const GEO_QUERY_KEYS = {
  regions: ["geo", "regions"],
  provinces: (regionId) => ["geo", "provinces", regionId],
  municipalities: (provinceId) => ["geo", "municipalities", provinceId],
  barangays: (municipalityId) => ["geo", "barangays", municipalityId],
};

/**
 * Hook to fetch all regions
 */
export function useRegions() {
  return useQuery({
    queryKey: GEO_QUERY_KEYS.regions,
    queryFn: () => geoService.getRegions(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Hook to fetch provinces of a region
 */
export function useProvinces(regionId) {
  return useQuery({
    queryKey: GEO_QUERY_KEYS.provinces(regionId),
    queryFn: () => geoService.getProvinces(regionId),
    enabled: Boolean(regionId),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * Hook to fetch municipalities of a province
 */
export function useMunicipalities(provinceId) {
  return useQuery({
    queryKey: GEO_QUERY_KEYS.municipalities(provinceId),
    queryFn: () => geoService.getMunicipalities(provinceId),
    enabled: Boolean(provinceId),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * Hook to fetch barangays of a municipality
 */
export function useBarangays(municipalityId) {
  return useQuery({
    queryKey: GEO_QUERY_KEYS.barangays(municipalityId),
    queryFn: () => geoService.getBarangays(municipalityId),
    enabled: Boolean(municipalityId),
    staleTime: 1000 * 60 * 60 * 24,
  });
}
