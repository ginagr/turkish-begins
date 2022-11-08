import { useQuery } from '@apollo/client';
import React, { useCallback, useState } from 'react';
import { Cuisine, FeatureList, Features, getRestaurantInput, Restaurant } from '../../models';
import { createFeatureIterable, formatScreamSnakeCase } from '../../utils';
import RestaurantItem from '../RestaurantItem';
import GET_RESTAURANTS_QUERY from './query';
import './restaurant-quiz.scss';

const RestaurantQuiz: React.FC = () => {
  const [hasActivated, setHasActivated] = useState(false);
  const [minBudget, setMinBudget] = useState<number>();
  const [maxBudget, setMaxBudget] = useState<number>();
  const [cuisine, setCuisine] = useState<Cuisine>();
  const [features, setFeatures] = useState({} as Features);

  const res = useQuery<{
    getRestaurants: Restaurant[],
  }, getRestaurantInput>(GET_RESTAURANTS_QUERY, {
    skip: !hasActivated,
    variables: {
      input: {
        ...minBudget ? { minBudget } : {},
        ...maxBudget ? { maxBudget } : {},
        ...cuisine === Cuisine.COUNTRY || cuisine === Cuisine.NOT_COUNTRY ? {
          cuisine,
        } : {},
        features,
      },
    },
  });

  const { data, loading, error } = res;

  const resultList = [...data?.getRestaurants || []];

  const toggleFeature = useCallback((newVal: boolean, feature: FeatureList) => {
    const newFeatures: Features = { ...features };
    if (newVal) { // add
      newFeatures[feature] = 5;
    } else { // remove
      delete newFeatures[feature];
    }
    setFeatures(newFeatures);
    setHasActivated(true);
  }, [features, setFeatures]);

  return (
    <div className="restaurant-quiz-container container">
      <h1>Restaurants Quiz</h1>
      <div className="card filter-card">
        <h2>Filters</h2>
        <div className="row justify-content-center">
          <div className="col-auto">
            <label>Min Budget</label>
            <input
              className="form-control"
              type="number"
              value={minBudget || ''}
              onChange={(val): void => {
                setMinBudget(+val.target.value);
                setHasActivated(true);
              }}
              placeholder="e.g. 5"
            />
          </div>
          <div className="col-auto">
            <label>Max Budget</label>
            <input
              className="form-control"
              type="number"
              value={maxBudget || ''}
              onChange={(val): void => {
                setMaxBudget(+val.target.value);
                setHasActivated(true);
              }}
              placeholder="e.g. 30"
            />
          </div>
          <div className="col-auto">
            <label>Cuisine</label>
            <select
              className="form-select"
              value={cuisine}
              onChange={(val): void => {
                setCuisine(val.target.value as Cuisine);
                setHasActivated(true);
              }}
            >
              <option value={undefined}>Anything</option>
              <option value={Cuisine.COUNTRY}>Turkish</option>
              <option value={Cuisine.NOT_COUNTRY}>Non-Turkish</option>
            </select>
          </div>
        </div>
        <div className="row justify-content-center feature-list">
          {(createFeatureIterable()).map((feature) => (
            <div className="col-auto" key={feature}>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={feature}
                  checked={!!features[feature]}
                  onChange={(val): void => {
                    toggleFeature(val.target.checked, feature);
                  }}
                />
                <label className="form-check-label" htmlFor={feature}>
                  {formatScreamSnakeCase(feature)}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        {loading && <div>Loading...</div>}
        {error && <div className="error">Error: {error.message} </div>}
        {(!loading && !!resultList) && (
          <div>
            {(resultList.length === 0 && hasActivated) && (
              <div>
                No restaurants match your selection, please try changing a filter.
              </div>
            )}
            {resultList.map((restaurant) => (
              <RestaurantItem
                key={restaurant.id}
                restaurant={restaurant}
                selectedFeatures={features}
                fromQuiz={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantQuiz;
