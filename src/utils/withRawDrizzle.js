import React from "react";
import { DrizzleContext } from 'drizzle-react'

export default function withRawDrizzle (Component) {
  return class extends React.Component {
    render() {
      return (
      <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;
            return (
              <Component {...this.props} initialized={initialized} drizzle={drizzle} drizzleState={drizzleState} />
            )
          }}
        </DrizzleContext.Consumer>
      )
    }
  }
}
