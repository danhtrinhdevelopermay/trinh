import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type SlideData } from "@shared/schema";

// Hook for fetching presentation slides
export function usePresentationSlides(presentationId: string) {
  return useQuery<SlideData[]>({
    queryKey: ['/api/presentations', presentationId, 'slides'],
    enabled: !!presentationId,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 or 403 errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Hook for fetching a single presentation
export function usePresentation(presentationId: string) {
  return useQuery({
    queryKey: ['/api/presentations', presentationId],
    enabled: !!presentationId,
  });
}

// Hook for fetching user presentations
export function useUserPresentations(userId: string) {
  return useQuery({
    queryKey: ['/api/presentations', `?userId=${userId}`],
    enabled: !!userId,
  });
}

// Hook for creating a new presentation
export function useCreatePresentation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/presentations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/presentations'] });
    },
  });
}

// Hook for updating a presentation
export function useUpdatePresentation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      apiRequest('PUT', `/api/presentations/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/presentations', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/presentations'] });
    },
  });
}

// Hook for deleting a presentation
export function useDeletePresentation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/presentations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/presentations'] });
    },
  });
}

// Hook for creating a new slide
export function useCreateSlide() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ presentationId, ...data }: { presentationId: string } & any) => 
      apiRequest('POST', `/api/presentations/${presentationId}/slides`, data),
    onSuccess: (_, { presentationId }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/presentations', presentationId, 'slides'] });
    },
  });
}

// Hook for updating a slide
export function useUpdateSlide() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, presentationId, ...data }: { id: string; presentationId: string } & any) => 
      apiRequest('PUT', `/api/slides/${id}`, data),
    onSuccess: (_, { presentationId }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/presentations', presentationId, 'slides'] });
    },
  });
}

// Hook for deleting a slide
export function useDeleteSlide() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, presentationId }: { id: string; presentationId: string }) => 
      apiRequest('DELETE', `/api/slides/${id}`),
    onSuccess: (_, { presentationId }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/presentations', presentationId, 'slides'] });
    },
  });
}

// Hook for reordering slides
export function useReorderSlides() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ presentationId, slideOrders }: { presentationId: string; slideOrders: { id: string; order: number }[] }) => 
      apiRequest('PUT', `/api/presentations/${presentationId}/slides/reorder`, slideOrders),
    onSuccess: (_, { presentationId }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/presentations', presentationId, 'slides'] });
    },
  });
}