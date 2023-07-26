// App.js
import React from "react";
import './App.css';

//components
import Header from './components/molecules/header/dropdown/header.js';
import PageContent from './components/pages/pageContent.js';

//context - Make sure to use the correct import name here

function App() {


  return (

      <div className="App">
        {/* <div className='grid-overlay'></div> */}
        <Header/>
        <PageContent/>
      </div>

  );
}

export default App;
