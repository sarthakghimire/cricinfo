import Players from "../components/ui/Players";
import Hero from "../components/ui/Hero";
import Teams from "../components/ui/Teams";
import Officials from "../components/ui/Officials";
import Tournaments from "./../components/ui/Tournaments";
import Venues from "../components/ui/Venues";
import MatchType from "../components/ui/MatchType";

const Home = () => {
  return (
    <>
      <Hero />
      <Tournaments />
      <Players />
      <Teams />
      <Officials />
      <Venues />
      <MatchType />
    </>
  );
};

export default Home;
