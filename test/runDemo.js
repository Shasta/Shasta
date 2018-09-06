const shastaContract = artifacts.require("User");
const shastaMarket = artifacts.require('ShastaMarket');
const ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });

contract('Demo', async (accounts) => {

    var instance;
    var marketInstance;
    var lastIpfsHash;
    var jsonUser;

    console.log("acc balance", web3.eth.getBalance(web3.eth.accounts[0]).toNumber() / web3.toWei(1, "ether"));

    before(async function () {
        //Init ipfs
        const res = await ipfs.id();
        console.log("ipfs id: ", res.id);
    })

    it("Deploy shasta market", async () => {
        marketInstance = await shastaMarket.new();
        console.log("address", marketInstance.address)
        assert(marketInstance.address);
    });

    it("Deploy shastaContract", async () => {
        instance = await shastaContract.new(marketInstance.address);
        var receipt = await web3.eth.getTransactionReceipt(instance.transactionHash);
        console.log("shastaContract\n\tdeployment cost: ", receipt.gasUsed, "\n\tcontract address:", receipt.contractAddress)
        assert(shastaContract.address);
    });

    it("Create a new organization", async () => {

        const name = "Vitalik";
        var userJson = {
            username: name,
            contracts: []
        }

        console.log("Upload to IPFS");
        const hash = await uploadToIpfsAndGetHash(userJson);
        console.log("Obtained ipfs hash: ", hash);

        assert(hash);
        lastIpfsHash = hash

        //Post to blockchain
        await instance.createUser(name, hash);
        let retHash = await instance.getIpfsHashByAddress(accounts[0]);
        retHash = web3.toAscii(retHash);

        assert.equal(retHash, hash);

        jsonUser = await getJsonFromIpfs(lastIpfsHash);
        console.log("json: ", jsonUser);
        assert.equal(jsonUser.username, name);
    });

    it("Create a bid offer", async () => {

        const bid = {
            value: 40,
            date: Date.now(),
            firstName: jsonUser.username,
            lastName: "Buterin",
            country: "Russia",
            marketer: "The Marketer",
            source: "Nuclear"
        }
        jsonUser.contracts.push(bid);

        lastIpfsHash = await uploadToIpfsAndGetHash(jsonUser);
        await instance.createBid(bid.value, lastIpfsHash);

        var nBids = await marketInstance.getBidsLength.call();
        
        assert.equal(nBids.toNumber(), 1);

    });

    it("Create an ask offer", async() => {

        

    });

    async function uploadToIpfsAndGetHash(json) {
        const res = await ipfs.add([Buffer.from(JSON.stringify(json))]);
        return res[0].hash;
    }

    async function getJsonFromIpfs(hash) {

        var json = await ipfs.cat(hash);
        json = json.toString('utf8');

        return JSON.parse(json)
    }
})