import api from "./api.js";

export const examScheduleService = {
  // ==========================================
  // School Years
  // ==========================================
  async getSchoolYears(params = {}) {
    const response = await api.get("/school-years", { params });
    return response.data.data;
  },

  async getSchoolYear(id) {
    const response = await api.get(`/school-years/${id}`);
    return response.data.data;
  },

  async createSchoolYear(data) {
    const response = await api.post("/school-years", data);
    return response.data.data;
  },

  async updateSchoolYear(id, data) {
    const response = await api.put(`/school-years/${id}`, data);
    return response.data.data;
  },

  async deleteSchoolYear(id) {
    const response = await api.delete(`/school-years/${id}`);
    return response.data;
  },

  // ==========================================
  // Venues (Campus Buildings / Sites)
  // ==========================================
  async getVenues(params = {}) {
    const response = await api.get("/venues", { params });
    return response.data.data;
  },

  async getVenue(id) {
    const response = await api.get(`/venues/${id}`);
    return response.data.data;
  },

  async createVenue(data) {
    const response = await api.post("/venues", data);
    return response.data.data;
  },

  async updateVenue(id, data) {
    const response = await api.put(`/venues/${id}`, data);
    return response.data.data;
  },

  async deleteVenue(id) {
    const response = await api.delete(`/venues/${id}`);
    return response.data;
  },

  // ==========================================
  // Rooms
  // ==========================================
  async getRooms(params = {}) {
    const response = await api.get("/rooms", { params });
    return response.data.data;
  },

  async getRoom(id) {
    const response = await api.get(`/rooms/${id}`);
    return response.data.data;
  },

  async createRoom(data) {
    const response = await api.post("/rooms", data);
    return response.data.data;
  },

  async updateRoom(id, data) {
    const response = await api.put(`/rooms/${id}`, data);
    return response.data.data;
  },

  async deleteRoom(id) {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },

  // ==========================================
  // Batches
  // ==========================================
  async getBatches(params = {}) {
    const response = await api.get("/batches", { params });
    return response.data.data;
  },

  async getBatch(id) {
    const response = await api.get(`/batches/${id}`);
    return response.data.data;
  },

  async createBatch(data) {
    const response = await api.post("/batches", data);
    return response.data.data;
  },

  async updateBatch(id, data) {
    const response = await api.put(`/batches/${id}`, data);
    return response.data.data;
  },

  async deleteBatch(id) {
    const response = await api.delete(`/batches/${id}`);
    return response.data;
  },

  // ==========================================
  // Exam Schedules (Slots)
  // ==========================================
  async getExamSchedules(params = {}) {
    const response = await api.get("/exam-schedules", { params });
    return response.data.data;
  },

  async getExamSchedule(id) {
    const response = await api.get(`/exam-schedules/${id}`);
    return response.data.data;
  },

  async createExamSchedule(data) {
    const response = await api.post("/exam-schedules", data);
    return response.data.data;
  },

  async updateExamSchedule(id, data) {
    const response = await api.put(`/exam-schedules/${id}`, data);
    return response.data.data;
  },

  async deleteExamSchedule(id) {
    const response = await api.delete(`/exam-schedules/${id}`);
    return response.data;
  },
};

export default examScheduleService;
