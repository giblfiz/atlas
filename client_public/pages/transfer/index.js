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


import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

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
      parcelHash: [],
      parcelHashActive: '',
      parcelActive: [],
      newOwnerHash: '0x0',
      oldOwnerKey: '',
      newOwnerName: 'Jhonny Appleseed',
      upperLeftLat: 1000,
      upperLeftLng: 2000,
      lowerRightLat: 5000,
      lowerRightLng: 6000,
      newParcelName: 'Somewhere Lovely',
      status: '',
      balance: '',
      officerType: 'Unset Yet',
    };

    this.handleChangeUpdateManagerAddress = this.handleChangeUpdateManagerAddress.bind(this);
    this.handleChangeMyAddresses = this.handleChangeMyAddresses.bind(this);
    this.handleChangeParcelHash = this.handleChangeParcelHash.bind(this);
    this.handleChangeNewOwnerHash = this.handleChangeNewOwnerHash.bind(this);
    this.handleChangeOldOwnerKey = this.handleChangeOldOwnerKey.bind(this);
    this.handleChangeNewOwnerName = this.handleChangeNewOwnerName.bind(this);
    this.handleChangeUpperLeftLat = this.handleChangeUpperLeftLat.bind(this);
    this.handleChangeUpperLeftLng = this.handleChangeUpperLeftLng.bind(this);
    this.handleChangeLowerRightLat = this.handleChangeLowerRightLat.bind(this);
    this.handleChangeLowerRightLng = this.handleChangeLowerRightLng.bind(this);
    this.handleChangeNewParcelName = this.handleChangeNewParcelName.bind(this);

    this.handleClickTransfer = this.handleClickTransfer.bind(this);
    this.handleClickCreate = this.handleClickCreate.bind(this);

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
        pacelhashActive:parcelHash[0].value,
        parcelActive: atlas.parcel_map(parcelHash[0].value)
      });

      this.setState({
        myAddresses: web3.eth.accounts,
        myAddress:web3.eth.accounts[0],
        balance: web3.fromWei(
           web3.eth.getBalance(web3.eth.accounts[0]).toNumber(),
           "ether"),
        officerType:  this.getOfficerType(web3.eth.accounts[0], atlas)
      });
    }
  }

  handleChangeUpdateManagerAddress(event) {
    this.setState({ updateManagerAddress: event.target.value });
  }

  getOfficerType = (account_address, atlas = null) => {
        if(atlas == null){
          var officer_type_number = this.props.atlas.officer(account_address);
        } else {
          var officer_type_number = atlas.officer(account_address);
        }
        var ot="";
        if(officer_type_number == 1){
          ot = "Notary";
        } else if(officer_type_number == 2){
          ot = "Federal";
        } else if(officer_type_number == 3){
          ot = "Judicial";
        } else if(officer_type_number == 0){
            ot = "Not an officer";
        }
        return ot;
  };

  handleChangeMyAddresses(event) {
    this.setState({myAddress: event.target.value,
                   balance: web3.fromWei(
                      web3.eth.getBalance(event.target.value).toNumber(),
                      "ether"),
                   officerType:  this.getOfficerType(event.target.value)});
  }

  handleChangeParcelHash(event) {
    this.setState({ parcelHashActive: event.target.value,
                    parcelActive: this.props.atlas.parcel_map(event.target.value)});
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

  handleChangeOfficerType(event) {
    this.setState({ officerType: event.target.value });
  }

  handleChangeOldOwnerKey(event){
    this.setState({ oldOwnerKey: event.target.value });
  }


  handleClickTransfer() {
    this.props.atlas.transferParcel.sendTransaction(
      this.state.parcelHashActive,
      this.state.newOwnerHash,
      this.state.newOwnerName,
      this.state.oldOwnerKey,
      {
        from: this.state.myAddress,
        gas: 1000000,
      },
    );
  }

  handleClickCreate(){
    this.props.atlas.createParcel.sendTransaction(
      this.state.upperLeftLat,
      this.state.upperLeftLng,
      this.state.lowerRightLat,
      this.state.lowerRightLng,
      "0x0",
      this.state.newParcelName,
      {
        from: this.state.myAddress,
        gas:1000000
      }
    )
  }

  getParcelOwnerString(parcel){
    if(parcel[5]){
      return parcel[5] + " owner is ''" + parcel[4] + "'' addr:" + parcel[6];
    } else { return " "}
  }

  render() {
    return (
      <Layout className={s.content}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <Input label="Atlas Address" value={this.props.atlasAddress} />
        <label>My Address: <select label="My Addressess" onChange={this.handleChangeMyAddresses}>
          {this.state.myAddresses.map(address => (<option value={address}>{address}</option>))}
        </select></label>
        <br/>
        <span>Balance (Ether): {this.state.balance}</span><br />
        <span>Officer Type: {this.state.officerType}</span>

        <h4>Transfer a Parcel</h4>
        <label>Parcel: <select onChange={this.handleChangeParcelHash}>
          {this.state.parcelHash.map(hash => (<option value={hash.value}>{hash.text}</option>))}
        </select>
        <p>{this.getParcelOwnerString(this.state.parcelActive)}</p></label>
        <Input label="New Owner Hash" value={this.state.newOwnerHash}
        handleValueChange={this.handleChangeNewOwnerHash} />
        <Input type="text" label="New Owner Name"
          value={this.state.newOwnerName}
          handleValueChange={this.handleChangeNewOwnerName} />
          <Input type="text" label="Old Owner Key"
            value={this.state.oldOwnerKey}
            handleValueChange={this.handleChangeOldOwnerKey} />(leave owner key blank for Notary/Admin actions)
        <div><Button type="raised" onClick={this.handleClickTransfer}>Transfer</Button></div>
        <hr />
        <h4>Create a Parcel</h4>
        <Input label="Upper Left lat" value={this.state.upperLeftLat}
          handleValueChange={this.handleChangeUpperLeftLat}/>
        <Input label="Upper Left lng" value={this.state.upperLeftLng}
          handleValueChange={this.handleChangeUpperLeftLng}/>
        <Input label="Lower Right lat" value={this.state.lowerRightLat}
          handleValueChange={this.handleChangeLowerRightLat}/>
        <Input label="Lower Right lng" value={this.state.lowerRightLng}
          handleValueChange={this.handleChangeLowerRightLng}/>
        <Input label="New Parcel Name" value={this.state.newParcelName}
          handleValueChange={this.handleChangeNewParcelName}/>
        <div><Button type="raised" onClick={this.handleClickCreate}>Create</Button></div>
        <hr />
      </Layout>
    );
  }

}

const mapStateToProps = ({ contracts }) => contracts;

export default connect(mapStateToProps)(TransferPage);
