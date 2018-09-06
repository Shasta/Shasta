const shastaContract = artifacts.require("shasta-os/User");
const shastaMarket = artifacts.require('shasta-os/ShastaMarket');
const shastaMap = artifacts.require('shasta-os/SharedMapPrice')
const ipfsAPI = require('ipfs-api');
let ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });
let fs = require('fs');

contract('Demo', function (accounts){

    let instance;
    let marketInstance;
    let mapInstance;
    let lastIpfsHash;
    let jsonUser;

    let userAddress;
    let marketAddress;
    let mapAddress;

    

    before(async function () {
        //Init ipfs
        // Web3 1.0.0 eth.getBalance is now async
        const balance = await web3.eth.getBalance(accounts[0])
    
        console.log("acc balance", web3.utils.fromWei(balance, 'ether'))
        const res = await ipfs.id();
        console.log("ipfs id: ", res.id);
    })

    after(function() {

        const demoJson = {
            userAddress,
            marketAddress,
            mapAddress
        }
        
        fs.writeFile("../demoFile.json", JSON.stringify(demoJson), function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 
    })

    it("Deploy shasta market", async () => {
        marketInstance = await shastaMarket.new();
        console.log("address", marketInstance.address)
        marketAddress =  marketInstance.address;
        assert(marketInstance.address);
    });

    it("Deploy shastaContract", async () => {
        instance = await shastaContract.new(marketInstance.address);
        var receipt = await web3.eth.getTransactionReceipt(instance.transactionHash);
        console.log("shastaContract\n\tdeployment cost: ", receipt.gasUsed, "\n\tcontract address:", receipt.contractAddress)
        assert(shastaContract.address);
        userAddress = shastaContract.address;
    });

    it("Deploy sharedMap contract", async() => {
        mapInstance = await shastaMap.new(instance.address, marketInstance.address);
        mapAddress = mapInstance.address;
    });

    it("Create a new organization", async () => {

        const name = web3.utils.utf8ToHex("Vitalik");
        var userJson = {
            username: name,
            contracts: []
        }

        console.log("Upload to IPFS");
        const hash = await uploadToIpfsAndGetHash(userJson);
        console.log("Obtained ipfs hash: ", hash);

        assert(hash);
        lastIpfsHash = web3.utils.utf8ToHex(hash)

        //Post to blockchain
        await instance.createUser(name, lastIpfsHash);
        let retHash = await instance.getIpfsHashByAddress(accounts[0]);
        retHash = web3.utils.hexToUtf8(retHash);

        assert.equal(retHash, hash);

        jsonUser = await getJsonFromIpfs(retHash);
        console.log("json: ", jsonUser);
        assert.equal(jsonUser.username, name);
    });

    it("Create a bid offer", async function () {

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
        await instance.createBid(bid.value, web3.utils.utf8ToHex(lastIpfsHash));

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