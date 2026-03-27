// Represents a paginated data structure from the backend.
export interface Page<T = any> {
  // The array of items for the current page.
  content: T[];

  // The total number of pages available.
  totalPages: number;

  // The total number of items across all pages.
  totalElements: number;

  // The number of items requested per page.
  size: number;

  // The current page number (usually 0-based).
  number: number;
}
