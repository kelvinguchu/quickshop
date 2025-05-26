// Simplified local types for UI navigation
export type SubcategoryUI = {
  id: string;
  name: string;
  slug: string;
};

export type CategoryUI = {
  id: string;
  name: string;
  slug: string;
  subcategories: SubcategoryUI[];
};
