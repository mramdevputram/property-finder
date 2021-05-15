import './App.css';
import NavBar from './components/NavBar'
import { Route} from 'react-router-dom';
import AddProperty from './components/AddPropertyComponent';
import PageList from './components/PageListComponent';
//  import PropertyContext from './contexts/propertyContext';
function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <div className="content">
        <Route path="/property" component={AddProperty}></Route>
        <Route path="/properties" component={PageList}></Route>
      </div>
    </div>
  );
}

export default App;
