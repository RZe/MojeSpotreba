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

import React, { Component, StyleSheet, Text, View, PropTypes, TouchableNativeFeedback } from 'react-native';
import { Avatar, Subheader, Toolbar, Divider, COLOR, TYPO } from 'react-native-material-design';
import Icon from 'react-native-vector-icons/MaterialIcons';

// List is not yet exported by material design library, import it directly
import List from 'react-native-material-design/lib/List';

import measurementUtils from '../utils/measurementUtils';

// Moment.js for date formatting
import moment from 'moment';
// There is a bug that prevents moment.locale from being loaded. Use workaround:
require('moment/locale/cs');


export default class ConsumptionItem extends Component {
  render() {
    const measurement = this.props.measurement;
    
    let month = moment.months(moment.utc(this.props.date).month());
    month = month.charAt(0).toUpperCase() + month.slice(1);

    return (
      <View style={styles.listContainer}>
        <View style={styles.content}>
          <Text style={styles.primaryText}>{this.props.primaryText}</Text>

          {this.props.attributes.map((attribute, i) => {
            // For every attribute this measurement have calculate latest consumption. First we need to find metadata
            // (information) about the attribute being processed such as name, units, etc.
            const definition = measurement.attributes.find(a => (a._id === attribute.attribute));

            let trendingColor = 'black';
            let trendingIcon = 'trending-flat';

            if (attribute.trending > 0) {
              trendingColor = 'red';
              trendingIcon = 'trending-up';
            }
            else if (attribute.trending < 0) {
              trendingColor = 'green';
              trendingIcon = 'trending-down';
            }

            const formattedTrend = measurementUtils.formatAttributeUnits(Math.abs(attribute.trending), definition, 0);
            
            const consumptionAndTrending = (
              <View style={styles.trending}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name={trendingIcon} style={styles.trendingIcon} color={trendingColor}/>

                  <Text style={[styles.trendingText, { color: trendingColor }]}>
                    {formattedTrend}
                  </Text>
                </View>
              </View>
            );

            // Get attribute metadata
            const attributeName = definition ? definition.name : '';

            let formattedConsumption;
            if (definition) {
              formattedConsumption = measurementUtils.formatAttributeUnits(attribute.consumption, definition, 2);
            }
            else {
              formattedConsumption = attribute.consumption;
            }

            return (
              <View style={styles.row} key={i}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{attributeName}</Text>
                </View>

                {consumptionAndTrending}

                <Text>{formattedConsumption}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

ConsumptionItem.propTypes = {
  primaryText: PropTypes.string.isRequired,
  //date: PropTypes.string.isRequired,
  measurement: PropTypes.object.isRequired,
  attributes: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center'
  },
  content: {
    flex: 1
  },
  row: {
    flexDirection: 'row'
  },
  dateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  primaryText: Object.assign({}, TYPO.paperFontSubhead, {
    lineHeight: 32
  }),
  name: Object.assign({}, TYPO.paperFontBody1, {
    flex: 1,
    lineHeight: 22,
    fontSize: 14,
    color: 'rgba(0,0,0,.54)'
  }),
  value: Object.assign({}, this.name, {
    alignItems: 'flex-end'
  }),

  trendingText: Object.assign({}, TYPO.paperFontSubheading, {
    textAlignVertical: 'center',
    paddingRight: 6
  }),
  trendingIcon: {
    fontSize: 20,
    paddingRight: 6
  }
});
