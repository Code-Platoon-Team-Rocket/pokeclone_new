import { Link } from 'react-router-dom';
import landingMusic from '../assets/BackgroundMusic/UntitledTrack01_Loopable.wav';
import waves from '../assets/BackgroundMusic/waves-on-beach.wav';
import pokeLogo from '../assets/PokeLogoClean.png';

const LandingPage = () => {
	return (
		<div className='full_page_div' id='landing_main_div'>
			<img src={pokeLogo} id='landing_logo' />
			<Link to='/signup'>
				<button className='landing_buttons'>Sign Up</button>
			</Link>
			<Link to='/login'>
				<button className='landing_buttons'>Log In</button>
			</Link>
			<audio
				autoPlay
				src={landingMusic}
				loop
				type='audio/wav'
				volume='0.2'></audio>
			<audio autoPlay src={waves} loop type='audio/wav' volume='0.2'></audio>
		</div>
	);
};
export default LandingPage;
