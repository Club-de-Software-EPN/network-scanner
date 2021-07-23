import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ChakraProvider, theme } from "@chakra-ui/react"

import Home from './gui/pages/Home';


function render() {
  const container = document.getElementById('root');
  ReactDOM.render(
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  , container);
}

render();