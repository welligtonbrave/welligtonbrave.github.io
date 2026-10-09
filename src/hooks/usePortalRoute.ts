import { useState, useEffect, useCallback } from "react";
import { PortalRoute, getRouteFromPath, ROUTE_CONFIGS, navigateTo } from "../utils/router";

export function usePortalRoute() {
  const [currentRoute, setCurrentRoute] = useState<PortalRoute>(() => {
    if (typeof window !== "undefined") {
      return getRouteFromPath(window.location.pathname);
    }
    return "home";
  });

  const syncRoute = useCallback(() => {
    if (typeof window !== "undefined") {
      const detected = getRouteFromPath(window.location.pathname);
      setCurrentRoute(detected);
      const config = ROUTE_CONFIGS[detected];
      if (config) {
        document.title = config.title;
      }
    }
  }, []);

  useEffect(() => {
    syncRoute();
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("popstate", syncRoute);
    };
  }, [syncRoute]);

  const goTo = useCallback((route: PortalRoute, hash?: string) => {
    navigateTo(route, hash);
    setCurrentRoute(route);
  }, []);

  return {
    currentRoute,
    routeConfig: ROUTE_CONFIGS[currentRoute],
    goTo,
  };
}
