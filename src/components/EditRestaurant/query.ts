import { gql } from '@apollo/client';

const GET_RESTAURANT_QUERY = gql`
  query GetRestaurant($id: ID!) {
    getRestaurant(id: $id) {
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

export default GET_RESTAURANT_QUERY;
