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


export default class ReadingItem extends Component {
  render() {
    return (
      <TouchableNativeFeedback
        onPress={this.props.onClick}
        background={TouchableNativeFeedback.Ripple(COLOR['paperGrey500'].color)}
      >
        <View style={styles.listContainer}>
          <View style={styles.content}>
            <Text style={styles.primaryText}>{moment.utc(this.props.date).format("D. MMMM YYYY")}</Text>

            {this.props.attributes.map((attribute, i) => {

              // Get attribute metadata
              const definition = this.props.measurement.attributes.find(a => a._id === attribute.attribute);
              const attributeName = definition ? definition.name : '';

              let formattedValue;
              if (definition) {
                formattedValue = measurementUtils.formatAttributeUnits(attribute.value, definition, 2);
              }
              else {
                formattedValue = attribute.value;
              }

              return (
                <View style={styles.row} key={i}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{attributeName}</Text>
                  </View>
                  <Text style={styles.value}>{formattedValue}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

ReadingItem.propTypes = {
  date: PropTypes.string.isRequired,
  measurement: PropTypes.object.isRequired,
  attributes: PropTypes.array.isRequired,
  onClick: PropTypes.func
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
  })
});
