import React, { useState } from 'react';


const Filters = (props) => {
    let [filters,setFilter] = useState({});
    const handleChange = ({currentTarget: input}) => {
        let filter = filters
        filter[input.name] = input.value
        
        setFilter(filter)
    }


    return ( <form>
        <div className="form-group">
          <input type="text" name="search" onChange={handleChange} className="form-control" id="exampleInputsearch1" aria-describedby="searchHelp" placeholder="Search Area"/>
        </div>
        <select
              onChange={handleChange}
              className="form-control"
              value={filters.priceRange}
              name="priceRange"
              id="priceRange"
            >
              <option value='None'>None</option>
              <option value={'0,500000'}>0L TO 5L</option>
              <option value={'500000,1000000'}>5L TO 10L</option>
              <option value={'1000000,2000000'}>10L TO 20L</option>
              <option value={'2000000,3000000'}>20L TO 30L</option>
            </select>
        <button type="button" onClick={() => props.getFilterData(null,null,filters)} className="btn btn-primary" style={{marginTop: '20px'}}>Apply</button>
      </form> );
}
 
export default Filters;