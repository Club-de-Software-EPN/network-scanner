import * as React from 'react';
import * as ReactDOM from 'react-dom';

function render() {
  const container = document.getElementById('root');
  ReactDOM.render(<h2>Hello from React!</h2>, container);
}

render();