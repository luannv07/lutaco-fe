// A frozen, nested object for all API endpoint paths.
// Structure: ApiEndpoints.FEATURE.ACTION
// Example: ApiEndpoints.AUTH.LOGIN
export const ApiEndpoints = Object.freeze({
  // Authentication endpoints.
  AUTH: Object.freeze({
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    REFRESH_TOKEN: 'auth/refresh-token',
  }),

  // User management endpoints.
  USERS: Object.freeze({
    GET_ALL: 'users',
    GET_BY_ID: 'users',
    CREATE: 'users',
    UPDATE: 'users',
    DELETE: 'users',
  }),

  // Product management endpoints.
  PRODUCTS: Object.freeze({
    SEARCH: 'products/search',
    GET_ALL: 'products',
    GET_BY_SLUG: 'products/slug',
  }),
});
