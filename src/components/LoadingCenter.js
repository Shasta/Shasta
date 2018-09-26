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

  const LottieStyle = {
    position: 'fixed',
    zIndex: 2000,
    overflow: 'show',
    margin: 'auto',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }

  return (
    <Lottie className="spinner" options={defaultOptions} width={110} height={110} style={LottieStyle}/>
  );
}

export default LoadingAnimation;
