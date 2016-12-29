/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import s from './styles.css';
import { title, html } from './index.md';

class TransferPage extends React.Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
  };

  componentDidMount() {
    document.title = title;
  }

  render() {
    return (
      <Layout className={s.content}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <h4>Fields</h4>
        <div><label>Parcel Hash: <input type="text" /></label></div>
        <div><label>Input 2: <input type="text" /></label></div>
        <div><label>Input 3: <input type="text" /></label></div>
        <div><label>Input 4: <input type="text" /></label></div>
        <div><label>Input 5: <input type="text" /></label></div>
        <div><Button type="raised" /></div>
        <p>
          <br /><br />
        </p>
      </Layout>
    );
  }

}

export default TransferPage;
