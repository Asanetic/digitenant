// src/app/mosy_utils/hiveRoutes.js

export const hiveRoutes = {
  hiveBaseRoute: '/dgt',
  main: '/dgt/digitenant',      // dairy sacco graders portal   relative to your Next.js routes
  digitenant: '/dgt/digitenant', // CRM: clients/deals/revenueplan/messages/callhistory/payments/smartpaymentrequests
  auth: '/dgt/auth',
  home: '/digitenant/dashboard/main',
  // add more as needed
};

// <Link> / router.push add the Next basePath themselves, so strip it from hiveRoutes values
// (which include it for window.location / fetch) before handing them to those.
export const linkPath = (p = '') => p.startsWith(hiveRoutes.hiveBaseRoute) ? p.slice(hiveRoutes.hiveBaseRoute.length) || '/' : p;
