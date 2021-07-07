import React, { Component } from 'react';
import axios from 'axios';
import ApiBaseUrl from '../service';
import { async } from 'q';
class AddProperty extends Component {

    state = { property: 
        {
            name: '',
            description: '',
            imgs: [],
            address: '',
            area: '',
            price: '',
            bedroom: 1,
            bath: 1,
            carpetArea: '',
            carpetAreaUnit: ''
    } }

    

    handleChange = ({currentTarget: input}) => {
        const property = {...this.state.property}
        property[input.name] = input.value
        this.setState({ property })
    }

    handleImageChange = async (event) => {
        let imgs = [];
        const {property} = this.state
        for (let i = 0; i < event.target.files.length; i++) {
            let base64File = await this.toBase64(event.target.files[i])
            imgs.push(base64File)
        }
        property['imgs'] = imgs
        this.setState({ property })

    }

    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

     submitProperty = async (e) => {
        e.preventDefault()
        let {property} = this.state
        const response = await axios.post(`${ApiBaseUrl}/properties`,property)
        if(response && response.data && response.data.code == 200) this.props.history.push("/properties")
    }

    render() { 
        
        return (
            // <PropertyContext.Consumer>
            //     { PropertyContext => 
                <div className="container" style={{ width: "40%" }}>
              
                <form
                  onSubmit={this.submitProperty}
                  style={{
                    textAlign: "left",
                    marginTop: "10px",
                    marginBottom: "10px"
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="pname">Property Name</label>
                    <input
                      onChange={this.handleChange}
                      name="name"
                      value={this.state.property.name}
                      autoFocus
                      type="text"
                      className="form-control"
                      id="pname"
                      aria-describedby="emailHelp"
                      placeholder="Enter Name"
                    />
                    {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      onChange={this.handleChange}
                      className="form-control"
                      name="description"
                      id="description"
                      rows="1"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="images">Add Images</label>
                    <input
                      onChange={this.handleImageChange}
                      multiple
                      accept="image/*"
                      type="file"
                      name="img"
                      className="form-control-file"
                      id="images"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                      onChange={this.handleChange}
                      className="form-control"
                      name="address"
                      id="address"
                      rows="1"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="area" name="area">
                      Locality/Area
                    </label>
                    <textarea
                      onChange={this.handleChange}
                      className="form-control"
                      name="area"
                      id="area"
                      rows="1"
                    ></textarea>
                  </div>
  
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      type="text"
                      onChange={this.handleChange}
                      className="form-control"
                      name="price"
                      id="price"
                      aria-describedby="emailHelp"
                      placeholder="Enter Price"
                    />
                    {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="Bedroom">Bedroom</label>
                    <select
                      onChange={this.handleChange}
                      className="form-control"
                      name="bedroom"
                      id="Bedroom"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="bath">Bath</label>
                    <select
                      onChange={this.handleChange}
                      className="form-control"
                      name="bath"
                      id="bath"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
  
                  <div className="form-group">
                    <label htmlFor="carpet">Carpet Area</label>
                    <input
                      onChange={this.handleChange}
                      name="carpetArea"
                      value={this.state.property.carpetArea}
                      autoFocus
                      type="text"
                      className="form-control"
                      id="carpetArea"
                      aria-describedby="emailHelp"
                      placeholder="Enter Carpet Area"
                    />
                    <select
                      onChange={this.handleChange}
                      className="form-control"
                      id="carpet"
                      name="carpetAreaUnit"
                    >
                      <option>Sq. Ft.</option>
                      <option>Sq. Yd.</option>
                      <option>Sq. Mt.</option>
                    </select>
                  </div>
  
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </form>{" "}
              </div>
            // }
            // </PropertyContext.Consumer>
            
        );
    }
}

 
export default AddProperty;