import React, { Component } from 'react';
import { Button, Form, Sidebar, Menu, Dropdown, Message } from 'semantic-ui-react';
import Promise from 'bluebird';
import SharedMap from './SharedMap';
import axios from 'axios';

class Map extends Component {
  state = {
    visible: false,
    chargerName: "",
    chargerStatus: "open",
    chargerAddress: "",
    providerSource: "solar",
    providerAddress: "",
    chargerLatitude: "",
    chargerLongitude: "",
    price: 0,
    chargers: []
  }

  // Add Web3 event watchers at ComponentDidMount lifecycle,
  // and load the current charger locations
  async componentDidMount() {
    // Get the SharedMap.sol instance
    try {
      const sharedMapInstance = await this.props.sharedMapContract.deployed();
  
      // Watch for NewLocation events, since this current block
      sharedMapInstance.NewLocation(null, { fromBlock: 0}, (err, result) => {
        if (err) {
          console.error("Could not watch NewLocation event.", err)
          return;
        }
        const currentLatestIndex = this.state.chargers.length - 1;
        const {ipfsHash, index} = result.args
        // If the index is greater than the current one, there is a new Location!
        if (index > currentLatestIndex) {
          return axios.get(`https://ipfs.io/ipfs/${ipfsHash}`)
          .then(result => {
            this.setState({
              chargers: [...this.state.chargers, ...[result.data]]
            });
          })
          .catch(error => {
            console.error(error.response)
          });
        }
      });
  
      // Retrieve the current charger locations length, to be able to retrieve the IPFS hashes
      const locationsLengthRaw = await sharedMapInstance.getLocationsLength.call();
      const locationsLength = locationsLengthRaw.toNumber();
      // Retrieve all the current IPFS hashes, in parallel, and with concurrency 5
      const storedIpfsHashes = await Promise.map(
        // Create an array that contains a range of numbers from 0 to (locationsLength - 1) 
        Array.from({ length: locationsLength}, (value, index) => index),
        // Retrieve each IPFS hash by index
        x => sharedMapInstance.locationsIpfsHashes.call(this.props.web3.toBigNumber(x)),
        // Sets concurrency to 5, so it send requests in batches of 5.
        { concurrency: 5 }
      );
  
      // Retrieve all the JSON chargers data from IPFS, in the same way than above, using axios to grab the JSON data.
      const chargersJSON = await Promise.map(
        // Map storedIpfsHashes to an axios request
        storedIpfsHashes,
        // Retrieve each JSON data via the ipfs gateway with each ipfsHash
        ipfsHash => axios.get(`https://ipfs.io/ipfs/${ipfsHash}`)
          .then(result => result.data)
          .catch(error => ({error: error.response})),
        // Sets concurrency to 5, so it send requests in batches of 5.
        { concurrency: 5 }
      );
      this.setState({chargers: chargersJSON})
    } catch (err) {
      console.log(err);
    }
    
  }
  
  locationSelected = (lat, lng) => {
    this.setState({
      chargerLatitude: lat,
      chargerLongitude: lng
    })
  }

  openForm = (e) => {
    e.preventDefault();
    
    this.setState({visible: true})
  }

  closeForm = (e) => {
    e.preventDefault();
    
    this.setState({visible: false})
  }
  
  handleChangeDropdown = (e, data) => {
    this.setState({
      chargerStatus: data.value
    })
  }
  
  handleChangeSource = (e, data) => {
    this.setState({
      providerSource: data.value
    })
  }

