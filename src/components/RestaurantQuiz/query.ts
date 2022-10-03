import { gql } from '@apollo/client';

const GET_RESTAURANTS_QUERY = gql`
  query GetRestaurants($input: GetRestaurantsInput) {
    getRestaurants(input: $input) {
      id
      name
      address
      price
      cuisine
      score
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

export default GET_RESTAURANTS_QUERY;
