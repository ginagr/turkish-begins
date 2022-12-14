import {
  BrowserRouter, Link, Route, Routes,
} from 'react-router-dom';
import './App.scss';
import {
  AddRestaurant, AllRestaurantList, RestaurantQuiz, ViewQuizLogs,
} from './components';

const App = (): JSX.Element => (
  <div className="App">
    <BrowserRouter>
      <div className="header">
        <div className="row g-0 justify-content-center">
          <div className="col-12 col-md-auto">
            <Link to="/" className="action-tab">
              View All Restaurants
            </Link>
          </div>
          <div className="col-12 col-md-auto">
            <Link to="/add" className="action-tab">
              Add Restaurant
            </Link>
          </div>
          <div className="col-12 col-md-auto">
            <Link to="/quiz" className="action-tab">
              View Quiz
            </Link>
          </div>
          <div className="col-12 col-md-auto">
            <Link to="/logs" className="action-tab">
              Quiz Logs
            </Link>
          </div>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<AllRestaurantList />} />
        <Route path="add" element={<AddRestaurant />} />
        <Route path="quiz" element={<RestaurantQuiz />} />
        <Route path="logs" element={<ViewQuizLogs />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
