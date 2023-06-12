import React, { Component } from 'react';
import getWeb3 from './utils/web3';
import getContractInstance from './utils/lottery';
import web3 from 'web3';
import { useEffect } from 'react';

import './App.css';

class App extends Component {
	state = {
		web3: null,
		admin: null,
		players: null,
		balance: null,
		value: '',
		message: null,
		contract: null,
	};

	
	componentDidMount = async () => {
		try {
			// uzimanje web3 instance
			const web3 = await getWeb3();

			const contract = await getContractInstance(web3);
			const admin = await contract.methods.admin().call();
			const players = await contract.methods
				.getPlayers()
				.call();
			const balance = await web3.eth.getBalance(
				contract.options.address
			);
			
			this.setState({
				web3,
				admin,
				players,
				balance,
				contract,
			});
		} catch (error) {
			// Baci gresku ako nesto nije inicijalizovano
			alert(
				`Failed to load web3, admin, players, balance, or contract. Check console for details.`
			);
			console.log(error);
		}
	};

	onSubmit = async (event) => {
		event.preventDefault();

		// ovo uzima account od user-a
		const accounts = await window.ethereum.request({
			method: 'eth_accounts',
		});

		try {
			this.setState({
				message: 'Čekanje na izvršenje transakcije...',
			});

			await this.state.contract.methods.enter().send({
				from: accounts[0],
				value: web3.utils.toWei(this.state.value, 'ether'),
			});
			// rezultat
			this.setState({
				message: 'Ulog uspešno uplaćen!',
			});
			window.location.reload();
		} catch (error) {
			this.setState({
				message:
					'Nevalidna količina ether-a, depozit mora da bude veći od 0.01 ether.',
			});
			console.error(error);
		}
	};

	onClick = async () => {
		const accounts = await window.ethereum.request({
			method: 'eth_accounts',
		});

		try {
			this.setState({
				message: 'Čekanje na izvršenje transakcije...',
			});

			await this.state.contract.methods.draw().send({
				from: accounts[0],
			});

			this.setState({ message: 'Pobednik je izvučen!' });
			window.location.reload();
		} catch (error) {
			this.setState({
				message: 'Permission denied',
			});
			console.error(error);
		}
	};

	render() {
		if (!this.state.web3) {
			return (
				<div className='background'>
					Loading Web3, admin, players, balance and
					contract...
				</div>
			);
		}
		return (
			<div className="App">
				<h2>NAGRADNA LUTRIJA</h2>
				<p>Administrator ugovora je na adresi:  {this.state.admin}.</p>
				<p>
					Trenutno učestvuje {this.state.players.length}{' '}
					igrača. Ukupan ulog je{' '}
					{web3.utils.fromWei(this.state.balance, 'ether')}{' '}
					ether-a!
				</p>
				<form onSubmit={this.onSubmit}>
					<h4>Suma za uplatu</h4>
					<div>
						{/* <label>Uplati {}</label> */}
						<input
							className='form__input'
							value={this.state.value}
							onChange={(event) =>
								this.setState({
									value: event.target.value,
								})
							}
						/>
						{/* <label>{} ether-a</label> */}
					</div>
					<button className='button-9'>Uplati</button>
				</form>
				<h4>Spremni za izvlačenje pobednika?</h4>
				<button className='button-9' onClick={this.onClick}>Izvlačenje</button>
				<h2>Srećno!</h2>
				<p>{this.state.message}</p>
			</div>
		);
	}
}

export default App;
