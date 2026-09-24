import api from "./api.js";

export const courseService = {
  /**
   * Fetch courses with optional filters
   * @param {Object} params - e.g. { campus_id, status, college, search, paginate, per_page }
   */
  async getCourses(params = {}) {
    const response = await api.get("/courses", { params });
    return response.data.data;
  },

  /**
   * Fetch a single course by ID
   */
  async getCourse(id) {
    const response = await api.get(`/courses/${id}`);
    return response.data.data;
  },

  /**
   * Create a new course
   */
  async createCourse(data) {
    const response = await api.post("/courses", data);
    return response.data.data;
  },

  /**
   * Update an existing course
   */
  async updateCourse(id, data) {
    const response = await api.put(`/courses/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a course
   */
  async deleteCourse(id) {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

export default courseService;
