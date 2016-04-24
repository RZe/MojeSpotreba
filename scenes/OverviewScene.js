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

import React, { Component, StyleSheet, View, ScrollView, Text, ToolbarAndroid } from 'react-native';
import { Button, Card, Subheader, Divider, Toolbar, COLOR, TYPO, PRIMARY } from 'react-native-material-design';
import List from 'react-native-material-design/lib/List';
import MeasurementCard from '../components/MeasurementCard';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import overviewActions from '../reducers/overview/overviewActions';
import measurementsActions from '../reducers/measurements/measurementsActions';
import navigationActions from '../reducers/navigation/navigationActions';


const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...overviewActions, ...measurementsActions, ...navigationActions }, dispatch),
  dispatch
});


class OverviewScene extends Component {

  componentDidMount() {
    this.props.actions.getMeasurements(true);
  }

  render() {

    const { showAddReading, showDetails } = this.props.actions;
    const { measurements } = this.props;

    let content;

    if (!measurements.data) {
      content = (
        <View style={{ padding: 16 }}>
          <Text>Nic tu není</Text>
        </View>
      );
    }
    else if (measurements.error) {
      content = (
        <View style={{ backgroundColor: '#EE1111', padding: 16 }}>
          <Text style={styles.errorText}>Při načítání měření došlo k chybě</Text>
        </View>
      );
    }
    else {
      content = measurements.data.map((measurement, i) => (
        <Card key={i}>
          <Card.Body style={{ background: '#FFD700' }}>
            <MeasurementCard measurement={measurement} />
          </Card.Body>
          <Card.Actions position="right">
            <Button text="NOVÝ ODEČET" onPress={() => { showAddReading(measurement); }} />
            <Button text="DETAIL" onPress={() => { showDetails(measurement); }} />
          </Card.Actions>
        </Card>
      ));
    }

    return (
      <ScrollView style={styles.container}>
        {content}
      </ScrollView>
    );
  }

  static renderNavigationBar(props) {
    return (
      <Toolbar
        title="MojeSpotřeba"
        actions={actions}
        />
    );
  }
}

const actions = [
  // { title: 'Nastavení', icon: 'more-vert', show: 'always' }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: 56
  },
  heading: Object.assign({}, TYPO.paperFontHeadline, {

  }),
  errorText: Object.assign({}, TYPO.paperFontSubheader, {
    color: '#FFFFFF'
  }),
  navigationBar: {
    backgroundColor: COLOR['googleBlue500'].color
  },
  button: {
    margin: 16
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScene);
