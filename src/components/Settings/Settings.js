import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
class Settings extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            country: this.props.userJson.organization.country,
            region: this.props.userJson.organization.region,
            lastName: this.props.userJson.organization.lastName,
            firstName: this.props.userJson.organization.firstName,
            address: this.props.userJson.organization.address,
            zipCode: this.props.userJson.organization.zipCode,
            name: this.props.userJson.organization.name
        };
        this.updateOrganization = this.updateOrganization.bind(this);

    }

    selectCountry(val) {
        this.setState({ country: val });
    }

    selectRegion(val) {
        this.setState({ region: val });
    }

    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        })
      }

    //It should save a json file to ipfs and save the hash to the smart contract
    async updateOrganization() {

        var orgData = this.props.userJson;
        console.log("updating organization " + this.state.name);

        orgData.organization.region = this.state.region;
        orgData.organization.firstName = this.state.firstName;
        orgData.organization.lastName = this.state.lastName;
        orgData.organization.address = this.state.address;
        orgData.organization.zipCode = this.state.zipCode;
        orgData.organization.country = this.state.country; 
        orgData.organization.name = this.state.name;
        console.log("Org data: ", orgData);
        var ipfsHash = '';

        const res = await this.props.ipfs.add([Buffer.from(JSON.stringify(orgData))]);

        ipfsHash = res[0].hash;
        console.log("ipfs hash: ", ipfsHash);
        const contractInstance = await this.props.userContract.deployed();

        console.log("address:", this.props.address);
        const success = await contractInstance.updateUser(ipfsHash, { gas: 400000, from: this.props.address });
        if (success) {
            console.log("self:", self)
            console.log('updated organization ' + orgData.organization.name + ' on ethereum!');
            //this.setState({ isLoged: true })
        } else {
            console.log('error creating userupdating organization on ethereum');
        }
    }

    render() {
        const { country, region } = this.state;
        return (
            <div>
                <Form style={{ marginLeft: 400, marginTop: 20, width: "50%" }}>
                    <Form.Field>
                        <label>Organization Name</label>
                        <input placeholder='Organization Name' name='name' onChange={e => this.handleChange(e)} value={this.state.name} />
                    </Form.Field>
                    <Form.Field>
                        <label>First Name</label>
                        <input placeholder='First Name' name='firstName' onChange={e => this.handleChange(e)} value={this.state.firstName} />
                    </Form.Field>
                    <Form.Field>
                        <label>Last Name</label>
                        <input placeholder='Last Name' name='lastName' onChange={e => this.handleChange(e)} value={this.state.lastName} />
                    </Form.Field>
                    <Form.Field>
                        <label>Country</label>
                        <CountryDropdown
                            value={country}
                            onChange={(val) => this.selectCountry(val)} />
                        <label>Region</label>
                        <RegionDropdown
                            country={country}
                            value={region}
                            onChange={(val) => this.selectRegion(val)} />
                    </Form.Field>
                    <Form.Field>
                        <label>Address</label>
                        <input placeholder='Address' name='address' onChange={e => this.handleChange(e)} value={this.state.address} />
                    </Form.Field>
                    <Form.Field>
                        <label>Zip Code</label>
                        <input placeholder='Zip Code' name='zipCode' onChange={e => this.handleChange(e)} value={this.state.zipCode} />
                    </Form.Field>
                    <Button type='submit' onClick={this.updateOrganization}>Submit</Button>
                </Form>
            </div>
        );

    }
}

export default Settings;