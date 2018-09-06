pragma solidity ^0.4.24;

import './OpenZeppelin/Ownable.sol';
import './OpenZeppelin/Pausable.sol';
import './User.sol';

 /**
  * @title ShastaMarketplace
  * This contract will manage the creation and execution of bids and asks
  *
  */

contract ShastaMarket is Ownable, Pausable {

    User public userStorage;
    mapping(address => uint[]) private addressToBidsIndex;
    mapping(address => uint[]) private addressToOffersIndex;
    Bid[] private bidsList;
    Offer[] private offersList;
    
    struct Bid {
        address seller;
        uint value;
    }

    struct Offer {
        address buyer;
        uint value;
        uint locationIndex;
    }

    event newBid(address seller, uint value);
    event newOffer(address buyer, uint value, uint locationIndex);

    constructor () public {
        owner = msg.sender;
    }
    
    /**
    * @dev Throws if non-user is trying to interact with the contract method.
    */
    modifier onlyUser() {
        require(userStorage.hasUser(msg.sender));
        _;
    }

    function createBid(uint _value, address _seller) public whenNotPaused {
        Bid memory myBid;
        myBid.seller = _seller;
        myBid.value = _value;
        
        uint index = bidsList.push(myBid) - 1;
        addressToBidsIndex[msg.sender].push(index);
        emit newBid(msg.sender, _value);
    }
    
    function createOffer(uint _value) public whenNotPaused {
        Offer memory myOffer;
        myOffer.buyer = msg.sender;
        myOffer.value = _value;
        
        uint index = offersList.push(myOffer) - 1;
        addressToOffersIndex[msg.sender].push(index);
        emit newOffer(msg.sender, _value, 999);
    }

    // Not secure, for demo purposes only, this call need to be whitelisted via a modifier.
    function createOfferFor(address origin, uint _value, uint _locationIndex) public whenNotPaused {
        Offer memory myOffer;
        myOffer.buyer = origin;
        myOffer.value = _value;
        myOffer.locationIndex = _locationIndex;
            
        uint index = offersList.push(myOffer) - 1;
        addressToOffersIndex[origin].push(index);
        emit newOffer(origin, _value, _locationIndex);
    }
    
    function getBidFromIndex(uint _index) public view returns(uint, address) {
        require(bidsList.length > _index);
        return (bidsList[_index].value, bidsList[_index].seller);
    }
    
    function getBidsIndexesFromAddress() public view returns(uint[]) {
        return addressToBidsIndex[msg.sender];
    }

    function getOfferFromIndex(uint _index) public view returns(uint, address, uint) {
        require(offersList.length > _index);
        return (offersList[_index].value, offersList[_index].buyer, offersList[_index].locationIndex);
    }
    
    function getOfferIndexesFromAddress() public view returns(uint[]) {
        return addressToOffersIndex[msg.sender];
    }
    function getBidsLength() public view returns(uint) {
        return bidsList.length;
    }
    function getOffersLength() public view returns(uint) {
        return offersList.length;
    }
      function updateUser(bytes ipfsHash) private returns(bool success)
  {
    return userStorage.updateUser(ipfsHash);
  }  

function createUser(bytes16 username, bytes ipfsHash) public returns(bool success)
  {
      return userStorage.createUser(username, ipfsHash);

  }
}