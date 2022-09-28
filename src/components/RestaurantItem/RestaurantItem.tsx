import React, { useCallback } from 'react';
import { Features, Restaurant } from '../../models';
import { formatScreamSnakeCase } from '../../utils';
import './restaurant-item.scss';

interface Props {
  restaurant: Restaurant,
  selectedFeatures?: Features,
}

const RestaurantItem: React.FC<Props> = ({ restaurant, selectedFeatures }) => {
  const {
    features,
  } = restaurant;

  const featuresArray = (Object.keys(features) as (keyof Features)[])
    .filter((k) => k !== '__typename' && features[k] !== -1)
    .sort((a, b) => +features[b]! - +features[a]!);

  const rateFeature = useCallback((f: number, k: keyof Features): string => {
    const isFeatured = typeof selectedFeatures?.[k] !== 'undefined' ? 'featured' : '';
    if (f > 3) return `${isFeatured} high`;
    if (f < 3) return `${isFeatured} low`;
    return `${isFeatured} middle`;
  }, []);

  return (
    <div className="restaurant-item-container card">
      <div className="row">
        <div className="col-4">
          <div className="title-side">
            <h2>
              {restaurant.name}
            </h2>
            <h3 className="score">
              {!!restaurant.score && `Score: ${restaurant.score} out of 5` }
            </h3>
            <h4>
              Cuisine: {formatScreamSnakeCase(String(restaurant.cuisine))}
            </h4>
            <h4>
              Price: {restaurant.price}
            </h4>
          </div>
        </div>
        <div className="col-8">
          <div className="feature-side">
            <h4>Features:</h4>
            {!featuresArray.length && <div>No features.</div>}
            {featuresArray.map((featureKey) => {
              const featureRating = features[featureKey] as number;
              return (
                <span
                  className={`feature ${rateFeature(featureRating, featureKey)}`}
                  key={String(featureKey)}
                >
                  {formatScreamSnakeCase(featureKey)}: {featureRating}
                </span>
              );
            })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantItem;
