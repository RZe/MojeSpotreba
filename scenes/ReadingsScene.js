/**
 *      __  __      _     ___           _           _
 *     |  \/  |___ (_)___/ __|_ __  ___| |_ _ _ ___| |__  __ _
 *     | |\/| / _ \| / -_)__ \ '_ \/ _ \  _| '_/ -_) '_ \/ _` |
 *     |_|  |_\___// \___|___/ .__/\___/\__|_| \___|_.__/\__,_|
 *               |__/        |_|
 *
 *  (c) 2016 Zdenek Rindt (zdenek.rindt at tul.cz)
 */

'use strict';

import React, { Animated, Component, StyleSheet, View, ScrollView, PanResponder } from 'react-native';
import { Avatar, Divider, Subheader, Toolbar, COLOR, PRIMARY } from 'react-native-material-design';
import { Actions } from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// List is not yet exported by material design library, import it directly
import List from 'react-native-material-design/lib/List';

import ReadingHeader from '../components/ReadingHeader';
import ReadingItem from '../components/ReadingItem';

import readingsActions from '../reducers/readings/readingsActions';


// Moment.js for date formatting
import moment from 'moment';
// There is a bug that prevents moment.locale from being loaded. Use workaround:
require('moment/locale/cs');


const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(readingsActions, dispatch),
  dispatch
});


class ReadingsScene extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showActionButton: false
    };
  }

  componentWillMount() {
    this._panResponder = {};
    /*this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.setState({ showActionButton: (gestureState.dy < 0) });
      }
    });*/
  }

  render() {

    const floatingActionButton = (!this.state.showActionButton ? null : (
      <ActionButton buttonColor="rgba(231,76,60,1)" onPress={Actions.AddReading} />
    ));

    const measurement = this.props.measurement;

    let measurements = measurement.readings.map((reading, i) => (
      <View key={i}>
        <ReadingItem
          date={reading.date}
          measurement={measurement}
          attributes={reading.attributes}
        />
        <Divider />
      </View>
    ));

    return (
      <View style={{ flex: 1, marginTop: 56, backgroundColor: "#FFFFFF" }} {...this._panResponder.panHandlers}>
        <ScrollView>
          <Subheader text="Odečty" />

          {measurements}
        </ScrollView>

        {floatingActionButton}
      </View>
    );
  }

  static renderNavigationBar(props) {
    return (
      <Toolbar
        title={props.measurement.name + " - " + props.title}
        icon="chevron-left"
        onIconPress={Actions.pop}
      />
    );
  }
}


const styles = StyleSheet.create({
  content: {
    padding: 16,
    marginTop: 56
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReadingsScene);
