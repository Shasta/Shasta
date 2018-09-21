import React, { Component } from 'react'
import { Step } from 'semantic-ui-react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components';

const StepContent = styled(Step.Content)`
  padding-left: 20px;
  @media only screen and (max-width: 850px) {
    &&&& {
        display: -ms-inline-flexbox ;
        display: inline-flex;
        overflow: visible;
        -ms-flex-direction: column;
        flex-direction: column;
        padding-top:10px;
    }
}
`

const ShastaStepDescription = styled(Step.Description)`
    color: #f076b6 !important;
`;

const ShastaStepTitle = styled(Step.Title)`
    color: #f076b6 !important;
`;

const ShastaStep = styled(Step)`
    background-color: #f2f2f2 !important;
    &:after {
        background-color: #f2f2f2 !important;
    };
    &.active {
        background-color: #402d41 !important;
        &:after {
            background-color: #402d41 !important;
        };
        color:white !important;
        ${ShastaStepDescription} {
            color:white !important;
        }
        ${ShastaStepTitle} {
            color:white !important;
        }
    }
    color:#f076b6 !important;
        @media only screen and (max-width: 850px) {
        &&&& {
            display: -ms-inline-flexbox ;
            display: inline-flex;
            overflow: visible;
            -ms-flex-direction: column;
            flex-direction: column;
            border: 0.5px solid gray !important;

        }
    }
    
`;

const ShastaStepGroup = styled(Step.Group)`
    height: 5vw !important;
    width: 80% !important;
    display:flex;
    @media only screen and (max-width: 850px) {
        &&&& {
            display: -ms-inline-flexbox ;
            display: inline-flex;
            overflow: visible;
            -ms-flex-direction: column;
            flex-direction: column;
            width:80%;
        }
    }
`;

class MyStep extends Component {

    render() {
        const step = this.props.step;

        return (
            <ShastaStepGroup>
                <ShastaStep active={step === 0}>
                    <Icon icon='filter' />
                    <StepContent>
                        <ShastaStepTitle>Filters</ShastaStepTitle>
                    </StepContent>
                </ShastaStep>
                <ShastaStep active={step === 1}>
                    <Icon icon='shopping-cart' />
                    <StepContent>
                        <ShastaStepTitle>Choose offer</ShastaStepTitle>
                    </StepContent>
                </ShastaStep>
                <ShastaStep active={step === 2}>
                    <Icon icon='file-signature' />
                    <StepContent>
                        <ShastaStepTitle>Confirm contract</ShastaStepTitle>
                    </StepContent>
                </ShastaStep>
            </ShastaStepGroup>
        );
    }
}

export default MyStep;