  handleChange = (e, value) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addLocation = async () => {
    // Get the SharedMap.sol instance
    const sharedMapInstance = await this.props.sharedMapContract.deployed();
    const currentAddress = this.props.address;
    const web3 = this.props.web3;

    // Generate the location object, will be saved later in JSON.
    const locationObject = {
      chargerName: this.state.chargerName,
      chargerStatus: this.state.chargerStatus,
      latitude: this.state.chargerLatitude,
      longitude: this.state.chargerLongitude,
      providerSource: this.state.providerSource,
      address: this.state.providerAddress,
    }
    const priceBG = web3.toBigNumber(this.state.price);
    const jsonBuffer = Buffer.from(JSON.stringify(locationObject));
    try {
      // Show loader spinner
      this.setState({loader: true})
      // Upload to IPFS and receive response
      const ipfsResponse = await this.props.ipfs.add(jsonBuffer);
      const ipfsHash = ipfsResponse[0].hash;
      // Estimate gas
      const estimatedGas = await sharedMapInstance.addLocation.estimateGas(priceBG, ipfsHash, {from: currentAddress});
      // Send a transaction to addLocation method.
      await sharedMapInstance.addLocation(priceBG, ipfsHash, {gas: estimatedGas, from: currentAddress})  //Call the transaction
      this.setState({chargerLatitude: "", chargerLongitude: "", chargerName: "", chargerStatus: "open", visible: false, price: 0})
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const { visible, chargerName, chargerStatus,  providerAddress, providerSource, price, chargerLatitude, chargerLongitude, chargers} = this.state;
    let fieldErrors = []
    const chargerStates = [{
      text: 'Open',
      value: 'open',
    },
    {
      text: 'Closed',
      value: 'closed',
    }]
    const providerSources = [{
      text: 'Solar',
      value: 'solar',
    },
    {
      text: 'Wind',
      value: 'wind',
    },
    {
      text: 'Gas',
      value: 'gas',
    },
    {
      text: 'Carbon',
      value: 'carbon',
    }]
    if (chargerName.length === 0) {
      fieldErrors.push("Provider name can not be empty.")
    }
    if (chargerStatus.length === 0) {
      fieldErrors.push("Provider status must be selected.")
    }
    if (providerAddress.length === 0) {
      fieldErrors.push("Provider status must be selected.")
    }
    if (providerSource.length === 0) {
      fieldErrors.push("Provider source must be selected.")
    }
    if (price <= 0) {
      fieldErrors.push("Price of kWh must be set.")
    }
    if (chargerLatitude.length === 0 || chargerLatitude === 0) {
      fieldErrors.push("You must click in the map to select a location.")
    }
    return (
      <div style={{marginLeft: '375px', marginTop: '50px'}}>
        <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            onHide={this.handleSidebarHide}
            vertical
            direction='right'
            visible={visible}
            width='very wide'
        >
          <Menu.Item>
            <h3 style={{ position: 'relative' }}>New provider location</h3>
          </Menu.Item>
          <Menu.Item>
            <Form warning={!!fieldErrors.length}>
            <Form.Field>
                <p style={{ textAlign: "start"}}>You can click in the map to select the charger location. Add a provider name, and the status of the provider. Once the form is complete, click on Submit button.</p>
              </Form.Field>
              <Form.Field>
                <label>Provider name</label>
                <input type="text" placeholder='Provider name'
                  name='chargerName'
                  value={chargerName}
                  onChange={e => this.handleChange(e)} />
              </Form.Field>
              <Form.Field>
                <label>Address</label>
                <input type="text" placeholder='Av la paloma, 16, 29003'
                  name='providerAddress'
                  value={providerAddress}
                  onChange={e => this.handleChange(e)} />
              </Form.Field>
              <Form.Field>
                <label>Provider status</label>
                <Dropdown placeholder='Provider status' value={chargerStatus} name='dropdownValue' fluid selection options={chargerStates} onChange={this.handleChangeDropdown} />
              </Form.Field>
              <Form.Field>
                <label>Source of energy</label>
                <Dropdown placeholder='Source of energy' value={providerSource} name='dropdownValue' fluid selection options={providerSources} onChange={this.handleChangeSource} />
              </Form.Field>
              <Form.Field>
                <label>Price per kWh</label>
                <input type="text" placeholder='0.23'
                  name='price'
                  value={price}
                  onChange={e => this.handleChange(e)} />
              </Form.Field>
              <Form.Field>
                <label>Latitude</label>
                <input type="text" placeholder='36.718368'
                  name='chargerLatitude'
                  disabled
                  value={chargerLatitude}
                  onChange={e => this.handleChange(e)}
                />
              </Form.Field>
              <Form.Field>
                <label>Longitude</label>
                <input type="text" placeholder='-4.420235'
                  name='chargerLongitude'
                  disabled
                  value={chargerLongitude}
                  onChange={e => this.handleChange(e)} />
              </Form.Field>
              <Message warning header='Check the next fields' list={fieldErrors}/>
              <Button onClick={this.closeForm} style={{marginRight: 30}}>Close</Button>
              <Button disabled={!!fieldErrors.length} onClick={this.addLocation} type='submit'>Submit</Button>
            </Form>
          </Menu.Item>
        </Sidebar>

        <span style={{fontSize: '1.71428571rem', marginRight: 40}}>Chargers Map</span>
        <Button onClick={this.openForm}>Add a location</Button>
        <SharedMap newLocation={{chargerLatitude, chargerLongitude}} chargers={chargers} emitLocation={this.locationSelected} />
      </div>
    );
  }
}

export default Map;
