import { gql } from '@apollo/client';

const EDIT_RESTAURANT_MUTATION = gql`
  mutation Mutation($input: EditRestaurantInput!) {
    editRestaurant(input: $input)
  }
`;

export default EDIT_RESTAURANT_MUTATION;
