pragma solidity ^0.4.19;

import './Ownable.sol';
import './Pausable.sol';
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
    Bid[] public bidsList;
    Offer[] public offersList;
    
    struct Bid {
        address seller;
        uint value;
    }

    struct Offer {
        address buyer;
        uint value;
    }

    event newBid(address seller, uint value);
    event newOffer(address buyer, uint value);

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

    function createBid(uint _value) public whenNotPaused onlyUser {
        Bid memory myBid;
        myBid.seller = msg.sender;
        myBid.value = _value;
        
        uint index = bidsList.push(myBid) - 1;
        addressToBidsIndex[msg.sender].push(index);
        emit newBid(msg.sender, _value);
    }
    
    
    function createOffer(uint _value ) public whenNotPaused onlyUser{
        Offer memory myOffer;
        myOffer.buyer = msg.sender;
        myOffer.value = _value;
        
        uint index = offersList.push(myOffer) - 1;
        addressToOffersIndex[msg.sender].push(index);
        emit newOffer(msg.sender, _value);
    }
    
    function getBidFromIndex(uint _index) public view returns(uint) {
        require(bidsList.length > _index);
        return bidsList[_index].value;
    }
    
    function getBidsIndexesFromAddress() public view returns(uint[]) {
        return addressToBidsIndex[msg.sender];
    }

    function getOfferFromIndex(uint _index) public view returns(uint) {
        require(offersList.length > _index);
        return offersList[_index].value;
    }
    
    function getOfferIndexesFromAddress() public view returns(uint[]) {
        return addressToOffersIndex[msg.sender];
    }
}