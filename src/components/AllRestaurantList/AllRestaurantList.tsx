import { useQuery } from '@apollo/client';
import RestaurantItem from '../RestaurantItem';
import React from 'react';
import { Restaurant } from '../../models';
import GET_ALL_RESTAURANT_QUERY from './query';
import './all-restaurant-list.scss';

const AllRestaurantList: React.FC = () => {
  const { data, loading, error } = useQuery<{
    getAllRestaurants: Restaurant[],
  }>(GET_ALL_RESTAURANT_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <div className="all-restaurant-list-container container">
      <h1>All Restaurants</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error</div>}
      {!!data?.getAllRestaurants && (
        <div>
          {data.getAllRestaurants.length === 0 && <div>No restaurant data to show</div>}
          {data?.getAllRestaurants.map((restaurant) => (
            <RestaurantItem key={restaurant.id} restaurant={restaurant}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRestaurantList;
