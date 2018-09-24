import React, { Component } from "react";
import { Menu, Button } from "semantic-ui-react";
import Account from "../Account/Account";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const ShastaButton = styled(Button)`
  background-color: #423142 !important;
  border-radius: 8px !important;
  padding: 12px 25px !important;
  border: 0 !important;
`;

const DivActions = styled.div`
  display: flex;
  align-items: center;
  & > * {
    font-size: 1rem;
    margin-left: 20px !important;
  }
`;

class Tab extends Component {
  render() {
    return (
      <Menu size="massive">
        <Menu.Menu position="right">
          <Account accountIndex={0} units="ether" precision="3" />
          <DivActions>
            <ShastaButton
              as={NavLink}
              to="/logout"
              style={{ float: "right" }}
              primary
              onClick={this.handleNextClick}
            >
              Logout
            </ShastaButton>
          </DivActions>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Tab;
