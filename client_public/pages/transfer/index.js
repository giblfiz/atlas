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
import s from './styles.css';
import { title, html } from './index.md';

import GoogleMap from 'google-map-react';

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

class TransferPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    updateManagerAddress: PropTypes.string,
    updateManager: PropTypes.object,
    atlasAddress: PropTypes.string,
    atlas: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      updateManagerAddress: '0x20deed01059bd6441717a1ffb42debff2eb8d037',
      updateManager: {},
      atlasAddress: '',
      atlas: {},
      myAddresses: [],
      parcelHash: [],
      newOwnerHash: '0x0',
      newOwnerName: '0x0',
      upperLeftLat: 1000,
      upperLeftLng: 2000,
      lowerRightLat: 5000,
      lowerRightLng: 6000,
      newParcelName: 'Somewhere Lovely',
      status: '',
      balance: '',
      officerType: '',
      map_center: [37.7649791, -122.45551060000001],
      map_zoom: 9,
    };

    this.handleChangeUpdateManagerAddress = this.handleChangeUpdateManagerAddress.bind(this);
    this.handleChangeMyAddresses = this.handleChangeMyAddresses.bind(this);
    this.handleChangeParcelHash = this.handleChangeParcelHash.bind(this);
    this.handleChangeNewOwnerHash = this.handleChangeNewOwnerHash.bind(this);
    this.handleChangeNewOwnerName = this.handleChangeNewOwnerName.bind(this);
    this.handleChangeUpperLeftLat = this.handleChangeUpperLeftLat.bind(this);
    this.handleChangeUpperLeftLng = this.handleChangeUpperLeftLng.bind(this);
    this.handleChangeLowerRightLat = this.handleChangeLowerRightLat.bind(this);
    this.handleChangeLowerRightLng = this.handleChangeLowerRightLng.bind(this);
    this.handleChangeNewParcelName = this.handleChangeNewParcelName.bind(this);

    this.handleClickTransfer = this.handleClickTransfer.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getAtlas());
  }

  componentDidMount() {
    document.title = title;
  }

  componentWillReceiveProps(nextProps) {
    // console.log('nextProps', nextProps);
    const { updateManagerAddress, updateManager, atlasAddress, atlas } = nextProps;
    // console.log('updateManagerAddress, updateManager, atlasAddress, atlas');
    // console.log(updateManagerAddress, updateManager, atlasAddress, atlas);
    if (updateManagerAddress !== undefined && updateManager !== undefined &&
      atlasAddress !== undefined && atlas !== undefined) {
      const parcelHash = [];
      for (let i = 0; i < 10; i++) {
        if (atlas.parcel_hash_list(i) !== '0x') {
          parcelHash.push({
            value: atlas.parcel_hash_list(i),
            text: atlas.parcel_map(atlas.parcel_hash_list(i))[5],
          });
        }
      }
      this.setState({ parcelHash });

      this.setState({
        myAddresses: web3.eth.accounts,
      });
    }
  }

  handleChangeUpdateManagerAddress(event) {
    this.setState({ updateManagerAddress: event.target.value });
  }

  handleChangeMyAddresses(event) {
    this.setState({ myAddresses: event.target.value });
  }

  handleChangeParcelHash(event) {
    this.setState({ parcelHash: event.target.value });
  }

  handleChangeNewOwnerHash(event) {
    this.setState({ newOwnerHash: event.target.value });
  }

  handleChangeNewOwnerName(event) {
    this.setState({ newOwnerName: event.target.value });
  }

  handleChangeUpperLeftLat(event) {
    this.setState({ upperLeftLat: event.target.value });
  }

  handleChangeUpperLeftLng(event) {
    this.setState({ upperLeftLng: event.target.value });
  }

  handleChangeLowerRightLat(event) {
    this.setState({ lowerRightLat: event.target.value });
  }

  handleChangeLowerRightLng(event) {
    this.setState({ lowerRightLng: event.target.value });
  }

  handleChangeNewParcelName(event) {
    this.setState({ newParcelName: event.target.value });
  }

  handleClickTransfer() {
    this.state.atlas.transferParcel.sendTransaction(
      this.state.parcelHash[0], //TODO modify selector component and state so retrieves current
      this.state.newOwnerHash,
      this.state.newOwnerName,
      {
        from: this.state.myAddresses[0],
        gas: 1000000,
      },
    );
  }

  render() {
    return (
      <Layout className={s.content}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <Input label="Atlas Address" value={this.props.atlasAddress} />
        <label>My Address: <select>
          {this.state.myAddresses.map(address => (<option value={address}>{address}</option>))}
        </select></label>
        <h4>Transfer a Parcel</h4>
        <label>Parcel Hash: <select>
          {this.state.parcelHash.map(hash => (<option value={hash.value}>{hash.text}</option>))}
        </select></label>
        <Input label="New Owner Hash" value={this.state.newOwnerHash} />
        <Input label="New Owner Name" value={this.state.newOwnerName} />
        <div><Button type="raised" onClick={this.handleClickTransfer}>Transfer</Button></div>
        <hr />
        <h4>Create a Parcel</h4>
        <Input label="Upper Left lat" value={this.state.upperLeftLat} />
        <Input label="Upper Left lng" value={this.state.upperLeftLng} />
        <Input label="Lower Right lat" value={this.state.lowerRightLat} />
        <Input label="Lower Right lng" value={this.state.lowerRightLng} />
        <Input label="New Parcel Name" value={this.state.newParcelName} />
        <div style={{ width: 400, height: 400 }}>
          <GoogleMap
            bootstrapURLKeys={{ key: 'ExGgfDsim8Rukpfc7H6uPCrtvulG_MwSCySazIA'.split('').reverse().join('') }}
            center={this.state.map_center}
            zoom={this.state.map_zoom}
            draggable={false}
          />
        </div>
        <div><Button type="raised">Create</Button></div>
        <hr />
        <h4>Dynamic Status Information</h4>
        <span>Status: {this.state.status}</span><br />
        <span>Balance (wei): {this.state.balance}</span><br />
        <span>Officer Type: {this.state.officerType}</span>
        <div><Button type="raised">Update</Button></div>
        <p>
          <br /><br />
        </p>
      </Layout>
    );
  }

}

const mapStateToProps = ({ contracts }) => contracts;

export default connect(mapStateToProps)(TransferPage);
