import React, { Component } from 'react';

import Lottie from 'react-lottie';
import LoadingJson from '../static/linea-dibujo-logo-shasta.json';

function LoadingAnimation() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingJson,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <Lottie options={defaultOptions} width={110} height={110} style={{ position: 'absolute', top: 0, rigth: 0, bottom: 0, left: 0 }}/>
  );
}

export default LoadingAnimation;
