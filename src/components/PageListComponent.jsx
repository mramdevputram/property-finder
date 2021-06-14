import React, { Component } from 'react';
import logo from '../logo.svg';
import axios from 'axios';
import ApiBaseUrl from '../service';
import ListPage from '../components/Sublist';
import SlideBar from '../components/SlideBar';
import Filters from '../components/filters'

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

     getData = async (property,isDetails,filter) => {
        filter = filter || {}
        let priceRange = filter.priceRange
       
        let params = {params: filter}
        const {data} = await axios.get(`${ApiBaseUrl}/properties`,params)
        const propertyList = data.data ? data.data.propertyList : []
        const recentList = data.data ? data.data.recentList : []
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
                <Filters getFilterData={this.getData}></Filters>
              </div>
              <div className="col-md-8 overflow-auto scrollbar scrollbar-morpheus-den"  style={{ height: "30rem"}}>
              <div className="row force-overflow">

              {this.state.isDetailedPage ? <SlideBar onListPage={this.showList} style={{ height: "30rem"}} property={this.state.property}/> : this.state.propertyList.length ? this.state.propertyList.map((val,key) => {
                    return (
                        <div className="card col-md-4" style={{width: "32rem"}} key={key} >
                          {/* AA {val.imgs && val.imgs[0] ?val.imgs[0] : ''} */}
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
                              {/* <a className="card-link">{val.viewCount} Views</a> */}
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
              </div>
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