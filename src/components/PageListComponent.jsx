import React, { Component } from 'react';
import logo from '../logo.svg';
import axios from 'axios';
import ApiBaseUrl from '../service';
import ListPage from '../components/Sublist';
import Filters from '../components/filters'
import InfiniteScroll from 'react-infinite-scroll-component';

class PropertyList extends Component {
    state = { items: Array.from({ length: 20 }),filter:{search:'',bathroom: '',bedroom: '',priceRange: ''},propertyList: [], recentList: [{}],isDetailedPage: false,property: {}}

  handleChange = ({currentTarget: input}) => {
      const filter = this.state.filter
      filter[input.name] = input.value
      this.setState({ filter,allDataLoaded: false })
  }

    async componentDidMount() {  
        await this.getData()
    }

     getData = async (property,isDetails,filter) => {
        filter = filter || {}
        filter['limit'] = 2
        filter['offset'] = this.state.propertyList.length

        let params = {params: filter}
        const {data} = await axios.get(`${ApiBaseUrl}/properties`,params)
        const propertyList = data.data ? this.state.propertyList.concat(data.data.propertyList)  : []
        if(Number(data.data.count) === Number(propertyList.length)){
          var allDataLoaded = true
        }
        // console.log(":::::: == = ",propertyList)
        const recentList = data.data ? data.data.recentList : []
        let {isDetailedPage} = this.state
        isDetailedPage = isDetails ? true : false
        this.setState({ propertyList, recentList, isDetailedPage, property,allDataLoaded })
    }

     
    scrollData = async () => {
      this.getData()
    }

    
    
    async setProperty(property,isFavorite) {
        let obj = {id: property.id}
        obj['isFavorite'] =  isFavorite ? !property['isFavorite'] : property['isFavorite']
        obj['for'] = isFavorite ? 'Favorite' : 'ViewCount'
        // const {data} = await axios.put(`${ApiBaseUrl}/properties`,obj)   
        let propertyList = []
        this.setState({ propertyList })
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
                <Filters getFilterData={this.getData}></Filters>
              </div>
              <div id="scrollableDiv" className="col-md-8 overflow-auto scrollbar scrollbar-morpheus-den"  style={{ height: "30rem"}}>
              <InfiniteScroll
                dataLength={this.state.propertyList.length}
                next={this.scrollData}
                hasMore={!this.state.allDataLoaded}
                loader={this.state.propertyList.length ? <h4>Loading...</h4> : ''}
                scrollableTarget="scrollableDiv"
              >
                {
                  this.state.propertyList && this.state.propertyList.length ? this.state.propertyList.map((val,key) => {
                    return (
                        <div className="card" style={{width: "32rem"}} key={key} >
                          <img
                            className="card-img-top"
                            src={
                              val.thumbNails && val.thumbNails[0]
                                ? `${ApiBaseUrl}/image/property_1655590550780.png`
                                : logo
                            }
                            alt="Card cap"
                          />
                           <ul className="list-group list-group-flush">
                            <li className="list-group-item">Area: {val.area}</li>
                            <li className="list-group-item">Price: {val.price}</li>
                          </ul>
                          <div className="card-body">
                                    <label  className="card-link"  onClick={() => this.setProperty(val,true)} >
                                      {!val.isFavorite ? 'Favorite' : 'Not Favorite'} 
                                    </label>
                          </div>
                          <div className="card-footer bg-transparent">
                              <span> {val.viewCount} Views</span><br></br>
                              <span>Posted {new Date().getDay() - new Date(val.createdAt).getDay() === 0 ? 'Today' : new Date().getDay() - new Date(val.createdAt).getDay() +' Days Ago'}</span>
                          </div>
                        </div>
                           
                  );
                  }) 
                  : <div  className="col-md-12 mt-50 mb-10 label label-primary"><h3 className="label label-primary">No Properties Added.</h3></div>
                }
              </InfiniteScroll>
              {/* <InfiniteScroll
                  dataLength={this.state.propertyList.length}
                  next={this.getData}
                  hasMore={true}
                  loader={<h4>Loading...</h4>}
                  scrollableTarget="scrollableDiv"
                >
                {
                  this.state.propertyList.map((val,key) => {
                    return (
                        <div className="card" style={{width: "32rem"}} key={key} >
                          <img
                            className="card-img-top"
                            src={
                              val.thumbNails && val.thumbNails[0]
                                ? `${ApiBaseUrl}/${val.thumbNails[0]}`
                                : logo
                            }
                            alt="Card image cap"
                          />
                           <ul className="list-group list-group-flush">
                            <li className="list-group-item">Area: {val.area}</li>
                            <li className="list-group-item">Price: {val.price}</li>
                          </ul>
                          <div className="card-body">
                              <a className="card-link"
                                      onClick={() => this.setProperty(val)} 
                                      property={val}>
                                      All Details
                                    </a>
                                    <a  className="card-link"  onClick={() => this.setProperty(val,true)} >
                                      {!val.isFavorite ? 'Favorite' : 'Not Favorite'} 
                                    </a>
                          </div>
                          <div className="card-footer bg-transparent">
                              <span> {val.viewCount} Views</span><br></br>
                              <span>Posted {new Date().getDay() - new Date(val.createdAt).getDay() == 0 ? 'Today' : new Date().getDay() - new Date(val.createdAt).getDay() +' Days Ago'}</span>
                          </div>
                        </div>
                           
                  );
                  }) 
                }
              </InfiniteScroll> */}
              {/* <div className="row force-overflow">

              {this.state.isDetailedPage ? <SlideBar onListPage={this.showList} style={{ height: "30rem"}} property={this.state.property}/> : this.state.propertyList.length ? this.state.propertyList.map((val,key) => {
                    return (
                        <div className="card col-md-4" style={{width: "32rem"}} key={key} >
                          <img
                            className="card-img-top"
                            src={
                              val.thumbNails && val.thumbNails[0]
                                ? `${ApiBaseUrl}/${val.thumbNails[0]}`
                                : logo
                            }
                            alt="Card image cap"
                          />
                           <ul className="list-group list-group-flush">
                            <li className="list-group-item">Area: {val.area}</li>
                            <li className="list-group-item">Price: {val.price}</li>
                          </ul>
                          <div className="card-body">
                              <a className="card-link"
                                      onClick={() => this.setProperty(val)} 
                                      property={val}>
                                      All Details
                                    </a>
                                    <a  className="card-link"  onClick={() => this.setProperty(val,true)} >
                                      {!val.isFavorite ? 'Favorite' : 'Not Favorite'} 
                                    </a>
                          </div>
                          <div className="card-footer bg-transparent">
                              <span> {val.viewCount} Views</span><br></br>
                              <span>Posted {new Date().getDay() - new Date(val.createdAt).getDay() == 0 ? 'Today' : new Date().getDay() - new Date(val.createdAt).getDay() +' Days Ago'}</span>
                          </div>
                        </div>
                           
                  );
                  })  : <div  className="col-md-12 mt-50 mb-10 label label-primary"><h3 className="label label-primary">No Properties Added.</h3></div>
                  
              }  
              </div> */}
              </div>
              <div className="col-md-2">
                <div className="header" id="myHeader">
                  <h4>Recently Viewed Properties</h4>
                </div>
                <div className="content overflow-auto scrollbar scrollbar-morpheus-den" style={{ height: "30rem"}}>
                  <ListPage  propertyList={this.state.recentList}></ListPage>
                </div>
              </div>
            </div>
          </div>
        );
    }
}
 
export default PropertyList;