"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Custom hook for managing URL query parameters using
 * Next.js App Router navigation.
 * Provides methods to get, set, delete, clear, and navigate
 * with query parameters without causing scroll.
 *
 * @returns An object containing utilities for query parameter
 * manipulation.
 */
export function useQueryParams() {
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Get the value of a query parameter.
   *
   * @param key - The query parameter key.
   * @returns The parameter value, or null if not present.
   */
  const getParam = (key: string): string | null => {
    return searchParams.get(key);
  };

  /**
   * Set a single query parameter, preserving existing ones.
   *
   * @param key - The parameter key.
   * @param value - The parameter value.
   * @param pathname - Optional pathname to apply (defaults
   *   to current pathname).
   */
  const setParam = (
    key: string,
    value: string,
    pathname = currentPathname,
  ): void => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  /**
   * Set multiple query parameters, preserving existing ones.
   *
   * @param values - Record of key/value pairs to set.
   * @param pathname - Optional pathname to apply (defaults
   *   to current pathname).
   */
  const setParams = (
    values: Record<string, string>,
    pathname = currentPathname,
  ): void => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(values).forEach(([key, value]) => {
      params.set(key, value);
    });
    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  /**
   * Delete a query parameter.
   *
   * @param key - The parameter key to delete.
   * @param pathname - Optional pathname to apply (defaults
   *   to current pathname).
   */
  const deleteParam = (key: string, pathname = currentPathname): void => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  /**
   * Clear all query parameters.
   *
   * @param pathname - Optional pathname to navigate to
   *   (defaults to current pathname).
   */
  const clearParams = (pathname = currentPathname): void => {
    router.replace(pathname, { scroll: false });
  };

  /**
   * Navigate to a new pathname with optional query parameters.
   *
   * @param pathname - The target pathname.
   * @param values - Optional record of query parameters.
   */
  const navigate = (
    pathname: string,
    values: Record<string, string> = {},
  ): void => {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      params.set(key, value);
    });
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  return {
    getParam,
    setParam,
    setParams,
    deleteParam,
    clearParams,
    navigate,
  };
}
