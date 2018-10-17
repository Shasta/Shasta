import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import withDrizzleContext from "../../utils/withDrizzleContext";
import { connect } from "react-redux";

class OrgManager extends Component {

  constructor(props) {
    super(props);

    this.redirectToAragon = this.redirectToAragon.bind(this);
  }

  redirectToAragon() {
    console.log(this.props)
    const { organization } = this.props.user;
    console.log(organization)
    window.location.href = "http://localhost:3000/#/" + organization + "shasta.aragonid.eth"
  }

  render() {

    return (
      
      <div>
        <div style={{fontSize: "1.7rem", margin:"0px 20px 0px 5px"}}>Manage your organization with Aragon</div>
        <Button
              onClick={this.redirectToAragon}
              style = {{margin:20}}
            >
              Go to Aragon
              </Button>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { user: state.userReducer };
}

export default withDrizzleContext(connect(mapStateToProps)(OrgManager));
