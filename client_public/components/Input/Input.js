import React, { PropTypes } from 'react';

class Input extends React.Component {

  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };

    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div>
        <label>{this.props.label}: <input
          type="text"
          value={this.state.value}
          onChange={this.handleValueChange}
        /></label>
      </div>
    );
  }
}

export default Input;
