import React, { Component } from "react";

import Lottie from "react-lottie";
import animationData from "./error404 shasta.json";

class Error404 extends Component {
  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    return (
      <div style={{ margin: "auto", height: "60%", width: "60%" }}>
        <Lottie options={defaultOptions} />
        <p style={{ "margin-left": "14%" }}>
          <b>The requestd URL/xxx was not found on this server.</b>
          <br /> That's all we know.
        </p>
      </div>
    );
  }
}

export default Error404;
