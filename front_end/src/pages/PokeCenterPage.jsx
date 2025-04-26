import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate, useOutletContext } from 'react-router-dom';
import pokeCenterPageMusic from '../assets/BackgroundMusic/chiptune-music.mp3';
import { pokeApi, teamApi } from '../components/utilities';

const PokeCenterPage = () => {
	const { pokeTeam, setPokeTeam, user, isLoggedIn } = useOutletContext();
	const [currentPokemonHealth, setCurrentPokemonHealth] = useState(50);
	const [currentPokemonHealthTotal, setCurrentPokemonHealthTotal] =
		useState(50);
	const [selectedIds, setSelectedIds] = useState([]);

	const navigate = useNavigate();

	const getPokeTeam = async () => {
		try {
			const response = await teamApi.get('manager/');
			setPokeTeam(response.data[0].pokemons);
		} catch (error) {
			console.error('Error fetching data from team pokemon', error);
		}
	};

	const getPokemonId = () => {
		setSelectedIds(
			pokeTeam.map((pokemon) => {
				return pokemon.id;
			})
		);
	};

	const healPokemon = () => {
		async function updatePokemonTeam(pokeTeam) {
			try {
				const promises = pokeTeam.map(async (pokemon) => {
					let data = {
						name: pokemon.user_pokemon.pokemon.name,
						type: pokemon.user_pokemon.pokemon.type,
						move_1: pokemon.user_pokemon.pokemon.move_1,
						move_2: pokemon.user_pokemon.pokemon.move_2,
						front_img: pokemon.user_pokemon.pokemon.front_img,
						back_img: pokemon.user_pokemon.pokemon.back_img,
						pokemon_id: pokemon.user_pokemon.pokemon.pokemon_id,
						base_hp: pokemon.user_pokemon.pokemon.base_hp,
						hp: pokemon.user_pokemon.pokemon.base_hp,
						xp: pokemon.user_pokemon.pokemon.xp,
						lvl: pokemon.user_pokemon.pokemon.lvl,
					};

					const storedToken = localStorage.getItem('token');

					pokeApi.defaults.headers.common[
						'Authorization'
					] = `Token ${storedToken}`;
					const response = await pokeApi.put(
						`${pokemon.user_pokemon.pokemon.id}/`,
						data
					);
				});

				// Wait for all promises to resolve before moving on
				await Promise.all(promises);
			} catch (error) {
				console.error('Error updating Pokémon team:', error);
			}
		}
		updatePokemonTeam(pokeTeam);

		getPokeTeam();
	};

	useEffect(() => {
		getPokeTeam();
	}, []);

	useEffect(() => {
		if (isLoggedIn === false) {
			navigate('/landing');
		}
	}, []);

	return (
		<div className='full_page_div'>
			<audio
				autoPlay
				src={pokeCenterPageMusic}
				loop
				type='audio/wav'
				volume='0.2'></audio>
			<div className='pokecenter'>
				<ListGroup>
					<div className='pokecenter_buttons_div'>
						<Button className='pokecenter_buttons' onClick={healPokemon}>
							Heal Pokemon
						</Button>
						<Button
							className='pokecenter_buttons'
							onClick={() => navigate('/main')}>
							Exit
						</Button>
					</div>
					<div className='pokecenter_team'>
						{pokeTeam.map((pokemon) => (
							<>
								<ListGroup.Item id='pokecenter_list_item'>
									{pokemon.user_pokemon.pokemon.name} Lvl:{' '}
									{pokemon.user_pokemon.pokemon.lvl}
								</ListGroup.Item>
								<ProgressBar
									className='pokecenter_progress'
									variant='success'
									max={pokemon.user_pokemon.pokemon.base_hp}
									min={0}
									now={pokemon.user_pokemon.pokemon.hp}
									label={`hp: ${pokemon.user_pokemon.pokemon.hp}`}
								/>
							</>
						))}
					</div>
				</ListGroup>
			</div>
		</div>
	);
};

export default PokeCenterPage;
