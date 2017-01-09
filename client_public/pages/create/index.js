/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { getAtlas } from '../../actions';

import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Qr from  '../../components/Qr/Qr.js';
import QrReader from 'react-qr-reader';


import s from './styles.css';
import { title, html } from './index.md';

import GoogleMap from 'google-map-react';

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// const web3 = new Web3(new Web3.providers.HttpProvider('http://34.192.3.172:8545'));


class TransferPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    updateManagerAddress: PropTypes.string,
    updateManager: PropTypes.object,
    atlasAddress: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      updateManagerAddress: '0xee80b2e89f7cc42e3b433107e989f71858070732',
      updateManager: {},
      atlasAddress: '',
      myAddresses: [],
      myAddress: '',
      newParcelName: 'Somewhere Lovely',
      status: '',
      balance: '',
      officerType: 'Unset Yet',
      map: undefined,
      maps: undefined,
      map_center: [33.678, -116.243],
      map_zoom: 12,
      north: 33.685,
      south: 33.671,
      east: -116.234,
      west: -116.251,
    };

    this.handleChangeUpdateManagerAddress = this.handleChangeUpdateManagerAddress.bind(this);
    this.handleChangeMyAddresses = this.handleChangeMyAddresses.bind(this);
    this.handleChangeNorth = this.handleChangeNorth.bind(this);
    this.handleChangeWest = this.handleChangeWest.bind(this);
    this.handleChangeSouth = this.handleChangeSouth.bind(this);
    this.handleChangeEast = this.handleChangeEast.bind(this);
    this.handleChangeNewParcelName = this.handleChangeNewParcelName.bind(this);

    this.handleClickCreate = this.handleClickCreate.bind(this);

    this.handleGoogleApiLoaded = this.handleGoogleApiLoaded.bind(this);
    this.handleUpdateParcelRect = this.handleUpdateParcelRect.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getAtlas());
  }

  componentDidMount() {
    document.title = title;
  }

  componentWillReceiveProps(nextProps) {
    const { updateManagerAddress, updateManager, atlasAddress, atlas } = nextProps;
    if (updateManagerAddress !== undefined
        && updateManager !== undefined
        && atlasAddress !== undefined
        && atlas !== undefined) {
      this.setState({
        myAddresses: web3.eth.accounts,
        myAddress: web3.eth.accounts[0],
        balance: web3.fromWei(
           web3.eth.getBalance(web3.eth.accounts[0]).toNumber(),
           'ether'),
        officerType: this.getOfficerType(web3.eth.accounts[0], atlas),
      });
    }
  }

  getOfficerType = (account_address, atlas = null) => {
    if (atlas == null){
      var officer_type_number = this.props.atlas.officer(account_address);
    } else {
      var officer_type_number = atlas.officer(account_address);
    }
    var ot = '';
    if (officer_type_number == 1) {
      ot = 'Notary';
    } else if (officer_type_number == 2) {
      ot = 'Federal';
    } else if (officer_type_number == 3) {
      ot = 'Judicial';
    } else if (officer_type_number == 0) {
      ot = 'Not an officer';
    }
    return ot;
  };

  handleChangeUpdateManagerAddress(event) {
    this.setState({ updateManagerAddress: event.target.value });
  }

  handleChangeMyAddresses(event) {
    this.setState({ myAddress: event.target.value,
      balance: web3.fromWei(web3.eth.getBalance(event.target.value).toNumber(), 'ether'),
      officerType: this.getOfficerType(event.target.value),
    });
  }

  handleChangeNorth(event) {
    this.setState({ north: Number(event.target.value) });
  }

  handleChangeWest(event) {
    this.setState({ west: Number(event.target.value) });
  }

  handleChangeSouth(event) {
    this.setState({ south: Number(event.target.value) });
  }

  handleChangeEast(event) {
    this.setState({ east: Number(event.target.value) });
  }

  handleChangeNewParcelName(event) {
    this.setState({ newParcelName: event.target.value });
  }

  handleUpdateParcelRect() {
    const { north, south, east, west, map, maps } = this.state;

    if (this.state.removeRect) this.state.removeRect();
    const newParcelRect = new maps.Rectangle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map,
      bounds: {
        north,
        south,
        east,
        west,
      },
    });

    this.setState({
      currentParcelRect: newParcelRect,
      removeRect: () => {
        newParcelRect.setMap(null);
      },
    });
  }

  handleClickCreate() {
    this.props.atlas.createParcel.sendTransaction(
      Math.round(100000 * parseFloat(this.state.north)).toString(),
      Math.round(100000 * parseFloat(this.state.west)).toString(),
      Math.round(100000 * parseFloat(this.state.south)).toString(),
      Math.round(100000 * parseFloat(this.state.east)).toString(),
      '0x0',
      this.state.newParcelName,
      {
        from: this.state.myAddress,
        gas: 1000000,
      }
    );
  }

  handleGoogleApiLoaded({ map, maps }) {
    this.setState({ map, maps }, () => {
      this.handleUpdateParcelRect();
    });
  }

  render() {
    return (
      <Layout className={s.content}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <label>My Address: <select label="My Addressess" onChange={this.handleChangeMyAddresses}>
          {this.state.myAddresses.map(address => (<option value={address}>{address}</option>))}
        </select></label>
        <br />
        <span>Balance (Ether): {this.state.balance}</span><br />
        <span>Officer Type: {this.state.officerType}</span>
        <hr />

        <h4>Parcel Details</h4>
        <Input
          label="North"
          value={this.state.north}
          handleValueChange={this.handleChangeNorth}
        />
        <Input
          label="West"
          value={this.state.west}
          handleValueChange={this.handleChangeWest}
        />
        <Input
          label="South"
          value={this.state.south}
          handleValueChange={this.handleChangeSouth}
        />
        <Input
          label="East"
          value={this.state.east}
          handleValueChange={this.handleChangeEast}
        />
        <Input
          label="New Parcel Name"
          value={this.state.newParcelName}
          handleValueChange={this.handleChangeNewParcelName}
        />
        <div>
          <Button type="raised" onClick={this.handleUpdateParcelRect}>Update Parcel</Button>
        </div>
        <div style={{ width: 300, height: 300 }}>
          <GoogleMap
            bootstrapURLKeys={{ key: 'ExGgfDsim8Rukpfc7H6uPCrtvulG_MwSCySazIA'
              .split('').reverse().join('') }}
            center={this.state.map_center}
            zoom={this.state.map_zoom}
            draggable={true}
            onGoogleApiLoaded={this.handleGoogleApiLoaded}
          />
        </div>
        <div><Button type="raised" onClick={this.handleClickCreate}>Create</Button></div>
      </Layout>
    );
  }

}

const mapStateToProps = ({ contracts }) => contracts;

export default connect(mapStateToProps)(TransferPage);
