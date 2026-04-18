/**
 * Tailles de page autorisées pour les listes paginées (query `limit`, nuqs, etc.).
 * Réutilisable pour tout type de ressource.
 */
export const PAGE_SIZE_OPTIONS = [1, 2, 5, 10] as const;

export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export const DEFAULT_PAGE_SIZE: PageSizeOption = 10;
