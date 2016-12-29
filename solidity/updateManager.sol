
pragma solidity ^0.4.6;
contract UpdateManager{
    mapping(address => bool) public owner;
    address public current_version;

    function UpdateManager(){
        owner[msg.sender] = true;
    }

    function addOwner(address _owner){
        if(owner[msg.sender]){
            owner[_owner] = true;
        }
    }

    function removeOwner(address _owner){
        if(owner[msg.sender]){
            owner[_owner] = false;
        }
    }

    event updatedCurrentVersion(address indexed new_version, address indexed done_by_address);

    function setCurrentVersion(address _cv){
        if(owner[msg.sender]){
            updatedCurrentVersion(_cv, msg.sender);
            current_version = _cv;
        }
    }


}
