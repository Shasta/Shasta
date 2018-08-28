import React, { Component } from 'react';
import { Button, Form} from 'semantic-ui-react'


class Index extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username : ''
        }
        // This binding is necessary to make `this` work in the callback
        this.createUser = this.createUser.bind(this);
        this.updateInput = this.updateInput.bind(this);
    }

    //It should save a json file to ipfs and save the hash to the smart contract
    createUser() {

        console.log("Creating user " + this.state.username);
        
        var User = this.props.user;
        var username = this.state.username;
        var account = this.props.account;
        console.log("contract", User)
        var ipfsHash = 'not-available';

        
        User.deployed().then(function(contractInstance) {
            contractInstance.createUser(username, ipfsHash, {gas: 200000, from: account}).then(function(success) {
            if(success) {
            console.log('created user on ethereum!');

            } else {
            console.log('error creating user on ethereum');
            }
           }).catch(function(e) {
            console.log('error creating user:', username, ':', e);
            });
            
           });

    }

    updateInput(event){
        this.setState({username : event.target.value})
    }
        
    render() {
    return (
        <Form>
        <Form.Field>
            <label>Account: {this.props.account} // Balance: {this.props.balance}</label>
            <label>Username</label>
            <input placeholder='Username' onChange={this.updateInput}/>
        </Form.Field>
        <Button type='submit' onClick={this.createUser}>Create user</Button>
        </Form>
    );
    }
}

export default Index;
