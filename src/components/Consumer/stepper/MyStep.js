import React, { Component } from 'react'
import {  Step } from 'semantic-ui-react'
import { FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome'

class MyStep extends Component {

    render() {

        switch (this.props.step) {

            case 0:
                return (
                    <Step.Group>
                        <Step active>
                            <Icon icon='money-check' />
                            <Step.Content style= {{paddingLeft:20 }}>
                                <Step.Title>Amount</Step.Title>
                                <Step.Description>Choose the energy amount to buy</Step.Description>
                            </Step.Content>
                        </Step>

                        <Step>
                            <Icon icon='filter' />
                            <Step.Content style= {{paddingLeft:20 }}>
                                <Step.Title>Filters</Step.Title>
                                <Step.Description>Select filters (optional)</Step.Description>
                            </Step.Content>
                        </Step>

                        <Step>
                            <Icon icon='shopping-cart' />
                            <Step.Content style= {{paddingLeft:20 }}>
                                <Step.Title>Choose offer</Step.Title>
                            </Step.Content>
                        </Step>
                    </Step.Group>
                );
            case 1:
                return (
                    <Step.Group>
                        <Step>
                        <Icon icon='money-check' />
                            <Step.Content style= {{paddingLeft:20 }}>
                                <Step.Title>Amount</Step.Title>
                                <Step.Description>Choose the energy amount to buy</Step.Description>
                            </Step.Content>
                        </Step>

                        <Step active>
                        <Icon icon='filter' />
                            <Step.Content style= {{paddingLeft:20 }}>
                                <Step.Title>Filters</Step.Title>
                                <Step.Description>Select filters (optional)</Step.Description>
                            </Step.Content>
                        </Step>

                        <Step>
                        <Icon icon='shopping-cart' />
                            <Step.Content style= {{paddingLeft:20 }}>
                                <Step.Title>Choose offer</Step.Title>
                            </Step.Content>
                        </Step>
                    </Step.Group>
                );
            case 2:
                return (
                    <Step.Group>
                        <Step>
                        <Icon icon='money-check' />
                            <Step.Content style= {{paddingLeft:20 }}>
                                <Step.Title>Amount</Step.Title>
                                <Step.Description>Choose the energy amount to buy</Step.Description>
                            </Step.Content>
                        </Step>

                        <Step>
                        <Icon icon='filter' />
                            <Step.Content style= {{paddingLeft:20 }}>
                                <Step.Title>Filters</Step.Title>
                                <Step.Description>Select filters (optional)</Step.Description>
                            </Step.Content>
                        </Step>

                        <Step active>
                        <Icon icon='shopping-cart' />
                            <Step.Content style= {{paddingLeft:20 }}>
                                <Step.Title>Choose offer</Step.Title>
                            </Step.Content>
                        </Step>
                    </Step.Group>
                );
        }
    }
}

export default MyStep;