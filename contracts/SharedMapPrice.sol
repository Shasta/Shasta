pragma solidity ^0.4.24;

import './OpenZeppelin/Ownable.sol';
import './OpenZeppelin/Pausable.sol';
import './User.sol';
import './ShastaMarket.sol';

 /**
  * @title SharedMapPrice
  * This contracts attempts to allow registered users to add locations into a shared map,
  * where each location is stored in IPFS. Users can add new locations and update their own
  * locations.
  *
  * There is a Circuit Breaker contract in case an attack happens,
  * that pauses the update and the addition of new locations.
  * 
  * In this way if there is a security breach there is time to
  * apply a patch and deploy a new contract with the desired version.
  *
  *  NOTES:
  *  Current fields that Location JSON data could have:
   * - latitude, longitude, chargerStatus, chargerName, userAddress, locationIndex
  */
contract SharedMapPrice is Ownable, Pausable {
  address public owner;
  address public userContractAddress; 
  address public shastaMarketAddress;

  ShastaMarket shastaMarket;

  User public userStorage;

  event NewLocation(string ipfsHash, uint index);
  event LocationUpdate(string ipfsHash, uint index);

  /**
   * @dev Link user address to location indexes.
   */
  mapping(uint => address) public locationIndexByAddress;

  /**
   * @dev Store each location IPFS hash into an array.
   */
  string[] public locationsIpfsHashes;

  /**
   * @dev Throws if non-user is trying to interact with the contract method.
   */
  modifier onlyUser() {
    require(userStorage.hasUser(msg.sender));
    _;
  }

  /**
    * @dev Constructor, initiate contract and sets the User contract address to be able to interact with it.
    * @param contractAddress The deployed User contract address.
    */
  constructor(address contractAddress, address _shastaMarketAddress) public {
    owner = msg.sender;

    // Set the User contract instance
    userContractAddress = contractAddress;
    userStorage = User(userContractAddress);

    // Set ShastaMarket contract instance
    shastaMarketAddress = _shastaMarketAddress;
    shastaMarket = ShastaMarket(shastaMarketAddress);
  }

  /**
    * @dev Sets a new User contract address. Only callable by owner.
    * @param contractAddress The new contract address.
    */
  function setUserContractAddress(address contractAddress) public onlyOwner {
    userContractAddress = contractAddress;
    userStorage = User(userContractAddress);
  }

  /**
    * @dev Checks if location index belongs to user. Only for reflecting in UI. Ex: to show edit button in locations if location belongs to user.
    */
  function isLocationIndexFromUser(uint locationIndex) public view returns (bool){
    require(locationIndex <= getLocationsLength() - 1);
    return locationIndexByAddress[locationIndex] == msg.sender;
  }

  /**
    * @dev Getter for getting the length of the locations. Used to know the length and be able to loop the locations outside Solidity.
    * @return length The length of the current location array.
    */
  function getLocationsLength() public view returns(uint length) {
    length = locationsIpfsHashes.length;
  }

  /**
    * @dev Add a new location. Only registered users can add locations if the contract is not paused.
    * @param locationIpfsHash The IPFS hash that points to the location data.
    * @return added Should return true if location is added.
    */
  function addLocation(uint price, string locationIpfsHash) public whenNotPaused onlyUser {
    require(bytes(locationIpfsHash).length > 0);
    // Add relation between location index and msg.sender.
    uint newLength = locationsIpfsHashes.push(locationIpfsHash);
    uint newIndex = newLength - 1;
    locationIndexByAddress[newIndex] = msg.sender;
    shastaMarket.createOfferFor(msg.sender, price, newIndex);
    emit NewLocation(locationIpfsHash, newIndex);
  }

  /**
    * @dev Update a location. Users can only update their own locations if the contract is not paused.
    * @param locationIpfsHash The IPFS hash that points to the new location data.
    * @param index The index of the location data hash in locationsIpfsHashes.
    * @return added Should return true if location is updated.
    */
  function updateLocation(string locationIpfsHash, uint index) public whenNotPaused onlyUser returns(bool) {
    require(bytes(locationIpfsHash).length > 0 && index <= getLocationsLength() - 1);
    require(isLocationIndexFromUser(index) == true);

    locationsIpfsHashes[index] = locationIpfsHash;
    emit LocationUpdate(locationIpfsHash, index);
  }

  /**
    * @dev Update a location by the admin, in case a fake location is added. (Optional, for sanitize data until a review/score system is developed)
    * @param locationIpfsHash The IPFS hash that points to the new location data.
    * @param index The index of the location index in locationsIpfsHashes.
    * @return added Should return true if location is updated.
    */
  function ownerUpdateLocation(string locationIpfsHash, uint index) public whenNotPaused onlyUser returns(bool) {
    locationsIpfsHashes[index] = locationIpfsHash;
    emit LocationUpdate(locationIpfsHash, index);
  }
}