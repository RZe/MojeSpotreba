/***
 *      __  __      _     ___           _           _
 *     |  \/  |___ (_)___/ __|_ __  ___| |_ _ _ ___| |__  __ _
 *     | |\/| / _ \| / -_)__ \ '_ \/ _ \  _| '_/ -_) '_ \/ _` |
 *     |_|  |_\___// \___|___/ .__/\___/\__|_| \___|_.__/\__,_|
 *               |__/        |_|
 *
 *  (c) 2016 Zdenek Rindt (zdenek.rindt at tul.cz)
 */

'use strict';

import React, { Component } from 'react-native';

// Router
import { Scene, Router, TabBar, Modal, Schema, Actions } from 'react-native-router-flux';

// Redux
import { Provider, connect } from 'react-redux';

import configureStore from '../utils/configureStore'


// Scenes
import App from '../scenes/AppScene';
import OverviewScene from '../scenes/OverviewScene';
import DetailsScene from '../scenes/DetailsScene';
import ReadingsScene from '../scenes/ReadingsScene';

// Modal dialog for readings input
import AddReadingScene from '../scenes/AddReadingScene';


const scenes = Actions.create(
  <Scene key="modal" component={Modal}>
    <Scene key="root" hideNavBar={true}>
      <Scene key="Launch" component={App} title="MojeSpotřeba" />

      <Scene key="Overview" title="Přehled" component={OverviewScene} initial={true} />

      <Scene key="AddReading" title="Přidat odečet" component={AddReadingScene} />
      <Scene key="Details" title="Detail" component={DetailsScene} />
      <Scene key="Readings" title="Odečty" component={ReadingsScene} />
    </Scene>
  </Scene>
);


function getInitialState() {
  const state = {

  };

  return state;
}

export default class Root extends Component {
  render() {
    const store = configureStore(getInitialState());

    return (
      <Provider store={store}>
        <Router scenes={scenes} sceneStyle={{ backgroundColor: '#FFFFFF' }} />
      </Provider>
    );
  }
}
