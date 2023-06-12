import Web3 from 'web3';

const getWeb3 = () =>
	new Promise((resolve, reject) => {
		// cekanje da se sve ucita
		window.addEventListener('load', () => {
			let web3 = window.web3;

			// provera da li je web3 ubacen
			const alreadyInjected = typeof web3 !== 'undefined';

			if (alreadyInjected) {
				// metamask provajder
				web3 = new Web3(web3.currentProvider);
				console.log('Injected web3 detected.');
				resolve(web3);
			} else {
				// ide na localhost ako ne moze da se poveze kako treba
				
				const provider = new Web3.providers.HttpProvider(
					'http://127.0.0.1:9545'
				);
				web3 = new Web3(provider);
				console.log(
					'No web3 instance injected, using Local web3.'
				);
				resolve(web3);
			}
		});
	});

export default getWeb3;
