import api from "./api.js";

export const geoService = {
  /**
   * Fetch all regions
   */
  async getRegions() {
    const response = await api.get("/geo/regions");
    return response.data.data;
  },

  /**
   * Fetch provinces by region_id
   */
  async getProvinces(regionId) {
    const response = await api.get("/geo/provinces", {
      params: { region_id: regionId },
    });
    return response.data.data;
  },

  /**
   * Fetch municipalities by province_id
   */
  async getMunicipalities(provinceId) {
    const response = await api.get("/geo/municipalities", {
      params: { province_id: provinceId },
    });
    return response.data.data;
  },

  /**
   * Fetch barangays by municipality_id
   */
  async getBarangays(municipalityId) {
    const response = await api.get("/geo/barangays", {
      params: { municipality_id: municipalityId },
    });
    return response.data.data;
  },
};

export default geoService;
