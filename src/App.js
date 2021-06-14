import './App.css';
import NavBar from './components/NavBar'
// import { Route} from 'react-router-dom';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Routes from './app-routes/routes'
//  import PropertyContext from './contexts/propertyContext';
function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <div className="content">
      <Routes></Routes>
        <Switch>
              <Route
                exact
                path="/"
                render={() => {
                    return (<Redirect to="/properties" />)
                }}
              />
        </Switch>
      </div>
    </div>
  );
}

export default App;
