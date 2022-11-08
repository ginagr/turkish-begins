import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import {
  Cuisine, editRestaurantInput, Features, Restaurant,
} from '../../models';
import { createFeatureIterable, formatScreamSnakeCase } from '../../utils';
import './edit-restaurant.scss';
import EDIT_RESTAURANT_MUTATION from './mutation';
import GET_RESTAURANT_QUERY from './query';

interface Props {
  restaurantId: string,
  closePopup: () => void,
  refetchRestaurants: () => Promise<any>,
}

const EditRestaurant: React.FC<Props> = (props) => {
  const {
    restaurantId, closePopup, refetchRestaurants,
  } = props;

  const [hideSuccess, setHideSuccess] = useState(true);
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [cuisine, setCuisine] = useState<Cuisine>();
  const [features, setFeatures] = useState<Features>({} as Features);

  const res = useQuery<{
      getRestaurant: Restaurant,
    }, { id: string }>(GET_RESTAURANT_QUERY, {
      variables: {
        id: restaurantId,
      },
    });

  const { data, loading, error } = res;

  useEffect(() => {
    if (data?.getRestaurant) {
      const { getRestaurant: restaurant } = data;
      setName(restaurant.name);
      setAddress(restaurant.address);
      setPrice(restaurant.price);
      setCuisine(restaurant.cuisine);
      setFeatures(restaurant.features);
    }
  }, [data]);

  const [
    editRestaurantMutation,
    { loading: editLoading, error: editError, data: editData },
  ] = useMutation<{editRestaurant: string}, editRestaurantInput>(
    EDIT_RESTAURANT_MUTATION, {
      variables: {
        input: {
          id: restaurantId,
          name,
          address,
          price,
          cuisine,
          features,
        },
      },
    });

  useEffect(() => {
    if (editData?.editRestaurant && hideSuccess) {
      setHideSuccess(false);
      setTimeout(() => setHideSuccess(true), 3000);
      refetchRestaurants().catch(() => false);
    }
  }, [editData?.editRestaurant]);

  return (
    <div className="edit-restaurant-container container">
      <h1>Edit Restaurant</h1>
      {!!error && (
        <div className="error">Error: {error?.message}</div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="filter-card">
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
              </select>
            </div>
          </div>
          <div className="row justify-content-center feature-list">
            {createFeatureIterable().map((feature) => {
              const featureVal = features[feature] === -1 ? null : features[feature];
              return (
                <div className="col-auto" key={feature}>
                  <label>
                    {formatScreamSnakeCase(feature)} &middot;
                    <span className='feature-num'>
                      {featureVal || 'n/a' }
                    </span>
                    {featureVal && (
                      <>
                      &middot;
                        <span
                          className='clear-feature'
                          onClick={(): void => {
                            setFeatures({
                              ...features,
                              [feature]: -1,
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
                    value={featureVal || ''}
                    onChange={(val): void => {
                      setFeatures({
                        ...features,
                        [feature]: +val.target.value || -1,
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
          {!!editError && (
            <div className="error">Error: {editError?.message}</div>
          )}
          <div className="row justify-content-center">
            <div className="col-auto">
              <button
                className="btn btn-secondary"
                onClick={(): void => closePopup()}
              >
                Cancel
              </button>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-primary"
                onClick={(): void => { void editRestaurantMutation(); }}
                disabled={editLoading || (!name || !address || !price)}
              >
                {editLoading ? 'Saving...' : 'Update Restaurant'}
              </button>
            </div>
          </div>
          {!hideSuccess && (
            <div className="success">Updated restaurant!</div>
          )}
          <div className="required-copy">
            *Required
          </div>
        </div>
      )}
    </div>
  );
};

export default EditRestaurant;
