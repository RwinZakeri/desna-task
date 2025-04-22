import db from "../db/DESNA_FrontEnd_Task.json";

// types
export interface SelectedFilterType {
  filterId: number;
  optionId: number;
}

export type ProductType = (typeof db.Data.Products)[number];
export type FilterType = (typeof db.Data.Filters)[number];
export type CategoryType = (typeof db.Data.Categories)[number];
