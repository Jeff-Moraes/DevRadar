import React, { useState, useEffect } from "react";

import api from "./services/api";

import "./global.css";
import "./App.css";
import "./Main.css";

import DevForm from "./components/DevForm";
import DevItem from "./components/DevItem";

// navigator.geolocation.getCurrentPosition

// componente = bloco isolado de HTML, CSS e Javascript, que não interfere no restante da app.
// propriedades = informações que um componente pai passa para o componente filho.
// estado = informações mantidas pelo componente (imutabilidade)

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get("/devs");

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {
    const response = await api.post("/devs", { data });

    setDevs([...devs, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Sign up</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem dev={dev} key={dev._id} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
