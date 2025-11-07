import Header from "./../components/Header";
import Players from "../components/Players";
import Hero from "../components/Hero";
import Teams from "../components/Teams";
import Officials from "../components/Officials";
import Tournaments from "./../components/Tournaments";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Tournaments />
      <Players />
      <Teams />
      <Officials />
    </>
  );
};

export default Home;
