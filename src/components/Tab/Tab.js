import React, { Component } from "react";
import { Menu, Button } from "semantic-ui-react";
import Account from "../Account/Account";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

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
            <NavLink to="/logout">
              <Button
                style={{
                  float: "right",
                  backgroundColor: "#423142",
                  borderRadius: "8px",
                  padding: "8px 25px",
                  border: 0
                }}
                primary
              >
                Logout
              </Button>
            </NavLink>
          </DivActions>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Tab;
