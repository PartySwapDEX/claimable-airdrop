const hre = require("hardhat");

async function main(amount) {
  const PARTY = {
    FUJI: '0xb68Dd903198339f1818Fb3710AB4Ea2Ff85231B8',
    AVALANCHE: '0x69A61f38Df59CBB51962E69C54D39184E21C27Ec'
  };

  const AirdropClaimer = await hre.ethers.getContractFactory("AirdropClaimer");
  const airdropClaimer = await AirdropClaimer.deploy(PARTY['FUJI'], amount);

  await airdropClaimer.deployed();

  console.log("AirdropClaimer deployed to:", airdropClaimer.address);
  console.log("With starting amount of: ", amount);
}

main('3101710000000000000000')
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// main('21000000000000000000')
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
