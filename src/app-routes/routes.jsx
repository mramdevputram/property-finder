import React, { Component } from 'react';
import {Route} from "react-router-dom";
import AddProperty from '../components/AddPropertyComponent';
import PageList from '../components/PageListComponent';

const Routes = () => {
    return (  <div className="content">
    <Route path="/property" component={AddProperty}></Route>
    <Route path="/properties" component={PageList}></Route>
    </div> );
}
 
export default Routes;