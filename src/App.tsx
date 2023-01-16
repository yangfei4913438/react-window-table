import { ThemeProvider } from '@material-tailwind/react';
import Example from './example';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  return (
    <ThemeProvider>
      <Example />
    </ThemeProvider>
  );
};

export default App;
