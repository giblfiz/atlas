import React, { PropTypes } from 'react';

class Input extends React.Component {

  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    handleValueChange: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div>
        <label>{this.props.label}: <input
          type="text"
          value={this.props.value}
          onChange={this.props.handleValueChange}
        /></label>
      </div>
    );
  }
}

export default Input;
