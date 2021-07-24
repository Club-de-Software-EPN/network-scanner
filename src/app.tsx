import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ChakraProvider, VStack } from "@chakra-ui/react"

import Home from './gui/pages/Home';
import TitleBar from './gui/components/TitleBar';
import CustomTheme from './gui/styles/theme';


function render() {
  const container = document.getElementById('root');
  ReactDOM.render(
    <ChakraProvider theme={CustomTheme}>
      <VStack minW="100vw" minH="100vh">
        <TitleBar />
        <Home />      
      </VStack>
    </ChakraProvider>
  , container);
}

render();