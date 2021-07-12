import React, { Component } from 'react';
import axios from 'axios';
import ApiBaseUrl from '../service';
import { async } from 'q';
class AddProperty extends Component {

    state = { 
      property: {
            name: '',
            description: '',
            imgs: [],
            address: '',
            area: '',
            price: '',
            bedroom: 1,
            bath: 1,
            carpetArea: '',
            carpetAreaUnit: 'Sq. Yd.'
    },
      errors: {}
            // name: 'name is required.',
      // description: 'description is required.',
      // imgs: 'images is required.',
      // address: 'address is required.',
      // area: 'area is required.',
      // price: 'price is required.',
      // bedroom: 'bedroom is required.',
      // bath: 'bath is required.',
      // carpetArea: 'carpet area is required.',
      // carpetAreaUnit: 'carpet area unit is required.' 
  }

    

    handleChange = async ({currentTarget: input}) => {
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
        await this.setState({ property })
    }

    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });





    validate = async () => {
      const errors = {}
      const { property } = this.state
      console.log("property",property)
      if(property.name.trim() == '') 
        errors.name = 'name is required'

      if(property.description.trim() == '') 
        errors.description = 'description is required'  

      if(!property.imgs.length) 
        errors.imgs = 'images is required'

      if(property.address.trim() == '') 
        errors.address = 'address is required'  

      if(property.area.trim() == '') 
        errors.area = 'area is required'

      if(property.price.trim() == '') 
        errors.price = 'price is required'  

      if(![1,2,3,4,5].includes(property.bedroom)) 
        errors.bedroom = 'bedroom is required'

      if(![1,2,3,4,5].includes(property.bath)) 
        errors.bath = 'bath is required'

      if(property.carpetArea.trim() == '') 
        errors.carpetArea = 'carpet area is required'

      if(!['Sq. Yd.','Sq. Ft.','Sq. Mt.'].includes(property.carpetAreaUnit)) 
        errors.carpetAreaUnit = 'carpet area unit is required'
      
      return Object.keys(errors).length === 0 ? null : errors
    }

     submitProperty = async (e) => {
        e.preventDefault()
        const errors = await this.validate();
        await this.setState({ errors })
        
        if(errors) return;
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
                    {this.state.errors && this.state.errors.name && <div className="alert-danger">{this.state.errors.name}</div>}
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
                    {this.state.errors && this.state.errors.description && <div className="alert-danger">{this.state.errors.description}</div>}
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
                    {this.state.errors && this.state.errors.imgs && <div className="alert-danger">{this.state.errors.imgs}</div>}
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
                    {this.state.errors && this.state.errors.address && <div className="alert-danger">{this.state.errors.address}</div>}
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
                    {this.state.errors && this.state.errors.area && <div className="alert-danger">{this.state.errors.area}</div>}
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
                    {this.state.errors && this.state.errors.price && <div className="alert-danger">{this.state.errors.price}</div>}
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
                    {this.state.errors && this.state.errors.bedroom && <div className="alert-danger">{this.state.errors.bedroom}</div>}
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
                    {this.state.errors && this.state.errors.bath && <div className="alert-danger">{this.state.errors.bath}</div>}
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
                    {this.state.errors && this.state.errors.carpetArea && <div className="alert-danger">{this.state.errors.carpetArea}</div>}
                    <select
                      defaultValue='Sq. Yd.'
                      onChange={this.handleChange}
                      className="form-control"
                      id="carpet"
                      name="carpetAreaUnit"
                    >
                      <option value='Sq. Ft.'>Sq. Ft.</option>
                      <option value='Sq. Yd.'>Sq. Yd.</option>
                      <option value='Sq. Mt.'>Sq. Mt.</option>
                    </select>
                    {this.state.errors && this.state.errors.carpetAreaUnit && <div className="alert-danger">{this.state.errors.carpetAreaUnit}</div>}
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