/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Cuisine, FeatureList, Features, getRestaurantInput, Restaurant } from '../../models';
import RestaurantItem from '../RestaurantItem';
import GET_RESTAURANT_QUERY from './query';
import './restaurant-quiz.scss';

const RestaurantQuiz: React.FC = () => {
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(100);
  const [cuisine, setCuisine] = useState<Cuisine>();
  const [features, setFeatures] = useState<Features>();

  const res = useQuery<{
    getRestaurants: Restaurant[],
  }, getRestaurantInput>(GET_RESTAURANT_QUERY, {
    variables: {
      input: {
        minBudget,
        maxBudget,
        cuisine,
        features,
      },
    },
  });

  // eslint-disable-next-line no-console
  console.log(res);
  console.log({
    minBudget,
    maxBudget,
    cuisine,
    features,
  });
  const { data, loading, error } = res;

  const resultList = (data?.getRestaurants || [])
    .sort((a, b) => b.score - a.score);

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
              value={minBudget}
              onChange={(val): void => { setMinBudget(+val.target.value); }}
            />
          </div>
          <div className="col-auto">
            <label>Max Budget</label>
            <input
              className="form-control"
              type="number"
              value={maxBudget}
              onChange={(val): void => { setMaxBudget(+val.target.value); }}
            />
          </div>
          <div className="col-auto">
            <label>Cuisine</label>
            <select
              className="form-select"
              value={cuisine}
              onChange={(val): void => { setCuisine(val.target.value as Cuisine); }}
            >
              <option value="">Select a Cuisine</option>
              <option value={Cuisine.COUNTRY}>Turkish</option>
              <option value={Cuisine.NOT_COUNTRY}>Non-Turkish</option>
              <option value={Cuisine.ANYTHING}>Anything</option>
            </select>
          </div>
        </div>
        <div className="row justify-content-center feature-list">
          {(Object.keys(FeatureList)).map((feature) => (
            <div className="col-auto" key={feature}>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={feature}
                  checked={!!features?.[feature as keyof Features]}
                  onChange={(): void => {
                    setFeatures((oldFeatures) => {
                      if (oldFeatures?.[feature as keyof Features]) {
                        delete oldFeatures[feature as keyof Features];
                        console.log('old', oldFeatures, feature);
                        return oldFeatures;
                      }
                      const finalFeatures = oldFeatures ? {
                        ...oldFeatures, [feature]: 5,
                      } : { [feature]: 5 } as Features;
                      console.log('new', finalFeatures, feature);
                      return finalFeatures;
                    });
                  }}
                />
                <label className="form-check-label" htmlFor={feature}>
                  {/* {features?[feature as keyof Features]} */}
                  {feature}
                </label>
              </div>
            </div>
          ))}
          <div className="question">
            *questions for team:
            is 'anything' cuisine both turkish and non-turkish, or it's own category?
            should features be a toggle or a scale?
          </div>
        </div>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message} </div>}
      {!!resultList && (
        <div>
          {resultList.length === 0 && <div>No restaurant data to show</div>}
          {resultList.map((restaurant) => (
            <RestaurantItem key={restaurant.id} restaurant={restaurant}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantQuiz;
