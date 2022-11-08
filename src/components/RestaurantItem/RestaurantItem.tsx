import { useMutation } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { editSvg, trashSvg } from '../../icons';
import { Features, Restaurant } from '../../models';
import { Popup } from '../../reusables';
import { formatScreamSnakeCase } from '../../utils';
import EditRestaurant from '../EditRestaurant';
import DELETE_RESTAURANT_MUTATION from './mutation';
import './restaurant-item.scss';

interface Props {
  restaurant: Restaurant,
  selectedFeatures?: Features,
  fromQuiz?: boolean,
  refetchRestaurants?: () => Promise<any>,
}

const RestaurantItem: React.FC<Props> = (input) => {
  const {
    restaurant,
    selectedFeatures,
    fromQuiz,
    refetchRestaurants,
  } = input;

  const {
    features,
  } = restaurant;

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [
    deleteRestaurantMutation,
    { loading, error, data },
  ] = useMutation<{deleteRestaurant: string}, { id: string }>(
    DELETE_RESTAURANT_MUTATION, {
      variables: {
        id: restaurant.id,
      },
    });

  useEffect(() => {
    if (data?.deleteRestaurant && openDelete) {
      setOpenDelete(false);
      if (refetchRestaurants) {
        refetchRestaurants()
          .then(() => true).catch(() => false);
      }
    }
  }, [data?.deleteRestaurant]);

  // get relevant features
  const featuresArray = (Object.keys(features) as (keyof Features)[])
    .filter((k) => features[k] !== -1)
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
        <div className="col-12 col-md-4">
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
        <div className="col-12 col-md-8">
          <div className="feature-side">
            {!fromQuiz && (
              <>
                <img
                  src={trashSvg}
                  alt="delete"
                  onClick={(): void => setOpenDelete(true)}
                />
                <img
                  src={editSvg}
                  alt="edit"
                  onClick={(): void => setOpenEdit(true)}
                />
              </>
            )}
            <h4>Features:</h4>
            {!featuresArray.length && <div>No features.</div>}
            {featuresArray.map((featureKey) => {
              const featureRating = features[featureKey];
              return (
                <span
                  className={`feature ${rateFeature(featureRating, featureKey)}`}
                  key={String(featureKey)}
                >
                  {formatScreamSnakeCase(featureKey)}: {featureRating}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <Popup
        openPopup={openEdit}
        setOpenPopup={setOpenEdit}
        size={90}
        hideFooter={true}
      >
        <EditRestaurant
          restaurantId={restaurant.id}
          closePopup={(): void => setOpenEdit(false)}
          refetchRestaurants={refetchRestaurants || ((): Promise<any> => Promise.resolve())}
        />
      </Popup>
      <Popup
        openPopup={openDelete}
        setOpenPopup={setOpenDelete}
        onAction={deleteRestaurantMutation}
      >
        <h3>Delete Restaurant</h3>
        <p>
          Are you sure you want to delete? This is permanent.
        </p>
        {loading && 'Deleting...'}
        {!!error && (
          <div className="error">Error: {error?.message}</div>
        )}
      </Popup>
    </div>
  );
};

export default RestaurantItem;
