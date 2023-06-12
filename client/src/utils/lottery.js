import contractData from '../contracts/Lottery.json';

const contract = [...contractData][0];
// const contract = contractData
// Ovo ne moze ovako, mora kao sto je gore

const getContractInstance = async (web3) => {
	// ovde ide adresa na kojoj je deplojovan ugovor
	const contractAddress =
		'0x974Da578C68eE0f174BF7a2a0995b0585bA26d1a';

	// kreiranje instance ugovora
	const instance = new web3.eth.Contract(
		contract.abi,
		contractAddress
	);
	return instance;
};

export default getContractInstance;
