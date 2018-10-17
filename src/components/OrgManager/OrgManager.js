import React, { Component } from 'react';
import { Button, Image } from 'semantic-ui-react';
import withDrizzleContext from '../../utils/withDrizzleContext';
import { connect } from 'react-redux';
import styled from 'styled-components';
import AragonLogo from '../../static/aragon-logo.png';
import EnsLogo from '../../static/enslogo.png';

const ARAGON_URL = process.env.ARAGON_URL;

const AragonButton = styled(Button)`
 &&& {
  width: 200px;
  height: 200px;
  background: white;
  color: black;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  &:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    background: white;
  }
  &&&&&.disabled {
    background: inherit !important;
    background-image: inherit !important;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23) !important;
  }
 }
`;
const FlexDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

`;

class OrgManager extends Component {

  constructor(props) {
    super(props);

    this.redirectToAragon = this.redirectToAragon.bind(this);
  }

  redirectToOrganization() {
    console.log(this.props)
    const { organization } = this.props.user;
    console.log(organization)

    window.location.href = ARAGON_URL + '/#/' + organization + 'shasta.aragonid.eth';
  }

  redirectToAragon() {
    window.location.href = ARAGON_URL;
  }

  render() {
    const isAragonOrg = false;
    if (isAragonOrg) {
      return (
        <div>
          <div style={{fontSize: "1.7rem", margin:"0px 20px 0px 5px"}}>Manage your organization with Aragon</div>
          <Button
            onClick={this.redirectToOrganization}
            style = {{margin:20}}
            elevation={3}
          >
            Go to your Aragon organization
          </Button>
        </div>
      );
    }
    return (
      <div>
        <div style={{fontSize: "1.7rem", margin:"0px 20px 0px 5px"}}>Manage your organization with Aragon</div>
        <FlexDiv style={{marginTop: 20}}>
          <AragonButton disabled
              // onClick={this.redirectToJoin}
              style = {{margin:20}}
          >
            <Image src={EnsLogo} centered style={{ maxWidth: 90}}/>
            <p style={{marginTop: 10}}>
              Join to current organization
            </p>
          </AragonButton>
          <AragonButton
              onClick={this.redirectToAragon}
              style = {{margin:20}}
          >
            <Image src={AragonLogo} centered style={{ maxWidth: 90}}/>
            <p style={{marginTop: 10}}>
              Create your organization
            </p>
          </AragonButton>
        </FlexDiv>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { user: state.userReducer };
}

export default withDrizzleContext(connect(mapStateToProps)(OrgManager));
