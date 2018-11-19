import React, { Component } from "react";
import withRawDrizzle from "../../utils/withRawDrizzle.js";
import { Accordion, List, Button, Transition } from 'semantic-ui-react'
import iconSHA from "../../static/sha-historic.png";
import styled from "styled-components";
import axios from "axios";
import "./Billing.css"

const ShastaIcon = styled.img`
  vertical-align: middle;
  width: 40px;
  height: 40px;
  margin-right: 20px;
`;

// Styled components
const ShastaButton = styled(Button)`
  background-color: #423142 !important;
  border-radius: 8px !important;
  padding: 12px 25px !important;
  border: 0 !important;
`;
class Billing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: "",
            bills: [],
            hardware_id: ""
        };
    }

    async componentDidMount() {

        const hardware_id = await this.getHardwareId();
        const bills = await this.getBillingData(hardware_id);
        this.setState({
            bills,
            hardware_id
        })
    }

    async getHardwareId() {

        const { drizzle, drizzleState  } = this.props;
        console.log(drizzle)
        const hardware = await drizzle.contracts.HardwareData.methods
        .getHardwareIdFromSender().call({ from: drizzleState.accounts[0] });
        if (!hardware) {
            return "";
        }
        const hardware_id = drizzle.web3.utils.hexToUtf8(hardware);

        console.log("hw: ", hardware_id);
        return hardware_id;
    }

    async getBillingData(hardware_id) {

        const result = await axios.get('http://localhost:5050/api/bills/getBill', {
            params: { hardware_id }
        })

        return result.data;
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    render() {

        const { activeIndex, bills } = this.state

        const billsAccordion = bills.map(bill => {
            const d = new Date(bill.timestamp);
            const to = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
            const consumption = (bill.consumption/1000).toFixed(2);
            const color = (bill.payed) ? 'green' : 'red';
            const payed = (bill.payed) ? 'Payed' : 'Not payed';
            const toPay = (bill.token_amount).toFixed(2);
            
            return(
            <div>
            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                <div className="accordionTitles">
                <div className="accordionTitleItem">
                    {to}
                </div>
                <div className="accordionTitleItem">
                    Consumption: {consumption} kWh
                </div>
                <div className="accordionTitleItem">
                    <span style={{color: color}}>{payed}</span>
                </div>
                </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
                <List>
                    <List.Content>
                        <b>Hardware identifier: </b> {bill.hardware_id}
                    </List.Content>
                    <List.Content>
                        <b>Watt price: </b> {bill.price_watt_hour}
                    </List.Content>
                    <List.Content>
                        <b>Consumption: </b> {consumption} kWh
                    </List.Content>
                    <List.Content>
                        <b>Amount to pay: </b> {toPay}
                    </List.Content>
                    <List.Content>
                        <b>IPFS hash: </b> {bill.ipfs_hash}
                    </List.Content>
                </List>
                <Transition visible={!bill.payed}>
                    <ShastaButton
                    primary
                    onClick={this.handleNextClick}
                    >
                    Pay bill
                    </ShastaButton>
                </Transition>
            </Accordion.Content>
            </div>
            );
        });

        return (
            <div>
                <h2>
                    <ShastaIcon src={iconSHA} />
                    Billing list
                </h2>
                <Accordion fluid styled>
                    {billsAccordion}
                </Accordion>
            </div>
        );

    }

}

export default withRawDrizzle(Billing);
