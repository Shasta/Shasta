const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });
var faker = require('faker');

var User = require('../build/contracts/User.json');
var ShastaMarket = require('../build/contracts/ShastaMarket.json');

let UserInstance;
let MarketInstance;
const numberOfOrganizations = 2;

const providerSources = [
    {
        text: "Solar",
        value: "Solar"
    },
    {
        text: "Nuclear",
        value: "Nuclear"
    },
    {
        text: "Eolic",
        value: "Eolic"
    },
    {
        text: "Biomass",
        value: "Biomass"
    },
    {
        text: "Other",
        value: "Other"
    }
];

module.exports = function (callback) {
    try {
        initDemo().then(() => {
            console.log("\n Finished demo")
            callback();
        })
    }
    catch (err) {
        console.log("Error: ", err);
        callback(err);
    }
};

async function initDemo() {

    try {

        const accounts = await web3.eth.getAccounts();
        console.log("Ganache accounts: ", accounts);
        const owner = accounts[0];

        //Initialize contracts
        UserInstance = await new web3.eth.Contract(User.abi, User.networks["5777"].address, { data: User.deployedAbi });
        MarketInstance = await new web3.eth.Contract(ShastaMarket.abi, User.networks["5777"].address, { data: ShastaMarket.deployedAbi });

        // const marketGas = await MarketContract.deploy({ data: ShastaMarket.bytecode }).estimateGas({ from: owner });
        // MarketInstance = await MarketContract.deploy({ data: ShastaMarket.bytecode }).send({ from: owner, gas: marketGas });

        // const userGas = await UserContract.deploy({ data: User.bytecode, arguments: [MarketInstance.options.address] }).estimateGas({ from: owner });
        // UserInstance = await UserContract.deploy({ data: User.bytecode, arguments: [MarketInstance.options.address] }).send({ from: owner, gas: userGas });         

        //Organizations json

        let organizations = [];
        for (var i = 1; i <= numberOfOrganizations; i++) {
            organizations.push(createRandomOrganization(accounts[i], i));
        }

        //Create the organizations and the offers
        for (var key in organizations) {
            const name = web3.utils.utf8ToHex(organizations[key].organization.name);

            //Upload to ipfs
            let ipfsHash = await uploadToIpfsAndGetHashInHex(organizations[key]);

            console.log("Creating new organization " + organizations[key].organization.name);
            await createOrganization(organizations[key].organization.address, name, ipfsHash);

            //Create offers for the organization
            const randomOffer = createRandomOffer(organizations[key].organization.address);
            organizations[key].producerOffers.push(randomOffer);
            ipfsHash = await uploadToIpfsAndGetHashInHex(organizations[key]);

            const rawEnergyPrice = web3.utils.toWei(
                randomOffer.energyPrice.toString(),
                "ether"
              );

            await createOffer(randomOffer.ethAddress, rawEnergyPrice, ipfsHash);
            console.log("Created offer for " + organizations[key].organization.name + " at " + rawEnergyPrice)
        }

        console.log("Created " + organizations.length + " organizations")

        console.log("TO LOG IN: \n Set metamask to " + accounts[1]+ " and sign in with " + organizations[0].organization.name)

    } catch (err) {
        console.log("Error: ", err);
    }
}

async function createOffer(address, value, ipfsHash) {

    const gas = await UserInstance.methods.createOffer(value, ipfsHash).estimateGas({ from: address });
    await UserInstance.methods.createOffer(value, ipfsHash).send({ from: address, gas: gas });

}

async function uploadToIpfsAndGetHashInHex(json) {

    const res = await ipfs.add([Buffer.from(JSON.stringify(json))]);
    const ipfsHash = res[0].hash;
    console.log("ipfs hash: ", ipfsHash);
    return web3.utils.utf8ToHex(ipfsHash);
}

function createRandomOrganization(address, index) {

    const randomOrganization = {
        organization: {
            name: "Org" + index,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            country: faker.address.country(),
            address
        },
        consumerOffers: [],
        producerOffers: []
    }

    return randomOrganization;
}

function createRandomOffer(address) {

    const newProducerOffer = {
        chargerName: faker.company.companyName(),
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
        providerSource: providerSources[getRandomInt(0, providerSources.length - 1)].text,
        address: faker.address.streetAddress(),
        energyPrice: 0.123,
        fiatAmount: 0,
        date: Date.now(),
        pendingOffer: true,
        ethAddress: address,
        amountkWh: getRandomInt(100,800)
    };

    newProducerOffer.fiatAmount = newProducerOffer.energyPrice * newProducerOffer.amountkWh
    return newProducerOffer;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createOrganization(address, orgName, ipfsHash) {

    const gas = await UserInstance.methods.createUser(orgName, ipfsHash).estimateGas({ from: address });
    await UserInstance.methods.createUser(orgName, ipfsHash).send({ from: address, gas: gas });

}