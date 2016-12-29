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

class TransferPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contractHash: '0x4c41fe20e50f12cc9ff686dc0c57f607f1a4532b',
      userHash: '0xGET_VIA_WEB3',
      parcelHash: '0x?',
      newOwnerHash: '0x?',
      newOwnerName: 'Doktor Suchandsuch',
      upperLeftLat: 1000,
      upperLeftLng: 2000,
      lowerRightLat: 5000,
      lowerRightLng: 6000,
      newParcelName: 'Somewhere Lovely',
      status: '',
      balance: '',
      officerType: '',
    };

    this.handleChangeContractHash = this.handleChangeContractHash.bind(this);
    this.handleChangeUserHash = this.handleChangeUserHash.bind(this);
    this.handleChangeParcelHash = this.handleChangeParcelHash.bind(this);
    this.handleChangeNewOwnerHash = this.handleChangeNewOwnerHash.bind(this);
    this.handleChangeNewOwnerName = this.handleChangeNewOwnerName.bind(this);
    this.handleChangeUpperLeftLat = this.handleChangeUpperLeftLat.bind(this);
    this.handleChangeUpperLeftLng = this.handleChangeUpperLeftLng.bind(this);
    this.handleChangeLowerRightLat = this.handleChangeLowerRightLat.bind(this);
    this.handleChangeLowerRightLng = this.handleChangeLowerRightLng.bind(this);
    this.handleChangeNewParcelName = this.handleChangeNewParcelName.bind(this);
  }

  componentDidMount() {
    document.title = title;
  }

  handleChangeContractHash(event) {
    this.setState({ contractHash: event.target.value });
  }

  handleChangeUserHash(event) {
    this.setState({ userHash: event.target.value });
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

  render() {
    return (
      <Layout className={s.content}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <Input label="Contract Hash" value={this.state.contractHash} />
        <Input label="My Address" value={this.state.userHash} />
        <h4>Transfer a Parcel</h4>
        <Input label="Parcel Hash" value={this.state.parcelHash} />
        <Input label="New Owner Hash" value={this.state.newOwnerHash} />
        <Input label="New Owner Name" value={this.state.newOwnerName} />
        <div><Button type="raised">Transfer</Button></div>
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
