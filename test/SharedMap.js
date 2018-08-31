const truffleAssert = require("truffle-assertions");
const SharedMap = artifacts.require("./SharedMap.sol");
const UserStorage = artifacts.require("./User.sol");

/**
 * SharedMap test cases
 */
contract('SharedMap', function(accounts) {
  // Contract owner
  const owner = accounts[0];
  const organization = accounts[1];
  // Contract pointers
  let sharedMapInstance;
  let userStorageInstance;

  // Fake IPFS string for testing purposes
  const locationIpfsHash = "QmZfSNpHVzTNi9gezLcgq64Wbj1xhwi9wk4AxYyxMZgtCc";

  const userNickname  = "Ultrachargers";
  const userIpfsHash = ""; // Letting empty, not needed user data in this test case for now.

  // Content creator properties, for later easier conversion from Solidity struct array to Javascript object, with lodash _.zipObject method.
  const contentCreatorProperties = ["nickname", "description", "creationTimestamp", "payday", "balance", "ipfsAvatar", "totalMecenas"];

  // In each test the contracts are deployed again, recovering the initial state.
  beforeEach('Initialize contract state per test case', async function () {
    userStorageInstance = await UserStorage.new();
    sharedMapInstance = await SharedMap.new(userStorageInstance.address);

    await userStorageInstance.createUser(userNickname, userIpfsHash, {from: organization})
  });

  it('Organization should store a new location IPFS hash', async function() {
    const tx = await sharedMapInstance.addLocation(locationIpfsHash, { from: organization });
    const locationsLength = await sharedMapInstance.getLocationsLength();
    const isLocationFromUser = await sharedMapInstance.isLocationIndexFromUser(locationsLength - 1, {from: organization})
    const storedIpfsHash = await sharedMapInstance.locationsIpfsHashes.call(locationsLength - 1);

    // Check the event NewLocation is fired with IPFS Hash
    truffleAssert.eventEmitted(tx, 'NewLocation', (event) => {
      // Event location IPFS hash should be equal than the function parameter.
      return event.ipfsHash == locationIpfsHash;
    });
    // Locations length should be 1
    assert.equal(locationsLength, 1);
    // Location should belong to organization "Ultrachargers"
    assert.equal(isLocationFromUser, true);
    // Stored location IPFS hash should be equal than the function parameter
    assert.equal(storedIpfsHash, locationIpfsHash)
  });

  it('Organization should be able to update a new location IPFS hash', async function() {
    const newIpfsHash = "some_random_ipfs_string";

    await sharedMapInstance.addLocation(locationIpfsHash, { from: organization });
    const locationsLength = await sharedMapInstance.getLocationsLength();
    const tx = await sharedMapInstance.updateLocation(newIpfsHash, locationsLength - 1, { from: organization });

    const isLocationFromUser = await sharedMapInstance.isLocationIndexFromUser(locationsLength - 1, {from: organization})
    const storedIpfsHash = await sharedMapInstance.locationsIpfsHashes.call(locationsLength - 1);

    // Check the event LocationUpdate is fired with IPFS Hash
    truffleAssert.eventEmitted(tx, 'LocationUpdate', (event) => {
      // Event location IPFS hash should be equal than the newIpfsHash.
      return event.ipfsHash == newIpfsHash;
    });
    // Locations length should be 1
    assert.equal(locationsLength, 1);
    // Location should belong to organization "Ultrachargers"
    assert.equal(isLocationFromUser, true);
    // Stored location IPFS hash should be equal to newIpfsHash
    assert.equal(storedIpfsHash, newIpfsHash)
  });

  it('Non-registered should not be able to update others location', async function() {
    // A registered user adds a location
    const tx = await sharedMapInstance.addLocation(locationIpfsHash, { from: organization });
    const locationsLength = await sharedMapInstance.getLocationsLength();

    // A non registered user try to update that location
    try {
      await sharedMapInstance.updateLocation("Bad Hash", locationsLength - 1, { from: accounts[3] });
    } catch (error) {
      assert.equal(error.message, 'VM Exception while processing transaction: revert');
    }
    const storedIpfsHash = await sharedMapInstance.locationsIpfsHashes.call(locationsLength - 1);

    assert.equal(storedIpfsHash, locationIpfsHash);
  });
  

  it('Non-registered should not be able to add a new location', async function() {
    try {
      await sharedMapInstance.addLocation(locationIpfsHash, { from: accounts[3] });
    } catch (error) {
      assert.equal(error.message, 'VM Exception while processing transaction: revert');
    }

    const locationsLength = await sharedMapInstance.getLocationsLength();
    // Locations length should be zero
    assert.equal(locationsLength, 0);
  });

  it('A registered user should not be able to update other registered user location', async function() {
    // Creating another user, named "MadChargers" with  address accounts[3]
    await userStorageInstance.createUser("MadChargers", "RandomIpfsHash", {from: accounts[3]})
    // A registered user adds a location
    const tx = await sharedMapInstance.addLocation(locationIpfsHash, { from: organization });
    const locationsLength = await sharedMapInstance.getLocationsLength();

    // The registered user "MadChargers" try to update "Ultrachargers" location
    try {
      await sharedMapInstance.updateLocation("Bad Hash", locationsLength - 1, { from: accounts[3] });
    } catch (error) {
      assert.equal(error.message, 'VM Exception while processing transaction: revert');
    }
    const storedIpfsHash = await sharedMapInstance.locationsIpfsHashes.call(locationsLength - 1);

    assert.equal(storedIpfsHash, locationIpfsHash);
  });
});
