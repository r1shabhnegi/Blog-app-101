import Landing from "@/components/Landing";
import { useAppSelector } from "@/redux/hook";

const Home = () => {
  const { isAuth } = useAppSelector((state) => state.auth);

  return isAuth ? <div>Home</div> : <Landing />;
};
export default Home;
