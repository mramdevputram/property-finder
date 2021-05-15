import React, { Component } from 'react';
class NavBar extends Component {
    state = {  }

    render() { 
        return ( <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand active" href="/properties">Properties</a>
        <span> <a className="btn btn-primary" href="/property">Add Property</a></span>
      </nav> );
    }
}
 
export default NavBar;