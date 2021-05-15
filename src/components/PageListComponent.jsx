import React, { Component } from 'react';
import logo from '../logo.svg';
import axios from 'axios';
import ApiBaseUrl from '../service';
import ListPage from '../components/Sublist';
import SlideBar from '../components/SlideBar';


class PropertyList extends Component {
    state = { filter:{search:'',bathroom: '',bedroom: '',priceRange: ''},propertyList: [], recentList: [{}],isDetailedPage: false,property: {}}

    handleChange = ({currentTarget: input}) => {
      const filter = this.state.filter
      filter[input.name] = input.value
      
      this.setState({ filter })
  }
    async componentDidMount() {  
        await this.getData()
    }

     getData = async (property,isDetails) => {
        const filter = this.state.filter
        let priceRange = this.state.filter.priceRange
       
        let params = { params: filter }
        const {data} = await axios.get(`${ApiBaseUrl}/properties`,params)
        const propertyList = data.data.propertyList
        const recentList = data.data.recentList
        let {isDetailedPage} = this.state
        isDetailedPage = isDetails ? true : false
        this.setState({ propertyList,recentList,isDetailedPage, property })
    }
    
    async setProperty(property,isFavorite) {
        let obj = {_id: property._id}
        obj['isFavorite'] =  isFavorite ? !property['isFavorite'] : property['isFavorite']
        obj['for'] = isFavorite ? 'Favorite' : 'ViewCount'
        const {data} = await axios.put(`${ApiBaseUrl}/properties`,obj)   
        await this.getData(property,!isFavorite)
    }

    showList = () => {
      let {isDetailedPage} = this.state
      isDetailedPage = !isDetailedPage
      this.setState({ isDetailedPage })
    }
    
    render() { 
        return (
            
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-2">
              <form>
                <div className="form-group">
                  <input type="text" name="search" onChange={this.handleChange} className="form-control" id="exampleInputsearch1" aria-describedby="searchHelp" placeholder="Search Area"/>
                </div>
                <select
                      onChange={this.handleChange}
                      className="form-control"
                      value={this.state.filter.priceRange}
                      name="priceRange"
                      id="priceRange"
                    >
                      <option value='None'></option>
                      <option value={'0,500000'}>0L TO 5L</option>
                      <option value={'500000,1000000'}>5L TO 10L</option>
                      <option value={'1000000,2000000'}>10L TO 20L</option>
                      <option value={'2000000,3000000'}>20L TO 30L</option>
                    </select>
                <button type="button" onClick={this.getData} className="btn btn-primary">Apply</button>
              </form>
              </div>
              <div className="col-md-8 overflow-auto"  style={{ height: "30rem"}}>
                

              {this.state.isDetailedPage ? <SlideBar onListPage={this.showList} style={{ height: "30rem"}} property={this.state.property}/> : this.state.propertyList.length ? this.state.propertyList.map((val,key) => {
                    return (
                        <div className="card" key={key} >
                          {/* AA {val.imgs && val.imgs[0] ?val.imgs[0] : ''} */}
                          <div className="maintxt">
                          <img
                            className="card-img-top"
                            src={
                              val.thumbNails && val.thumbNails[0]
                                ? `${ApiBaseUrl}/${val.thumbNails[0]}`
                                : logo
                            }
                            alt="Card image cap"
                          />
                          </div>
                          <div className="card-body">
                            <h5 className="card-title">{val.area}</h5>
                            {/* <p className="card-text">
                            Some quick example text to build on the card title and
                            make up the bulk of the card's content.
                          </p> */}
                            <span>
                              <a className="btn btn-primary"
                                onClick={() => this.setProperty(val)} 
                                property={val}>
                                All Details
                              </a>
                            </span>
                            <span>
                              {" "}
                               <a className="btn btn-primary">{val.viewCount} Views</a>
                            </span>
                            <span>
                              {" "}
                               <a className="btn btn-primary" onClick={() => this.setProperty(val,true)} >
                                {!val.isFavorite ? 'Add to Favorite' : 'Unlike'} 
                              </a>
                            </span>
                          </div>
                          <div className="card-footer text-muted">
                              Posted {new Date().getDay() - new Date(val.createdAt).getDay() == 0 ? 'Today' : new Date().getDay() - new Date(val.createdAt).getDay() +' Days Ago'}
                          </div>
                        </div>
                    );
                  }) : <div  className="col-md-12 mt-50 mb-10 label label-primary"><h3 className="label label-primary">No Properties Added.</h3></div>
              }  
              </div>
              <div className="col-md-2 content overflow-auto" style={{ height: "30rem"}}>
                <div className="header" id="myHeader">
                  <h4>Recently Viewed Properties</h4>
                </div>
                <ListPage propertyList={this.state.recentList}></ListPage>
              </div>
            </div>
          </div>
        );
    }
}
 
export default PropertyList;