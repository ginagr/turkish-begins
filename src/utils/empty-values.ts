import { FeatureList, Features } from '../models';

export const createEmptyFeatures = (): Features => Object.keys(FeatureList)
  .reduce((acc, curr) => ({ ...acc, [curr]: -1 }), {} as Features);

export const createFeatureIterable = (): (keyof Features)[] => (
  Object.keys(createEmptyFeatures()) as (keyof Features)[]
);
