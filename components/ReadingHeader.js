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
import { COLOR } from 'react-native-material-design';

export default class ReadingHeader extends Component {

  render() {
    return (
      <View style={styles.header}>
        <Text style={styles.text}>{this.props.headerText}</Text>
      </View>
    );
  }

}

ReadingHeader.propTypes = {
  headerText: PropTypes.string
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: COLOR['paperGrey500'].color
  },
  text: {
    color: 'rgba(255,255,255,1)',
    margin: 5
  }
});
