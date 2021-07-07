import './App.css';
// import NavBar from './components/NavBar'
// import { Route} from 'react-router-dom';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import React, { Suspense } from "react";
// import Routes from './app-routes/routes'

const NavBarComponent = React.lazy(() => import("./components/NavBar"));
const RoutesComponents = React.lazy(() =>import("./app-routes/routes"));

//  import PropertyContext from './contexts/propertyContext';
function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading</div>}>
          <NavBarComponent label="NavBarComponent" />
          <RoutesComponents label="RoutesComponents" />
      </Suspense>
      <div>
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
