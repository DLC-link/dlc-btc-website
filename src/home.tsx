import './app.css';
import { Header } from './components/header/header';
import { HomeLayout } from './pages/home/components/home.layout';

export function Home(): React.JSX.Element {
  return (
    <HomeLayout>
      <Header />
    </HomeLayout>
  );
}
