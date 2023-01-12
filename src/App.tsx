import { ThemeProvider } from '@material-tailwind/react';
import Layout from './layout';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
};

export default App;
