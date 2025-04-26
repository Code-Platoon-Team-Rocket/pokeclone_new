import { Link, useNavigate, useOutletContext } from "react-router-dom"
import { useEffect, useState } from 'react'
import { pokeApi, teamApi, pokedexApi } from "../components/utilities"
import pokeLogo from '../assets/PokeLogoClean.png'
import Sound from 'react-audio-player';
import starterPageMusic from '/src/assets/BackgroundMusic/birds-from-bohemian-switzerland.wav'



export default function HomePage() {
    const { isLoggedIn, pokeTeam, setPokeTeam, pokedex, setPokedex, user } = useOutletContext()

    const navigate = useNavigate()

    const getTeam = async () => {
        try {

            teamApi.defaults.headers.common[
                "Authorization"
              ] = `Token ${user.Token}`;

            let response = await teamApi.get('manager/');

            if (response.status === 200) {
                setPokeTeam(response.data[0].pokemons)
            } else {
                alert("Error retrieving team");
            }
        } catch (error) {
            console.error("Error retrieving team:", error);
        }
    };

    const getPokedex = async () => {
        try {
            let response = await pokedexApi.get('');

            if (response.status === 200) {
                setPokedex(response.data)
            } else {
                alert("Error retrieving pokedex");
            }
        } catch (error) {
            console.error("Error retrieving pokedex:", error);
        }
    };

    const deletePokedex = async () => {
        try {
            let response = await pokedexApi.delete('');

            if (response.status === 204) {
                getPokedex()
            } else {
                alert("Pokedex not deleted");
            }
        } catch (error) {
            console.error("Error deleting pokedex:", error);
        }
    };

    const handleNewGame = () => {
        if (pokedex.length > 0) {
            deletePokedex()
            navigate('/starter')
        }
        else {
            navigate('/starter')
        }
    }

    const handleContinueGame = () => {
        navigate('/main')
    }

    useEffect(() => {
        getPokedex()
        getTeam()
        if (isLoggedIn === false) {
            navigate('/landing')
        }
    }, [])

    return (
        <div className="full_page_div">
<audio autoPlay src={starterPageMusic} loop type="audio/wav" volume='0.2'></audio>

            <div id="home_page_div">
                <img src={pokeLogo} id='landing_logo' />
                <button onClick={handleNewGame} className='home_buttons'>New Game</button>
                <button onClick={handleContinueGame} className='home_buttons'>Continue</button>
            </div>
        </div>
    )
}
