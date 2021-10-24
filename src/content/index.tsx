import App from "./app";
import React from 'react';
import ReactDOM from 'react-dom';

wrappedJSObject.onload = exportFunction(() => {
  let root = document.createElement('div');
  root.style.zIndex = '10000';
  root.style.position = 'fixed';
  root.style.top = root.style.left = root.style.right = root.style.bottom = '0px';
  root.style.pointerEvents = 'none';
  wrappedJSObject.document.body.appendChild(root);
  ReactDOM.render(<App></App>, root);
}, wrappedJSObject);