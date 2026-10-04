import api from "./api.js";

export const campusService = {
  /**
   * Fetch all campuses
   * @param {Object} params - e.g. { with_courses: true }
   */
  async getCampuses(params = {}) {
    const response = await api.get("/campuses", { params });
    return response.data.data;
  },

  /**
   * Fetch a single campus by ID
   */
  async getCampus(id) {
    const response = await api.get(`/campuses/${id}`);
    return response.data.data;
  },

  /**
   * Create a new campus
   */
  async createCampus(data) {
    const response = await api.post("/campuses", data);
    return response.data.data;
  },

  /**
   * Update an existing campus
   */
  async updateCampus(id, data) {
    const response = await api.put(`/campuses/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a campus
   */
  async deleteCampus(id) {
    const response = await api.delete(`/campuses/${id}`);
    return response.data;
  },
};

export default campusService;
