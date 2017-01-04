import Promise from 'bluebird';

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const UPDATE_MANAGER_ADDRESS = '0x20deed01059bd6441717a1ffb42debff2eb8d037';
import ATLAS_ABI from './atlas_abi.json';
import UPDATE_MANAGER_ABI from './update_manager_abi.json';

export const GET_ATLAS = 'GET_ATLAS';

export const getAtlas = updateManagerAddress => {
  const output = {
    updateManagerAddress: undefined,
    updateManager: undefined,
    atlasAddress: undefined,
    atlas: undefined,
  };

  output.updateManagerAddress = updateManagerAddress || UPDATE_MANAGER_ADDRESS;
  output.updateManager = web3.eth.contract(UPDATE_MANAGER_ABI).at(UPDATE_MANAGER_ADDRESS);
  output.atlasAddress = output.updateManager.current_version();
  output.atlas = web3.eth.contract(ATLAS_ABI).at(output.atlasAddress);

  return {
    type: GET_ATLAS,
    payload: Promise.resolve(output),
  };
};