export type PropertyProjectionDataset = "country";

export type PropertyProjectionFormat = "full" | "alpha_2";

export interface PropertyValueProjection {
  dataset: PropertyProjectionDataset;
  format: PropertyProjectionFormat;
}
