import Hero from '../hero/Hero';

const Home = ({movies}) => {
    return (
        <div>
            <Hero movies = {movies} />
        </div>
    )
}

export default Home