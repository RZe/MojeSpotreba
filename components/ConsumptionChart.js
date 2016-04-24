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

import { BarChart, CombinedChart } from 'react-native-chart-android';

import measurementUtils from '../utils/measurementUtils';

// Moment.js for date formatting
import moment from 'moment';
// There is a bug that prevents moment.locale from being loaded. Use workaround:
require('moment/locale/cs');


export default class ConsumptionChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      availableWidth: 0
    }
  }
  render() {
    const self = this;

    // Get current year
    const year = moment().year();

    // Callbacks
    const consumptionCallback = (attribute) => (attribute.consumption);

    // Get all readings from current year
    let currentYear = this.props.measurement.attributes.map(attribute => ({
      label: attribute.name + ' ' + year,
      config: {
        color: COLOR['googleBlue500'].color
      },
      data: measurementUtils.getReadingsOfYear(self.props.measurement.readings, attribute._id, consumptionCallback, year)
    }));

    // Get all readings from previous year
    let previousYear = this.props.measurement.attributes.map(attribute => ({
      label: attribute.name + ' ' + (year - 1),
      config: {
        color: COLOR['googleGrey500'].color
      },
      data: measurementUtils.getReadingsOfYear(self.props.measurement.readings, attribute._id, consumptionCallback, year - 1)
    }));


    let data = {
      xValues: moment.monthsShort().map(str => (
        // Convert first character to upper case
        str.substr(0, 1).toUpperCase() + str.substr(1)
      )),
      yValues: [ ...currentYear, ...previousYear ]
    };
    
    let chart = (
      <BarChart
        ref="chart"
        style={{ flex: 1, width: this.state.availableWidth, height: 150 }}
        data={data}
        xAxis={{ drawGridLines: false, gridLineWidth: 1, position: "BOTTOM" }}
        yAxisRight={{ enable: false }}
        yAxisLeft={{ enable: false }}
        yAxis={{ startAtZero: false, drawGridLines: false }}
        drawGridBackground={false}
        backgroundColor="WHITE"
        description={""}
        zoomTo={{ scaleX: 2, xValue: 0 }}
      />
    );

    return (
      <View ref="container" style={styles.container} onLayout={event => this._onLayout(this, event)}>
        {chart}
      </View>
    );
  }

  /**
   *  Because chart width must be specified absolutely (flex is not working), we measure width of the container on each
   *  onLayout event and set new available width. This forces the chart to redraw with correct width.
   *
   *  @param self
   *  @param event
   *  @private
   */
  _onLayout(self, event) {
    let { x, y, width, height } = event.nativeEvent.layout;

    if (this.state.availableWidth !== width) {
      self.setState({ availableWidth: width });
    }
  }
}

ConsumptionChart.propTypes = {
  measurement: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

