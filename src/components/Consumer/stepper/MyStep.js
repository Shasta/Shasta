import React, { Component } from 'react'
import {  Step } from 'semantic-ui-react'
import { FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome'
import styled from 'styled-components';

const StepContent = styled(Step.Content)`
  padding-left: 20px;
`
class MyStep extends Component {

  render() {
    const step = this.props.step;
    return (
      <Step.Group>
        <Step active={step === 0}>
          <Icon icon='money-check' />
          <StepContent>
            <Step.Title>Amount</Step.Title>
            <Step.Description>Choose the average monthly usage</Step.Description>
          </StepContent>
        </Step>
        <Step active={step === 1}>
          <Icon icon='filter' />
          <StepContent>
            <Step.Title>Filters</Step.Title>
            <Step.Description>Select filters (optional)</Step.Description>
          </StepContent>
        </Step>
        <Step active={step === 2}>
          <Icon icon='shopping-cart' />
          <StepContent>
            <Step.Title>Choose offer</Step.Title>
          </StepContent>
        </Step>
        <Step active={step === 3}>
          <Icon icon='file-signature' />
          <StepContent>
            <Step.Title>Confirm contract</Step.Title>
          </StepContent>
        </Step>
      </Step.Group>
    );
  }
}

export default MyStep;