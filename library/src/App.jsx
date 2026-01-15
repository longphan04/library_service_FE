import Header from "./components/Header";
import Tabs from "./components/Tabs";
import BookManagement from "./pages/BookManagement";

function App() {
  return (
    <div className="bg-bg min-h-screen">
      <Header />
      <Tabs />
      <BookManagement />
    </div>
  );
}

export default App;
