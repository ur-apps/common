/**
 * Which page of a list a service is asked for:
 * at most `limit` items, after skipping the first `offset`.
 */
export interface PaginationDTO {
  limit?: number;
  offset?: number;
}
