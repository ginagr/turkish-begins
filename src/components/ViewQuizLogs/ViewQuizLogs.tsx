import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Features, getQuizLogsInput, QuizLog } from '../../models';
import { Popup } from '../../reusables';
import { formatScreamSnakeCase } from '../../utils';
import EditRestaurant from '../EditRestaurant';
import GET_QUIZ_LOGS_QUERY from './query';
import './view-quiz-logs.scss';

const ViewQuizLogs: React.FC = () => {
  const [cursor, setCursor] = useState<string>();
  const [noMoreResults, setNoMoreResults] = useState<boolean>(false);
  const [logList, setLogList] = useState<QuizLog[]>([]);
  const [showRestaurant, setShowRestaurant] = useState<string>();

  const res = useQuery<{
    getQuizLogs: QuizLog[],
  }, getQuizLogsInput>(GET_QUIZ_LOGS_QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        cursor,
      },
    },
    onCompleted: ({ getQuizLogs }) => {
      setLogList(logList.concat(getQuizLogs));
      setNoMoreResults(getQuizLogs?.length < 20);
    },
  });

  const { loading, error } = res;

  return (
    <div className="view-quiz-logs-container container">
      <h1>View Quiz Logs</h1>
      <div className="text-center">
        {loading && <div>Loading...</div>}
        {error && <div className="error">Error: {error.message} </div>}
        {!!logList.length && (
          <div className="row title-row">
            <div className="col-2">
              Timestamp
            </div>
            <div className="col-1">
              Budget
            </div>
            <div className="col-2">
              Cuisine
            </div>
            <div className="col-5">
              Features
            </div>
            <div className="col-2">
              Result
            </div>
          </div>
        )}
        {logList.map((d) => (
          <div className="row log-row" key={d.id}>
            <div className="col-2">
              {dayjs(d.timestampAdded).format('MMM D, YYYY h:mm A')}
            </div>
            <div className="col-1">
              {d.minBudget ?? 'n/a'} - {d.maxBudget ?? 'n/a'}
            </div>
            <div className="col-2">
              {formatScreamSnakeCase(d.cuisine || 'Anything')}
            </div>
            <div className="col-5">
              {
                (Object.keys(d.features))
                  .filter((k) => !!d.features[k as keyof Features])
                  .map((k) => formatScreamSnakeCase(k))
                  .join(', ') || 'n/a'
              }
            </div>
            <div className="col-2">
              {d.resultName ? (
                <span
                  className="click-action"
                  onClick={(): void => setShowRestaurant(d.resultId)}
                >
                  {d.resultName}
                </span>
              ) : (
                <span className="no-action" >
                  NO RESULT
                </span>
              )}
            </div>
          </div>
        ))}
        {!noMoreResults && (
          <button
            onClick={(): void => setCursor(logList[logList.length - 1].timestampAdded.toString())}
            className="load-button btn btn-secondary"
            disabled={loading}
          >
            Load More
          </button>
        ) }
      </div>
      <Popup
        openPopup={!!showRestaurant}
        setOpenPopup={(): void => setShowRestaurant(undefined)}
        size={90}
        hideFooter={true}
      >
        <EditRestaurant
          restaurantId={showRestaurant!}
          closePopup={(): void => setShowRestaurant(undefined)}
          refetchRestaurants={ ((): Promise<any> => Promise.resolve())}
        />
      </Popup>
    </div>
  );
};

export default ViewQuizLogs;
