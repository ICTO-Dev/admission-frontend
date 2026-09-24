import api from "./api.js";

/**
 * Submit online admission application to the Laravel backend.
 * @param {Object} formData
 * @returns {Promise<Object>} The created application object
 */
export async function submitApplication(formData) {
  try {
    const response = await api.post("/applications", formData);
    return response.data?.data || response.data;
  } catch (error) {
    if (error.response?.data) {
      const data = error.response.data;
      if (data.errors) {
        // Extract the first validation error message from Laravel
        const firstField = Object.keys(data.errors)[0];
        if (firstField && data.errors[firstField]?.length > 0) {
          throw new Error(data.errors[firstField][0]);
        }
      }
      if (data.message) {
        throw new Error(data.message);
      }
    }
    throw error;
  }
}

/**
 * Fetch an application by its unique Application Number (e.g. APP-2026-0001)
 * @param {string} appNo
 * @returns {Promise<Object>}
 */
export async function fetchApplicationByNo(appNo) {
  try {
    const response = await api.get(`/applications/${encodeURIComponent(appNo)}`);
    return response.data?.data || response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Fetch applications list with pagination and search filters (Admin / Processor)
 * @param {Object} params - { search, status, page, per_page }
 * @returns {Promise<Object>}
 */
export async function fetchApplications(params = {}) {
  const response = await api.get("/applications", { params });
  return response.data;
}

export default {
  submitApplication,
  fetchApplicationByNo,
  fetchApplications,
};
