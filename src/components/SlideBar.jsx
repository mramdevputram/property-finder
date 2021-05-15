import ApiBaseUrl from '../service';
import 'react-slideshow-image/dist/styles.css'
import Moment from 'react-moment';

const SlideBar = ({property,onListPage}) => {
    let images =  property.imgs.map(val => {
        return `${ApiBaseUrl}/${val}`
    })  
    console.log("images",images)  
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <img className="card-img-top" src={images[0]} alt="Card image cap" />
            <div className="card-body">
                <h5 className="card-title">{property.name}</h5>
                <p className="card-text">{property.description}</p>
            </div>
            <ul className="list-group list-group-flush">
                    <li className="list-group-item">Price: {property.price}</li>
                    <li className="list-group-item">Area: {property.area}</li>
                    <li className="list-group-item">Room: {property.bedroom} bhk</li>
                    <li className="list-group-item">Bath Room: {property.bath} </li>
                    <li className="list-group-item">Carpet Area: {property.carpetArea} {property.carpetAreaUnit}</li>
                    <li className="list-group-item">Added Date: <Moment format="DD/MM/YYYY">
                    {property.createdAt}</Moment></li>
                    <li className="list-group-item">
                    <button type="submit" className="btn btn-primary" onClick={onListPage} >Back To List</button>
                    </li>
                    
            </ul>
            <div className="card-footer text-muted">
                Posted {new Date().getDay() - new Date(property.createdAt).getDay() == 0 ? 'Today' : new Date().getDay() - new Date(property.createdAt).getDay() +' Days Ago'}
            </div>
          </div>
        </div>
      </div>
      // {property.imgs.map(val => {
      //     return (
      //     <div className="carousel-item active">
      //        <img className="d-block w-100" src={val} alt="First slide"/>
      //     </div>
      //     )
      // })}
    );
}
 
export default SlideBar;