import { gql } from '@apollo/client';

const DELETE_RESTAURANT_MUTATION = gql`
  mutation Mutation($id: ID!) {
    deleteRestaurant(id: $id)
  }
`;

export default DELETE_RESTAURANT_MUTATION;
