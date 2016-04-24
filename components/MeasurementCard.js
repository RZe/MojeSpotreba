/***
 *      __  __      _     ___           _           _
 *     |  \/  |___ (_)___/ __|_ __  ___| |_ _ _ ___| |__  __ _
 *     | |\/| / _ \| / -_)__ \ '_ \/ _ \  _| '_/ -_) '_ \/ _` |
 *     |_|  |_\___// \___|___/ .__/\___/\__|_| \___|_.__/\__,_|
 *               |__/        |_|
 *
 *  (c) 2016 Zdenek Rindt (zdenek.rindt at tul.cz)
 */

import React, { Component, StyleSheet, Text, View, PropTypes } from 'react-native';
import { COLOR, TYPO, PRIMARY } from 'react-native-material-design';
import Icon from 'react-native-vector-icons/MaterialIcons';

import measurementUtils from '../utils/measurementUtils';

// Moment.js for date formatting
import moment from 'moment';
// There is a bug that prevents moment.locale from being loaded. Use workaround:
require('moment/locale/cs');


export default class MeasurementCard extends Component {
  render() {
    const measurement = this.props.measurement;

    let topReadings;
    let currentConsumption = '--';
    let currentTrending;

    // There must be at least two readings to provide consumption data
    if (measurement.readings.length > 1 && measurement.readings[0].hasOwnProperty("attributes")) {

      topReadings = (
        <View style={styles.topReading}>
          <Text>Za období {moment.utc(measurement.readings[1].date).format('D. MMMM YYYY')} až {moment.utc(measurement.readings[0].date).format('D. MMMM YYYY')}</Text>

          {measurement.readings[0].attributes.map((attr, i) => {
            // For every attribute this measurement have calculate latest consumption. First we need to find metadata
            // (information) about the attribute being processed such as name, units, etc.
            const definition = measurement.attributes.find(a => (a._id === attr.attribute));

            // Previous reading of the same attribute gives us consumption
            const previousAttribute = measurement.readings[1].attributes.find(a => (a.attribute === attr.attribute));

            // Get consumption and trending from reading attribute
            currentConsumption = previousAttribute ? previousAttribute.consumption : 0;
            currentTrending = previousAttribute ? previousAttribute.trending : 0;

            let consumptionAndTrending = '';
            if (previousAttribute) {
              let trendingColor = 'black';
              let trendingIcon = 'trending-flat';

              if (currentTrending > 0) {
                trendingColor = 'red';
                trendingIcon = 'trending-up';
              }
              else if (currentTrending < 0) {
                trendingColor = 'green';
                trendingIcon = 'trending-down';
              }

              const formattedTrend = measurementUtils.formatAttributeUnits(Math.abs(currentTrending), definition, 0);

              consumptionAndTrending = (
                <View style={styles.trending}>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon name={trendingIcon} style={styles.trendingIcon} color={trendingColor}/>

                    <Text style={[styles.trendingText, { color: trendingColor }]}>
                      {formattedTrend}
                    </Text>
                  </View>
                </View>
              );
            }

            // Attribute name and units
            const name = definition && (<Text style={TYPO.paperFontCaption}>{definition.name}</Text>) || '';

            let formattedConsumption;
            if (definition) {
              formattedConsumption = measurementUtils.formatAttributeUnits(currentConsumption, definition, 0);
            }
            else {
              formattedConsumption = currentConsumption;
            }

            return (
              <View key={i} style={styles.attribute}>
                {name}
                <View style={{ flexDirection: 'row' }}>
                  <Text style={TYPO.paperFontHeadline}>{formattedConsumption}</Text>

                  {consumptionAndTrending}
                </View>
              </View>
            );
          })}
        </View>
      );
    }
    else {
      topReadings = <Text style={styles.topReading}>Žádné odečty</Text>;
    }

    return (
      <View>
        <Text style={styles.heading}>{measurement.name}</Text>

        {topReadings}
      </View>
    );
  }
}

MeasurementCard.propTypes = {
  measurement: PropTypes.object
};

const styles = StyleSheet.create({
  heading: Object.assign({}, TYPO.paperFontHeadline, {
    color: 'black'
  }),
  topReading: {
    paddingTop: 8,
    paddingBottom: 8
  },
  attribute: {
    paddingTop: 8,
    paddingBottom: 8
  },
  trending: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  trendingText: Object.assign({}, TYPO.paperFontSubheading, {
    fontSize: 20,
    textAlignVertical: 'center'
  }),
  trendingIcon: {
    fontSize: 26,
    paddingRight: 6
  }
});
