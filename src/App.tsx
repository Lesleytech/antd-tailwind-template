import { RootProvider } from '~/providers/RootProvider';
import { Router } from '~/routing/Router';

const App = () => {
  return (
    <>
      <RootProvider>
        <Router />
      </RootProvider>
    </>
  );
};

export default App;
