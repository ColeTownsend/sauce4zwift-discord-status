import { routes, worlds } from 'zwift-data';

// Helper to get world name from courseId
export function getWorldName(courseId) {
  const world = worlds.find(w => w.id === courseId);
  return world?.name || `World ${courseId}`;
}

// Helper to get route name from routeId
export function getRouteName(routeId, courseId) {
  const route = routes.find(r => r.id === routeId);
  return route?.name || null;
}

// Helper to generate location string for Discord presence
export function getLocationString(courseId, routeId, inEvent = false) {
  const worldName = getWorldName(courseId);
  const routeName = getRouteName(routeId, courseId);

  if (inEvent) {
    return routeName ? `Event: ${routeName}` : `In Event • ${worldName}`;
  }

  return routeName ? `${routeName} • ${worldName}` : `Riding in ${worldName}`;
}
