import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import courseService from "../services/courseService.js";

export const COURSE_QUERY_KEYS = {
  all: ["courses"],
  list: (params) => ["courses", "list", params],
  detail: (id) => ["courses", "detail", id],
};

/**
 * Hook to query courses with optional filters
 */
export function useCourses(params = {}, options = {}) {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.list(params),
    queryFn: () => courseService.getCourses(params),
    ...options,
  });
}

/**
 * Hook to query a single course by id
 */
export function useCourse(id) {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.detail(id),
    queryFn: () => courseService.getCourse(id),
    enabled: Boolean(id),
  });
}

/**
 * Hook to create a new course
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to update a course
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => courseService.updateCourse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete a course
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => courseService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
    },
  });
}
