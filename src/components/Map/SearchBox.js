import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class SearchBox extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onPlacesChanged: PropTypes.func
  }
  render() {
    return <input ref="input" placeholder="Enter an address"type="text" className={this.props.className} style={this.props.style}/>;
  }
  onPlacesChanged = () => { 
    if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.searchBox.getPlaces());
    }
  }
  componentDidMount() {
    const input = ReactDOM.findDOMNode(this.refs.input);
    this.searchBox = new window.google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }
  componentWillUnmount() {
    window.google.maps.event.clearInstanceListeners(this.searchBox);
  }
}