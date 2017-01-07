pragma solidity ^0.4.6;
contract Atlas{

uint8 constant JUDICIAL = 3;
uint8 constant FEDERAL = 2;
uint8 constant NOTARY = 1;

uint8 constant CREATE_PARCEL   = 17; //0x11
uint8 constant DISSOLVE_PARCEL  = 18; //0x12
uint8 constant TRANSFER_PARCEL = 19; //0x13
uint8 constant CREATE_OFFICER  = 20; //0x14
uint8 constant REMOVE_OFFICER  = 21; //0x15


struct Parcel{
    int256 ul_lat;
    int256 ul_lng;
    int256 lr_lat;
    int256 lr_lng;
    string owner_name;
    string street_address;
    bytes32 owner;
}

struct PendingAction{
    bytes32 parcel_hash;
    uint8 action_id;
    bytes32 owner_hash;
    address notary_signature;
    address federal_signature;
    address judicial_signature;
}


mapping (bytes32 => Parcel) public parcel_map;
bytes32[] public parcel_hash_list;
mapping (address => uint8) public officer;
mapping (bytes32 => PendingAction) public pending_action_map;


event debug_log(uint8 code);
event pendingAdded(bytes32 pa_hash);


function Atlas(address _judicial, address _notary){
    officer[msg.sender] = FEDERAL;
    officer[_judicial] = JUDICIAL;
    officer[_notary] = NOTARY;
}

function getPendingActionHash(bytes32 _parcel_hash, bytes32 _new_owner, uint8 _action_id) returns (bytes32){
  return sha3(_parcel_hash,_new_owner,_action_id);
}

function key2Hash(string _key) returns (bytes32){
  return sha3(_key, "5044a80bd3eff58302e638018534bbda8896c48a"); //salt
}

function signPending(address _target_officer, uint8 _action_id){
    bytes32 pending_action_hash =
        getPendingActionHash(sha3(_action_id),sha3(_target_officer),_action_id);
    if(pending_action_map[pending_action_hash].action_id == 0){
        pending_action_map[pending_action_hash].action_id = _action_id;
    }

    if(officer[msg.sender] == NOTARY){
        pending_action_map[pending_action_hash].notary_signature = msg.sender;
    } else if(officer[msg.sender] == FEDERAL){
        pending_action_map[pending_action_hash].federal_signature = msg.sender;
    } else if(officer[msg.sender] == JUDICIAL){
        pending_action_map[pending_action_hash].judicial_signature = msg.sender;
    }
    debug_log(0x13);
    pendingAdded(pending_action_hash);
}

function signPending(bytes32 _parcel_hash, bytes32 _new_owner_hash, uint8 _action_id, string _owner_key){
    bytes32 pending_action_hash = getPendingActionHash(_parcel_hash,_new_owner_hash,_action_id);
    if(pending_action_map[pending_action_hash].parcel_hash == ""){
        pending_action_map[pending_action_hash].action_id = _action_id;
        pending_action_map[pending_action_hash].parcel_hash = _parcel_hash;
    }

    if(parcel_map[_parcel_hash].owner == key2Hash(_owner_key)){
      pending_action_map[pending_action_hash].owner_hash = key2Hash(_owner_key);
      debug_log(0x20);
    } else {
        if(officer[msg.sender] == NOTARY){
            pending_action_map[pending_action_hash].notary_signature = msg.sender;
        } else if(officer[msg.sender] == FEDERAL){
            pending_action_map[pending_action_hash].federal_signature = msg.sender;
        } else if(officer[msg.sender] == JUDICIAL){
            pending_action_map[pending_action_hash].judicial_signature = msg.sender;
        }
    }
    debug_log(0x3);
    pendingAdded(pending_action_hash);
}

function isPendingOwnerSigned(bytes32 _parcel_hash, bytes32 _new_owner, uint8 _action_id) returns (bool){
    bytes32 pending_action_hash = getPendingActionHash(_parcel_hash,_new_owner,_action_id);
    if(pending_action_map[pending_action_hash].owner_hash != 0x0){
        if(pending_action_map[pending_action_hash].notary_signature != 0x0){
            debug_log(0x1);
            return true;
        }
    }
    return false;
}

function isPendingFormalSigned(address _target_officer, uint8 _action_id) returns (bool){
    bytes32 pending_action_hash =
        getPendingActionHash(sha3(_action_id),sha3(_target_officer),_action_id);
    if(pending_action_map[pending_action_hash].federal_signature != 0x0){
        if(pending_action_map[pending_action_hash].judicial_signature != 0x0){
            if(pending_action_map[pending_action_hash].notary_signature != 0x0){
                debug_log(0x12);
                return true;
            }
        }
    }
    return false;
}

function isPendingFormalSigned(bytes32 _parcel_hash, bytes32 _new_owner, uint8 _action_id) returns (bool){
    bytes32 pending_action_hash = getPendingActionHash(_parcel_hash,_new_owner,_action_id);
    if(pending_action_map[pending_action_hash].federal_signature != 0x0){
        if(pending_action_map[pending_action_hash].judicial_signature != 0x0){
            if(pending_action_map[pending_action_hash].notary_signature != 0x0){
                debug_log(0x2);
                return true;
            }
        }
    }
    return false;
}


event actionExecuted(bytes32 indexed _parcel_hash, bytes32 _new_owner, uint8 indexed _action_id,
    bytes32 owner, address judicial, address federal, address indexed notary);

function pendingExecuted(bytes32 _parcel_hash, bytes32 _new_owner, uint8 _action_id){
    bytes32 pending_action_hash = getPendingActionHash(_parcel_hash,_new_owner,_action_id);
    actionExecuted(_parcel_hash, _new_owner, _action_id,
    pending_action_map[pending_action_hash].owner_hash,
    pending_action_map[pending_action_hash].judicial_signature,
    pending_action_map[pending_action_hash].federal_signature,
    pending_action_map[pending_action_hash].notary_signature);
    delete pending_action_map[pending_action_hash];
}

event createParcelExecuted(bytes32 indexed parcel_hash, address judicial,
address federal, address notary, bytes32 owner);

function createParcel(int256 _ul_lat, int256 _ul_lng, int256 _lr_lat, int256 _lr_lng
, bytes32 _new_owner, string _street_address){
    //MAYBE check for collisions first?
    bytes32 parcel_hash = sha3(_ul_lat,_ul_lng,_lr_lat,_lr_lng);
    signPending(parcel_hash, _new_owner, CREATE_PARCEL, "init");
    if(isPendingFormalSigned(parcel_hash,_new_owner,CREATE_PARCEL)){
        parcel_hash_list.push(parcel_hash);
        parcel_map[parcel_hash].ul_lat = _ul_lat;
        parcel_map[parcel_hash].ul_lng = _ul_lng;
        parcel_map[parcel_hash].lr_lat = _lr_lat;
        parcel_map[parcel_hash].lr_lng = _lr_lng;
        parcel_map[parcel_hash].owner = _new_owner;
        parcel_map[parcel_hash].street_address = _street_address;
        pendingExecuted(parcel_hash,_new_owner,CREATE_PARCEL);
    }
}

event dissolvedParcel(bytes32 indexed _parcel_hash, int256 _ul_lat, int256 _ul_lng,
                      int256 _lr_lat, int256 _lr_lng, string street_address);

function dissolveParcel(bytes32 _parcel_hash){
    signPending(_parcel_hash, 0x0, DISSOLVE_PARCEL,"");
    if(isPendingFormalSigned(_parcel_hash,0x0,DISSOLVE_PARCEL)){

        //record the entire lat/ln of the disolved region
        dissolvedParcel(_parcel_hash,
        parcel_map[_parcel_hash].ul_lat,
        parcel_map[_parcel_hash].ul_lng,
        parcel_map[_parcel_hash].lr_lat,
        parcel_map[_parcel_hash].lr_lng,
        parcel_map[_parcel_hash].street_address);

        delete parcel_map[_parcel_hash];
        pendingExecuted(_parcel_hash,0x0,DISSOLVE_PARCEL);
        //How can we clean up parcel_hash_list?
    }
}

event transferedParcel(bytes32 indexed _parcel_hash, string indexed _owner_name);

function transferParcel(bytes32 _parcel_hash,bytes32 _new_owner, string _new_owner_name, string _owner_key){
    signPending(_parcel_hash, _new_owner, TRANSFER_PARCEL, _owner_key);
    if(isPendingFormalSigned(_parcel_hash,_new_owner,TRANSFER_PARCEL)
    || isPendingOwnerSigned(_parcel_hash,_new_owner,TRANSFER_PARCEL)){
        transferedParcel(_parcel_hash, parcel_map[_parcel_hash].owner_name);
        parcel_map[_parcel_hash].owner = _new_owner;
        parcel_map[_parcel_hash].owner_name = _new_owner_name;
        pendingExecuted(_parcel_hash,_new_owner,TRANSFER_PARCEL);
    }
}

function createOfficer(address _new_officer, uint8 _officer_type){
    //todo: unnessisary sha3, makes records less readable as well!
    //just did this to avoid having to refactor the bytes32 vs uint8 type
    signPending(_new_officer, CREATE_OFFICER);
    if(isPendingFormalSigned(_new_officer,CREATE_OFFICER)){
        officer[_new_officer] = _officer_type;
        // pendingExecuted(sha3(_officer_type), _new_officer, CREATE_OFFICER);
    }
}

function removeOfficer(address _new_officer){
    //todo: unnessisary sha3, makes records less readable as well!
    //just did this to avoid having to refactor the bytes32 vs uint8 type
    signPending(_new_officer, REMOVE_OFFICER);
    if(isPendingFormalSigned(_new_officer,REMOVE_OFFICER)){
        delete officer[_new_officer];
        // pendingExecuted("remove", _new_officer, REMOVE_OFFICER);

    }
}

function getParcelByOwner(bytes32 _owner) returns (bytes32){
 // note computation intensive... do not us when gas is needed
    for (uint i = 0; i < parcel_hash_list.length; i++) {
      if(parcel_map[parcel_hash_list[i]].owner == _owner){
           return parcel_hash_list[i];
      }
    }
    return ("");
}

function getParcelContainingLatLng(uint8 _lat, uint8 _lng) returns (bytes32 region){
     // note computation intensive... do not us when gas is needed
    for (uint i = 0; i < parcel_hash_list.length; i++) {
      //maybe a bug here with N/S of equator and E/W of Lat zero
      if(parcel_map[parcel_hash_list[i]].ul_lat > _lat
        && parcel_map[parcel_hash_list[i]].ul_lng < _lng
        && parcel_map[parcel_hash_list[i]].lr_lat < _lat
        && parcel_map[parcel_hash_list[i]].lr_lng > _lng
        ){
          return(parcel_hash_list[i]);
      }
    }
    return ("");
}

//function CheckForParcelConflict(bytes32 _parcel_hash);

}
