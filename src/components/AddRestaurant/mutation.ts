import { gql } from '@apollo/client';

const ADD_RESTAURANT_MUTATION = gql`
  mutation Mutation($input: AddRestaurantInput!) {
    addRestaurant(input: $input)
  }
`;

export default ADD_RESTAURANT_MUTATION;
