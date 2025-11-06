import { Admin, Resource, memoryStore, ListGuesser, ShowGuesser,EditGuesser } from "react-admin";
import { createTrailbaseProvider } from "/workspaces/FUCKING-BULLSHIT/my-admin/src/ra-trailbase.js";
import './App.css'

const TRAILBASE_URL = "https://humble-space-engine-q795q76j7q9p3q6w-4000.app.github.dev/";
const {dataProvider} = await createTrailbaseProvider(TRAILBASE_URL);

function App() {
  return (
  
    <Admin
    dataProvider={dataProvider}
      store={memoryStore()}
    >
      <Resource name="authors" list={ListGuesser} edit={EditGuesser}/>
      <Resource name="users" list={ListGuesser} edit={EditGuesser}/>
      <Resource name="books" list={ListGuesser} edit={EditGuesser}/>
    </Admin>
  );
}

export default App;

