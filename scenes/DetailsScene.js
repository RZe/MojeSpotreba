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

import React, { Component, StyleSheet, View, ScrollView, Text, TextInput } from 'react-native';
import { Button, Card, Subheader, Divider, Toolbar, COLOR, TYPO, PRIMARY } from 'react-native-material-design';
import { Actions } from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import readingsActions from '../reducers/readings/readingsActions';
import navigationActions from '../reducers/navigation/navigationActions';

import ConsumptionChart from '../components/ConsumptionChart';
import ConsumptionItem from '../components/ConsumptionItem';

// Moment.js for date formatting
import moment from 'moment';
// There is a bug that prevents moment.locale from being loaded. Use workaround:
require('moment/locale/cs');


const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({...readingsActions, ...navigationActions}, dispatch),
  dispatch
});

export default class DetailsScene extends Component {
  render() {
    const measurement = this.props.measurement;

    let yearCategories = [];


    // Create categories of readings grouped by years, skip first (newest) reading because it has no consumption nor
    // trending
    measurement.readings.slice(1).forEach(reading => {
      const date = moment.utc(reading.date);
      let category = yearCategories.find(cat => cat.year == date.year());

      if (category) {
        // Try to find reading with same month
        /*const month = category.readings.find(r => r.date.month() == date.month());
        if (month) {
          // Sum consumption and trending of readings of same month
          month.consumption += reading.consumption;
          month.trending += reading.trending;
        }
        else {
          // Push whole reading but set date to first day of month
          category.readings.push(Object.assign(reading, { date: date.set('d', 1) }));
        }*/
        category.readings.push(reading);
      }
      else {
        yearCategories.push({
          year: date.year(),
          // Push whole reading but set date to first day of month
          //readings: [ Object.assign(reading, { date: date.set('d', 1) }) ]
          readings: [reading]
        });
      }
    });

    // Sum months in categories

    return (
      <View style={styles.container}>
        <ScrollView>

          <Text style={styles.headline}>{measurement.name}</Text>
          <Subheader text="Srovnání spotřeby za tento a předchozí rok" />

          <View style={{ padding: 16 }}>
            <ConsumptionChart style={styles.chart} measurement={measurement} />

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Button text="NOVÝ ODEČET" onPress={() => this.props.actions.showAddReading(measurement)} />
              <Button text="SEZNAM ODEČTŮ" onPress={() => this.props.actions.showReadings(measurement)} />
            </View>
          </View>

          {yearCategories.map((category, categoryIndex) => {
            const readings = category.readings.map((reading, readingIndex) => (
              <View key={readingIndex}>
                <Divider />
                <ConsumptionItem
                  primaryText={moment.utc(reading.date).format("D. MMMM")}
                  date={reading.date}
                  measurement={measurement}
                  attributes={reading.attributes}
                />
              </View>
            ));

            return (
              <View key={categoryIndex}>
                <View style={styles.separatingSubheader}>
                  <Subheader text={category.year.toString()} />
                </View>

                {readings}
              </View>
            );
          })}

        </ScrollView>
      </View>
    )
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
  container: {
    flex: 1,
    marginTop: 56,
    backgroundColor: '#FFFFFF'
  },
  headline: Object.assign({}, TYPO.paperFontHeadline, {
    margin: 16,
    marginBottom: 8
  }),
  separatingSubheader: {
    flex: 1,
    backgroundColor: '#eaeaea'
  },
  chart: {
    flex: 1,
    padding: 16
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsScene);
