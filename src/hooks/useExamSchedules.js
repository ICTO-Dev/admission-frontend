import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import examScheduleService from "../services/examScheduleService.js";

export const EXAM_SCHEDULE_KEYS = {
  schoolYears: ["school-years"],
  schoolYearsList: (params) => ["school-years", "list", params],
  venues: ["venues"],
  venuesList: (params) => ["venues", "list", params],
  rooms: ["rooms"],
  roomsList: (params) => ["rooms", "list", params],
  batches: ["batches"],
  batchesList: (params) => ["batches", "list", params],
  schedules: ["exam-schedules"],
  schedulesList: (params) => ["exam-schedules", "list", params],
  scheduleDetail: (id) => ["exam-schedules", "detail", id],
};

// ==========================================
// School Years Hooks
// ==========================================
export function useSchoolYears(params = {}) {
  return useQuery({
    queryKey: EXAM_SCHEDULE_KEYS.schoolYearsList(params),
    queryFn: () => examScheduleService.getSchoolYears(params),
  });
}

export function useCreateSchoolYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => examScheduleService.createSchoolYear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.schoolYears });
    },
  });
}

export function useUpdateSchoolYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => examScheduleService.updateSchoolYear(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.schoolYears });
    },
  });
}

export function useDeleteSchoolYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => examScheduleService.deleteSchoolYear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.schoolYears });
    },
  });
}

// ==========================================
// Venues Hooks
// ==========================================
export function useVenues(params = {}) {
  return useQuery({
    queryKey: EXAM_SCHEDULE_KEYS.venuesList(params),
    queryFn: () => examScheduleService.getVenues(params),
  });
}

export function useCreateVenue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => examScheduleService.createVenue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.venues });
    },
  });
}

export function useUpdateVenue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => examScheduleService.updateVenue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.venues });
    },
  });
}

export function useDeleteVenue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => examScheduleService.deleteVenue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.venues });
    },
  });
}

// ==========================================
// Rooms Hooks
// ==========================================
export function useRooms(params = {}) {
  return useQuery({
    queryKey: EXAM_SCHEDULE_KEYS.roomsList(params),
    queryFn: () => examScheduleService.getRooms(params),
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => examScheduleService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.rooms });
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.venues });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => examScheduleService.updateRoom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.rooms });
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.venues });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => examScheduleService.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.rooms });
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.venues });
    },
  });
}

// ==========================================
// Batches Hooks
// ==========================================
export function useBatches(params = {}) {
  return useQuery({
    queryKey: EXAM_SCHEDULE_KEYS.batchesList(params),
    queryFn: () => examScheduleService.getBatches(params),
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => examScheduleService.createBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.batches });
    },
  });
}

export function useUpdateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => examScheduleService.updateBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.batches });
    },
  });
}

export function useDeleteBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => examScheduleService.deleteBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.batches });
    },
  });
}

// ==========================================
// Exam Schedules Hooks
// ==========================================
export function useExamSchedules(params = {}) {
  return useQuery({
    queryKey: EXAM_SCHEDULE_KEYS.schedulesList(params),
    queryFn: () => examScheduleService.getExamSchedules(params),
  });
}

export function useCreateExamSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => examScheduleService.createExamSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.schedules });
    },
  });
}

export function useUpdateExamSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => examScheduleService.updateExamSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.schedules });
    },
  });
}

export function useDeleteExamSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => examScheduleService.deleteExamSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_SCHEDULE_KEYS.schedules });
    },
  });
}
