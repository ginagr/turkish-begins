
export enum Cuisine {
  COUNTRY = 'COUNTRY',
  NOT_COUNTRY = 'NOT_COUNTRY',
  ANYTHING = 'ANYTHING',
}
export enum FeatureList {
  KID_FRIENDLY = 'KID_FRIENDLY',
  VEGETARIAN = 'VEGETARIAN',
  VEGAN = 'VEGAN',
  VIEW = 'VIEW',
  INSTAGRAM = 'INSTAGRAM',
  ALCOHOL = 'ALCOHOL',
  CLOSE_ATTRACTIONS = 'CLOSE_ATTRACTIONS',
  OUTDOOR_SEATING = 'OUTDOOR_SEATING',
  NON_SMOKING = 'NON_SMOKING',
}
export interface Features {
  KID_FRIENDLY?: number,
  VEGETARIAN?: number,
  VEGAN?: number,
  VIEW?: number,
  INSTAGRAM?: number,
  ALCOHOL?: number,
  CLOSE_ATTRACTIONS?: number,
  OUTDOOR_SEATING?: number,
  NON_SMOKING?: number,
  __typename?: string,
}
export interface Restaurant {
  id: string,
  name: string,
  address: string,
  price: number,
  cuisine: Cuisine,
  features: Features,
  topFeatures: FeatureList[], // string list of features above 2
  score: number, // dynamic based on query
  timestampAdded: Date,
  timestampUpdated: Date,
}
export interface addRestaurantInput {
  input: {
    name: string,
    address: string,
    price: number,
    cuisine: Cuisine,
    features?: Features,
  },
}
export interface getRestaurantInput {
  input: {
    minBudget?: number,
    maxBudget?: number,
    cuisine?: Cuisine,
    features?: Features,
  },
}
export interface getAllRestaurantInput {
  input: {
    limitNum?: number,
    cursor?: string, // name
  },
}
