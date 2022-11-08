import { gql } from '@apollo/client';

const GET_QUIZ_LOGS_QUERY = gql`
  query GetQuizLogs($input: GetQuizLogsInput) {
    getQuizLogs(input: $input) {
      id
      minBudget
      maxBudget
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
      resultName
      resultId
      timestampAdded
    }
  }
`;

export default GET_QUIZ_LOGS_QUERY;
