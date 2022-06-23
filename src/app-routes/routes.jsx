import React from 'react';
import {Route} from "react-router-dom";

const AddProperty = React.lazy(() => import("../components/AddPropertyComponent"));
const PageList = React.lazy(() => import("../components/PageListComponent"));

const Routes = () => {
    return (  <div className="content">
    <Route path="/property" component={AddProperty}>
    </Route>
    <Route path="/properties" component={PageList}>
    </Route>
    </div> );
}
 
export default Routes;