/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import s from './styles.css';
import { title, html } from './index.md';

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
import ATLAS_ABI from './atlas_abi.json';
import UPDATE_MANAGER_ABI from './update_manager_abi.json';

class TransferPage extends React.Component {

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
    // TODO load these non-jankily via redux actions
    this.setState({
      updateManager: web3.eth.contract(UPDATE_MANAGER_ABI).at(this.state.updateManagerAddress),
    }, () => {
      const ATLAS_ADDRESS = this.state.updateManager.current_version();
      this.setState({ atlasAddress: ATLAS_ADDRESS }, () => {
        this.setState({ atlas: web3.eth.contract(ATLAS_ABI).at(this.state.atlasAddress) }, () => {
          const parcelHash = [];
          for (let i = 0; i < 10; i++) {
            if (this.state.atlas.parcel_hash_list(i) !== '0x') {
              parcelHash.push({
                value: this.state.atlas.parcel_hash_list(i),
                text: this.state.atlas.parcel_map(this.state.atlas.parcel_hash_list(i))[5],
              });
            }
          }
          this.setState({ parcelHash });
        });
      });
    });

    this.setState({
      myAddresses: web3.eth.accounts,
    });
  }

  componentDidMount() {
    document.title = title;
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
        <Input label="Atlas Address" value={this.state.atlasAddress} />
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

export default TransferPage;
