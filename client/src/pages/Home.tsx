import Landing from "@/components/Landing";

const Home = () => {
  const isAuth = false;

  return isAuth ? <div>Home</div> : <Landing />;
};
export default Home;
