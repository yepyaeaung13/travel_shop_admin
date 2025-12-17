import { getCities, getRegions, getTownships } from "@/services/location.service";
import { useQuery } from "@tanstack/react-query";


export const useGetRegions = () => {
  return useQuery({
    queryKey: ["Regions"],
    queryFn: () => getRegions(),
  });
};
export const useGetCities = (id: string) => {
  return useQuery({
    queryKey: ["Cities", id],
    queryFn: () => getCities(id),
    enabled: !!id
  });
};
export const useGetTownships = (id: string) => {
  return useQuery({
    queryKey: ["Townships", id],
    queryFn: () => getTownships(id),
    enabled: !!id
  });
};