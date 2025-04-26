import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { wildApi, pokeApi, teamApi } from '../components/utilities';
import battlemusic1 from '/src/assets/BattleMusic/MeltdownTheme_Loopable.wav';
import { Howl } from 'howler';
import Modal from 'react-modal';
import rejection_sound from '/src/assets/BattleMusic/489366__morjon17__rejected_feedback.wav';
import hit_sound from '/src/assets/BattleMusic/377157__pfranzen__smashing-head-on-wall.mp3';

const BattlePage = () => {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [randomNum, setRandomNum] = useState();

	const [currentPokemon, setCurrentPokemon] = useState();
	const [currentPokemonHealth, setCurrentPokemonHealth] = useState();
	const [currentPokemonHealthTotal, setCurrentPokemonHealthTotal] = useState();

	const [currentOpponent, setCurrentOpponent] = useState('');
	const [currentOpponentHealth, setCurrentOpponentHealth] = useState();
	const [currentOpponentHealthTotal, setCurrentOpponentHealthTotal] =
		useState();

	const { pokeTeam, setPokeTeam, user, isLoggedIn } = useOutletContext();

	const navigate = useNavigate();

	const rejection = new Howl({
		src: [rejection_sound],
	});

	const hit = new Howl({
		src: [hit_sound],
	});

	function getRandomNum() {
		setRandomNum(Math.floor(Math.random() * (100 - 1 + 1)) + 1);
	}

	const wildPoke = async () => {
		let response = await wildApi.get(`${randomNum}`);
		setCurrentOpponent(response.data);
		setCurrentOpponentHealth(response.data.hp);
		setCurrentOpponentHealthTotal(response.data.base_hp);
	};

	const getTeam = async () => {
		teamApi.defaults.headers.common['Authorization'] = `Token ${user.Token}`;

		let response = await teamApi.get('manager/');

		if (response.status === 200) {
			setPokeTeam(response.data[0].pokemons);
			for (let i = 0; i < response.data[0].pokemons.length; i++) {
				let pokemon = response.data[0].pokemons[i].user_pokemon.pokemon;
				if (pokemon.hp > 0) {
					setCurrentPokemon(pokemon);
					setCurrentPokemonHealth(pokemon.hp);
					setCurrentPokemonHealthTotal(pokemon.base_hp);
					await saveHealthXP();
				}
			}
		}
	};

	const saveHealthXP = async () => {
		try {
			pokeApi.defaults.headers.common['Authorization'] = `Token ${user.Token}`;

			let data = {
				pokemon_id: currentPokemon.id,
				hp: currentPokemonHealth,
				base_hp: currentPokemon.base_hp,
				xp: currentPokemon.xp,
				lvl: currentPokemon.lvl,
				name: currentPokemon.name,
				type: currentPokemon.type,
				move_1: currentPokemon.move_1,
				move_2: currentPokemon.move_2,
				front_img: currentPokemon.front_img,
				back_img: currentPokemon.back_img,
			};

			let response = await pokeApi.put(`${currentPokemon.id}/`, data); //updates pokemon stats

			if (response.status === 200) {
				console.log('poke info saved'); //change current pokemon to selected pokemon
			} else {
				alert('Error retrieving team');
			}
		} catch (error) {
			console.error('Error retrieving team:', error);
		}
	};

	////////////CHANGE POKEMON///////////////////////////////////////////////////////////

	const openModal = async () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};

	const handleOptionClick = async (poke) => {
		//save current pokemon health/exp
		await saveHealthXP();
		await getTeam();
		setCurrentPokemon(poke);
		setCurrentPokemonHealth(poke.hp);
		setCurrentPokemonExperience(poke.xp);
		setCurrentPokemonHealthTotal(poke.base_hp);
		setCurrentPokemonLevel(poke.lvl);
		closeModal();
	};

	/////////////////ATTACK///////////////////////////////////////////////////////////

	const handleMove1 = async () => {
		let attack = Math.floor(
			Math.random() * (10 - 0 + 1) + 1 * currentPokemon.lvl
		);
		hit.play();
		setCurrentOpponentHealth(currentOpponentHealth - attack);
		if (currentOpponentHealth > 0) {
			setTimeout(async () => {
				let counterAttack = Math.floor(Math.random() * (10 - 0 + 1) + 1);
				hit.play();
				setCurrentPokemonHealth(currentPokemonHealth - counterAttack);
				if (currentPokemonHealth <= 0) {
					handleDeath();
				}
				await saveHealthXP();
			}, 1000);
		} else if (currentOpponentHealth <= 0) {
			handleWin();
		} else if (currentPokemonHealth <= 0) {
			handleDeath();
		}
	};

	const handleMove2 = async () => {
		let attack = Math.floor(
			Math.random() * (10 - 0 + 1) + 1 * currentPokemon.lvl
		);
		hit.play();
		setCurrentOpponentHealth(currentOpponentHealth - attack);
		if (currentOpponentHealth > 0) {
			setTimeout(async () => {
				let counterAttack = Math.floor(
					Math.random() * (10 - 0 + 1) + 1 * currentPokemon.lvl
				);
				hit.play();
				setCurrentPokemonHealth(currentPokemonHealth - counterAttack);
				if (currentPokemonHealth <= 0) {
					handleDeath();
				}
				await saveHealthXP();
			}, 1000);
		} else if (currentOpponentHealth <= 0) {
			handleWin();
		} else if (currentPokemonHealth <= 0) {
			handleDeath();
		}
	};

	/////////////////WIN///////////////////////////////////////////////////////////

	const handleWin = async () => {
		await saveHealthXP();
		navigate('/victory');
	};

	/////////////////RUN///////////////////////////////////////////////////////////

	const handleRun = async () => {
		let runChance = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
		if (runChance < 4) {
			await saveHealthXP(); //add post request to save experience and health
			navigate('/main');
		} else {
			rejection.play();
		}
	};

	/////////////////CAPTURE///////////////////////////////////////////////////////

	const capturePoke = async () => {
		let data = {
			id: currentOpponent.id,
		};

		pokeApi.defaults.headers.common['Authorization'] = `Token ${user.Token}`;

		try {
			let response = await pokeApi.post(`${currentOpponent.id}/`, data);

			if (response.status === 201) {
				saveHealthXP(); //add post request to save experience and health
				//change to navigate to victory screen
			} else {
				alert('Poke not captured');
			}
		} catch (error) {
			console.error('Error capturing poke:', error);
		}
	};

	const handleCapture = () => {
		if (currentOpponentHealth < 2) {
			capturePoke();
			//add to team if less than 6
			if (pokeTeam.length < 6) {
				addToTeam();
				getTeam();
				navigate('/victory');
			} else {
				navigate('/victory');
			}
		} else if (currentOpponentHealth / currentOpponentHealthTotal < 0.3) {
			let captureChance = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
			if (captureChance < 4) {
				capturePoke();
				//add to team if less than 6
				if (pokeTeam.length < 6) {
					addToTeam();
					getTeam();
					navigate('/victory');
				} else {
					navigate('/victory');
				}
			} else {
				rejection.play();
				setTimeout(async () => {
					let counterAttack = Math.floor(
						Math.random() * (10 - 0 + 1) + 1 * currentPokemon.lvl
					);
					hit.play();
					setSeeOpponentHit('');
					setCurrentPokemonHealth(currentPokemonHealth - counterAttack);
					setSeeOpponentHit('none');
					if (currentPokemonHealth <= 0) {
						handleDeath();
					}
					await saveHealthXP();
				}, 500);
			}
		} else {
			let captureChance = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
			if (captureChance < 4) {
				capturePoke();
				//add to team if less than 6
				if (pokeTeam.length < 6) {
					addToTeam();
					getTeam();
					navigate('/victory');
				} else {
					navigate('/victory');
				}
			} else {
				rejection.play();
				setTimeout(async () => {
					let counterAttack = Math.floor(
						Math.random() * (10 - 0 + 1) + 1 * currentPokemon.lvl
					);
					hit.play();
					setCurrentPokemonHealth(currentPokemonHealth - counterAttack);
					if (currentPokemonHealth <= 0) {
						handleDeath();
					}
					await saveHealthXP();
				}, 500);
			}
		}
	};

	const [selectedIds, setSelectedIds] = useState([]);

	const getPokemonId = () => {
		setSelectedIds([
			...pokeTeam.map((pokemon) => pokemon.user_pokemon.pokemon.id),
			currentOpponent.id,
		]);
	};

	useEffect(() => {
		getPokemonId();
	}, [currentOpponent]);

	const addToTeam = async () => {
		let data = {
			action: 'pick',
			pokemon_ids: selectedIds,
		};

		teamApi.defaults.headers.common['Authorization'] = `Token ${user.Token}`;

		let addTeam = await teamApi.post('1/', data).catch((error) => {
			console.error(error);
		});
	};

	////////////POKE DEATH////////////////////////////////////////////////////////////

	const handleDeath = async () => {
		await saveHealthXP();
		await getTeam();
		let allPokemonDead = true;

		for (let i = 0; i < pokeTeam.length; i++) {
			let pokemon = pokeTeam[i].user_pokemon.pokemon;
			if (pokemon.hp > 0) {
				allPokemonDead = false;
				await getTeam();
				setCurrentPokemon(pokemon);
				setCurrentPokemonHealth(pokemon.hp);
				setCurrentPokemonExperience(pokemon.xp);
				setCurrentPokemonHealthTotal(pokemon.base_hp);
				setCurrentPokemonLevel(pokemon.lvl);
				break; // Stop the loop once a Pokémon with health greater than 0 is found
			}
		}

		if (allPokemonDead) {
			// navigate to '/gameover' only if all Pokémon have 0 or less HP
			navigate('/gameover');
		}
	};

	////////////////TIMING////////////////////////////////////////////////////////////

	useEffect(() => {
		getRandomNum();
	}, []);

	useEffect(() => {
		getTeam();
		wildPoke();
	}, [randomNum]);

	useEffect(() => {
		if (currentOpponentHealth < 1) {
			handleWin();
		}
	}, [currentOpponentHealth]);

	useEffect(() => {
		if (currentPokemonHealth < 1) {
			handleDeath();
		}
	}, [currentPokemonHealth]);

	useEffect(() => {}, [pokeTeam]);

	useEffect(() => {
		if (isLoggedIn === false) {
			navigate('/landing');
		} else if (pokeTeam.length <= 0) {
			navigate('/house');
		}
	}, []);

	return (
		<div className='full_page_div'>
			{currentPokemon && currentOpponent ? (
				<div id='battle_div'>
					<audio
						autoPlay
						src={battlemusic1}
						loop
						type='audio/wav'
						volume='0.2'></audio>
					<div id='battle_options_div'>
						<div id='moves_div'>
							<button onClick={handleMove1} className='battle_buttons'>
								{currentPokemon.move_1}
							</button>
							<button onClick={handleMove2} className='battle_buttons'>
								{currentPokemon.move_2}
							</button>
						</div>
						<div id='other_options_div'>
							<button onClick={handleCapture} className='battle_buttons'>
								Capture
							</button>
							<button onClick={openModal} className='battle_buttons'>
								Change Pokemon
							</button>
							<button onClick={handleRun} className='battle_buttons'>
								Run
							</button>
						</div>
					</div>
					<div id='poke_div'>
						<div className='modal_div'>
							<Modal
								isOpen={modalIsOpen}
								onRequestClose={closeModal}
								contentLabel='Your Team'
								className='change_poke_modal'>
								<h2>Select a Pokemon:</h2>
								<div className='modal_buttons_div'>
									{pokeTeam.map((poke) => (
										<button
											key={poke.user_pokemon.pokemon.id}
											className='battle_modal_buttons'
											onClick={() =>
												handleOptionClick(poke.user_pokemon.pokemon)
											}
											disabled={poke.user_pokemon.pokemon.hp <= 0}>
											{poke.user_pokemon.pokemon.name}
											<br></br>
											<img src={poke.user_pokemon.pokemon.front_img} />
											<br></br>hp: {poke.user_pokemon.pokemon.hp}
											<br></br>lvl: {poke.user_pokemon.pokemon.lvl}
										</button>
									))}
								</div>
								<button onClick={closeModal} className='victory_button'>
									Close
								</button>
							</Modal>
						</div>
						<div id='your_pokemon_div'>
							<div id='your_pokemon_status_div'>
								<h3>{currentPokemon.name}</h3>
								<h4>Level: {currentPokemon.lvl}</h4>
								<div className='status_bar_div'>
									<ProgressBar
										max={currentPokemon.base_hp}
										min={0}
										now={currentPokemonHealth}
										label={`${currentPokemonHealth}`}
										className='actual_status_bar'
									/>
								</div>
								<img
									alt='poke'
									src={`${currentPokemon.back_img}`}
									className='pokemon_image'
								/>
							</div>
						</div>
						<div id='opponent_div'>
							<div className='poke_profile'>
								<h3>{currentOpponent.name}</h3>
								<div className='status_bar_div'>
									<ProgressBar
										max={currentOpponentHealthTotal}
										min={0}
										now={currentOpponentHealth}
										label={`${currentOpponentHealth}`}
										className='actual_status_bar'
									/>
								</div>
								<img
									src={`${currentOpponent.front_img}`}
									className='pokemon_image'
								/>
							</div>
						</div>
					</div>
				</div>
			) : (
				'loading...'
			)}
		</div>
	);
};
export default BattlePage;
