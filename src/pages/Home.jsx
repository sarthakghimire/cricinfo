import Header from "./../components/Header";
import Players from "../components/Players";
import Hero from "../components/Hero";
import Teams from "../components/Teams";
import Officials from "../components/Officials";
import Tournaments from "./../components/Tournaments";
import Venues from "../components/Venues";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Tournaments />
      <Players />
      <Teams />
      <Officials />
      <Venues />
    </>
  );
};

export default Home;
