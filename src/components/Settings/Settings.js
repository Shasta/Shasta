import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import withDrizzleContext from '../../utils/withDrizzleContext';
import { connect } from 'react-redux';
import ipfs from '../../ipfs';
import _ from 'lodash';

class Settings extends Component {
    state = {
        country: '',
        region: '',
        lastName: '',
        firstName: '',
        address: '',
        zipCode: '',
        name: '',
        userJson: {}
    };

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
    updateOrganization = async () => {
        const {drizzle, drizzleState} = this.props;
        const currentAccount = drizzleState.accounts[0];
        const web3 = drizzle.web3;

        const orgData = _.cloneDeep(this.state.userJson);

        orgData.organization.region = this.state.region;
        orgData.organization.firstName = this.state.firstName;
        orgData.organization.lastName = this.state.lastName;
        orgData.organization.address = this.state.address;
        orgData.organization.zipCode = this.state.zipCode;
        orgData.organization.country = this.state.country; 
        orgData.organization.name = this.state.name;

        const res = await ipfs.add([Buffer.from(JSON.stringify(orgData))]);

        const ipfsHash = res[0].hash;
        const rawIpfsHash = web3.utils.utf8ToHex(ipfsHash);
        const estimateGas = await drizzle.contracts.User.methods.updateUser(rawIpfsHash).estimateGas({ from: currentAccount });
        const success = await drizzle.contracts.User.methods.updateUser(rawIpfsHash).send({ gas: estimateGas, from: currentAccount });
        if (success) {
            console.log("self:", self)
            console.log('updated organization ' + orgData.organization.name + ' on ethereum!');
            //this.setState({ isLoged: true })
        } else {
            console.log('error creating userupdating organization on ethereum');
        }
    }

    async componentDidMount() {
        const { drizzle, drizzleState } = this.props;
        const { organization } = this.props.user;
        const currentAccount = drizzleState.accounts[0];
    
        const web3 = drizzle.web3;
        const rawOrgName = web3.utils.utf8ToHex(organization);
        const rawHash = await drizzle.contracts.User.methods.getIpfsHashByUsername(rawOrgName).call({from: currentAccount});
        const ipfsHash = web3.utils.hexToUtf8(rawHash);
        const rawJson = await ipfs.cat(ipfsHash);
        const userJson = JSON.parse(rawJson);
    
    
        // Get the SharedMap.sol instance
        try {
          this.setState({
            userJson,
            country: userJson.organization.country,
            region: userJson.organization.region,
            lastName: userJson.organization.lastName,
            firstName: userJson.organization.firstName,
            address: userJson.organization.address,
            zipCode: userJson.organization.zipCode,
            name: userJson.organization.name,
          });
        } catch (err) {
          console.log(err);
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

function mapStateToProps(state, props) { return { user: state.userReducer } }


export default withDrizzleContext(
  connect(
    mapStateToProps,
  )(Settings)
);