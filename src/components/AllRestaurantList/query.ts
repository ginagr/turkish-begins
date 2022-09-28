import { gql } from '@apollo/client';

const GET_ALL_RESTAURANT_QUERY = gql`
  query GetAllRestaurants {
    getAllRestaurants {
      id
      name
      address
      price
      cuisine
      features {
        KID_FRIENDLY
        VEGETARIAN
        VEGAN
        VIEW
        INSTAGRAM
        ALCOHOL
        CLOSE_ATTRACTIONS
        OUTDOOR_SEATING
        NON_SMOKING
      }
    }
  }
`;

export default GET_ALL_RESTAURANT_QUERY;
