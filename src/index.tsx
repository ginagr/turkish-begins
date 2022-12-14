import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'reactjs-popup/dist/index.css';
import App from './App';
import { RestaurantQuiz } from './components';
import './index.css';
// import reportWebVitals from './reportWebVitals';

const client = new ApolloClient({
  // uri: 'http://localhost:5001/turkish-begins/us-central1/graphql',
  uri: 'https://us-central1-turkish-begins.cloudfunctions.net/graphql',
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

const mainElement = document.getElementById('turkish-begins-root') as HTMLElement;
if (mainElement) {
  const main = ReactDOM.createRoot(mainElement);
  main.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>,
  );
}

const widgetElement = document.getElementById('turkish-begins-widget') as HTMLElement;
if (widgetElement) {
  const widget = ReactDOM.createRoot(widgetElement);
  widget.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <RestaurantQuiz />
      </ApolloProvider>
    </React.StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
