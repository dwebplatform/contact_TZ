import React, { useState, useEffect } from "react";
import { Provider} from 'react-redux';
import store from './store';

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import {Main} from './components/Main';
import {Login} from './components/Login';
import {PrivateRoute} from './components/PrivateRoute';
import "./styles.css";
 

export default function App() {


  return (
  <Provider store={store}> 
  <BrowserRouter>
        <Switch>
        <Route path="/login">
          <Login/>
        </Route>
    <PrivateRoute path="/" exact component={()=><Main/>}/>

  </Switch>
  </BrowserRouter>
  </Provider>
  );
 
}
