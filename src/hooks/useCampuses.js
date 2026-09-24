import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import campusService from "../services/campusService.js";

export const CAMPUS_QUERY_KEYS = {
  all: ["campuses"],
  list: (params) => ["campuses", "list", params],
  detail: (id) => ["campuses", "detail", id],
};

/**
 * Hook to query all campuses with optional params (e.g. with_courses)
 */
export function useCampuses(params = {}) {
  return useQuery({
    queryKey: CAMPUS_QUERY_KEYS.list(params),
    queryFn: () => campusService.getCampuses(params),
  });
}

/**
 * Hook to query a single campus by id
 */
export function useCampus(id) {
  return useQuery({
    queryKey: CAMPUS_QUERY_KEYS.detail(id),
    queryFn: () => campusService.getCampus(id),
    enabled: Boolean(id),
  });
}

/**
 * Hook to create a new campus
 */
export function useCreateCampus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => campusService.createCampus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPUS_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to update a campus
 */
export function useUpdateCampus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => campusService.updateCampus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CAMPUS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CAMPUS_QUERY_KEYS.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete a campus
 */
export function useDeleteCampus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => campusService.deleteCampus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPUS_QUERY_KEYS.all });
    },
  });
}
