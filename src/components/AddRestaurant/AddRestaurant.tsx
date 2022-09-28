import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { addRestaurantInput, Cuisine, FeatureList, Features } from '../../models';
import { formatScreamSnakeCase } from '../../utils';
import './add-restaurant.scss';
import ADD_RESTAURANT_MUTATION from './mutation';

const AddRestaurant: React.FC = () => {
  const [hideSuccess, setHideSuccess] = useState(true);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState(0);
  const [cuisine, setCuisine] = useState<Cuisine>(Cuisine.COUNTRY);
  const [features, setFeatures] = useState(Object.keys(FeatureList)
    .reduce((acc, curr) => ({ ...acc, [curr]: null }), {} as Features));

  const [
    addRestaurantMutation,
    { loading, error, data },
  ] = useMutation<{addRestaurant: string}, addRestaurantInput>(
    ADD_RESTAURANT_MUTATION, {
      variables: {
        input: {
          name,
          address,
          price,
          cuisine,
          features,
        },
      },
    });

  useEffect(() => {
    if (data?.addRestaurant && hideSuccess) {
      setHideSuccess(false);
      setTimeout(() => setHideSuccess(true), 3000);
    }
  }, [data?.addRestaurant]);

  return (
    <div className="add-restaurant-container container">
      <h1>Add Restaurant</h1>
      <div className="card filter-card">
        <div className="row justify-content-center">
          <div className="col-auto">
            <label>
              Name
              <span className="required">*</span>
            </label>
            <input
              className="form-control"
              value={name}
              onChange={(val): void => { setName(val.target.value); }}
            />
          </div>
          <div className="col-auto">
            <label>
              Address
              <span className="required">*</span>
            </label>
            <input
              className="form-control"
              value={address}
              onChange={(val): void => { setAddress(val.target.value); }}
            />
          </div>
          <div className="col-auto">
            <label>
              Price
              <span className="required">*</span>
            </label>
            <input
              className="form-control"
              type="number"
              value={price}
              onChange={(val): void => { setPrice(+val.target.value); }}
            />
          </div>
          <div className="col-auto">
            <label>
              Cuisine
              <span className="required">*</span>
            </label>
            <select
              className="form-select"
              value={cuisine}
              onChange={(val): void => { setCuisine(val.target.value as Cuisine); }}
            >
              <option value={Cuisine.COUNTRY}>Turkish</option>
              <option value={Cuisine.NOT_COUNTRY}>Non-Turkish</option>
              <option value={Cuisine.ANYTHING}>Anything</option>
            </select>
          </div>
        </div>
        <div className="row justify-content-center feature-list">
          {(Object.keys(FeatureList)).map((feature) => (
            <div className="col-auto" key={feature}>
              <label>
                {formatScreamSnakeCase(feature)} &middot;
                <span className='feature-num'>
                  {features[feature as keyof Features] || 'n/a'}
                </span>
                {!!features[feature as keyof Features] && (
                  <>
                  &middot;
                    <span
                      className='clear-feature'
                      onClick={(): void => {
                        setFeatures({
                          ...features,
                          [feature]: null,
                        });
                      }}
                    >
                    clear
                    </span>
                  </>
                )}
              </label>
              <input
                className="form-range"
                type="range"
                min="1"
                max="5"
                value={features[feature as keyof Features] || ''}
                onChange={(val): void => {
                  setFeatures({
                    ...features,
                    [feature]: +val.target.value || null,
                  });
                }}
              />
            </div>
          ))}
        </div>
        {!!error && (
          <div className="error">Error: {error?.message}</div>
        )}
        <button
          className="btn btn-primary"
          onClick={(): void => { void addRestaurantMutation(); }}
          disabled={loading || (!name || !address || !price)}
        >
          {loading ? 'Saving...' : 'Add Restaurant'}
        </button>
        {!hideSuccess && (
          <div className="success">Added restaurant!</div>
        )}
        <div className="required-copy">
          *Required
        </div>
      </div>
    </div>
  );
};

export default AddRestaurant;
