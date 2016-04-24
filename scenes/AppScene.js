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

import React, { Component, StyleSheet, View, Text } from 'react-native';
import { Avatar, Divider, Subheader, Toolbar, COLOR, PRIMARY } from 'react-native-material-design';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Authentication
import authActions from '../reducers/auth/authActions';


const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(authActions, dispatch),
  dispatch
});


class AppScene extends Component {

  componentWillMount() {
    // Invoked once during initial render
    this.props.actions.getAuthenticationToken();
  }

  componentWillReceiveProps() {
    // FIXME Not working
    // This one invoked when component is receiving new props and not for the initial render
    this.props.actions.getAuthenticationToken();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Inicializace...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  header: {

  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppScene);
