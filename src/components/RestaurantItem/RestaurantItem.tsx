import * as React from 'react';
import { Features, Restaurant } from '../../models';
import './restaurant-item.scss';

interface Props {
  restaurant: Restaurant,
}

const formatScreamSnakeCase = (f: string): string => {
  const lower = f.toLowerCase();
  const spaces = lower.replace('_', ' ');
  const cuisine = spaces.replace('country', 'turkish');
  return cuisine;
};

const rateFeature = (f: number): string => {
  if (f > 3) return 'high';
  if (f < 3) return 'low';
  return 'middle';
};

const RestaurantItem: React.FC<Props> = ({ restaurant }) => {
  const {
    features,
  } = restaurant;

  const featuresArray = (Object.keys(features) as (keyof Features)[])
    .filter((k) => k !== '__typename' && features[k] !== -1)
    .sort((a, b) => +features[b]! - +features[a]!);

  return (
    <div className="card">
      <div className="row">
        <div className="col-4">
          <div className="title-side">
            <h2>
              {restaurant.name}
            </h2>
            <h2 className="score">
              {!!restaurant.score && `Score: ${restaurant.score}` }
            </h2>
            <h5>
              Cuisine: {formatScreamSnakeCase(String(restaurant.cuisine))}
            </h5>
            <h5>
              Price: {restaurant.price}
            </h5>
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
                  className={`feature ${rateFeature(featureRating)}`}
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
