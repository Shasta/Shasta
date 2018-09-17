import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled, { css } from 'styled-components';

const MarkerInfo = styled.div`
  z-index: 1100;
  background: white;
  border-radius: 5px;
  display: none;
  position: absolute;
  top: -60px;
  padding: 8px;
  min-width: 100px;
`

const MarkerWrapper = styled.div`
  position: absolute;
  top: -30px;
  left: -10px;
  &:hover > ${MarkerInfo} {
    display: block
  }
`

const Marker = styled(FontAwesomeIcon)`
  ${props => props.color && css`
    color: ${props.color}
  `}
`



class ChargerMark extends Component {
  render() {
    const { name, status, hover } = this.props;
    const statusCapitalized = status ? status.charAt(0).toUpperCase() + status.slice(1) : status;
    let markColor = "black"

    if (status === "closed") {
      markColor = 'red';
    } else if (status === "open") {
      markColor = '#0748ffeb'
    }

    return (
      <MarkerWrapper>
        { hover &&
          <MarkerInfo>
            <h4>{name}</h4>
            <span>Status: {statusCapitalized}</span>
          </MarkerInfo>
        }
        <Marker
          icon="bolt"
          size="3x"
          color={markColor}
        />
      </MarkerWrapper>
    );
  }
};

export default ChargerMark;