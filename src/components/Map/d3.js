import React from 'react';
import { GradientTealBlue, RadialGradient } from '@vx/gradient';
import { Mercator } from '@vx/geo';
import * as topojson from 'topojson-client';
import topology from './world-topo.json';

export default ({ width, height, events = false }) => {
  var width = 950;
  var height = 500;
  if (width < 10) return <div />;

  const world = topojson.feature(topology, topology.objects.units);

  return (
    <svg width={width} height={height}>
      <RadialGradient
        id="geo_mercator_radial"
        from="#fbc2eb"
        to="#a6c1ee"
        r={'80%'}
      />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={`url(#geo_mercator_radial)`}
        rx={14}
      />
      <Mercator
        data={world.features}
        scale={width / 630 * 100}
        translate={[width / 2, height / 2 + 50]}
        fill={() => 'white'}
        stroke={() => 'white'}
        onClick={data => event => {
          if (!events) return;
          alert(`Clicked: ${data.properties.name} (${data.id})`);
        }}
      />
    </svg>
  );
};
