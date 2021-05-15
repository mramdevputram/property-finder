import ApiBaseUrl from '../service';
import logo from '../logo.svg';

const ListPage = ({propertyList}) => {
    return ( propertyList.length ? propertyList.map((val,key) => {
        return (
            <div className="card" key={key}>
              {/* AA {val.imgs && val.imgs[0] ?val.imgs[0] : ''} */}
              <img
                className="card-img-top"
                src={
                  val.thumbNails && val.thumbNails[0]
                    ? `${ApiBaseUrl}/${val.imgs[0]}`
                    : logo
                }
                alt="Card image cap"
              />
                <div className="card-body">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Name: {val.name}</li>
                    <li className="list-group-item">Area: {val.area}</li>
                    <li className="list-group-item">Room: {val.bedroom}</li>
                </ul>
              </div>
            </div>
        );
    }) : <div  className="col-md-12 mt-50 mb-10 label label-primary"><h3 className="label label-primary">No Properties Added.</h3></div>
 );
}
 
export default ListPage;