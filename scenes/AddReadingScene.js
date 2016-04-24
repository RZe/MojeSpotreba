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
import { Button, Subheader, Divider, Toolbar, COLOR, TYPO, PRIMARY } from 'react-native-material-design';
import { Actions } from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AddReadingForm from '../components/AddReadingForm';
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

export default class AddReadingScene extends Component {

  constructor(props) {
    super(props);

    const measurement = this.props.measurement;
    const attributes = this.props.measurement.attributes;

    let state = {
      // Object used by tcomb forms, it must contain key and value for each field
      values: {},
      // State data for each field used for validation, flags, etc.
      fields: {},
      // Measurement attributes
      attributes,
      // Form state
      isValid: false,
      isFetching: false
    };

    attributes.forEach(attribute => {
      // If there are readings, get top readings and set their value as minimum
      let minimum = 0;

      if (measurement.readings && measurement.readings.length > 0) {
        const previous = measurement.readings[0].attributes.find(a => a.attribute == attribute._id);
        if (previous) {
          minimum = previous.value;
        }
      }

      state.values[attribute._id] = '';
      state.fields[attribute._id] = {
        hasError: false,
        error: '',
        pristine: true,
        minimum
      };
    });

    this.state = state;
  }

  onChange(values) {
    let self = this;
    let isValid = true;

    let oldValues = this.state.values;
    let fields = this.state.fields;

    const attributes = this.props.measurement.attributes;

    attributes.forEach(attribute => {
      // Current value and field data
      let value = oldValues[attribute._id];
      let field = fields[attribute._id];
      const newValue = values[attribute._id];

      let errorMessage = false;

      // Do validation checks if field is dirty or has changed
      if (!field.pristine || (newValue !== value)) {

        if (newValue == '') {
          errorMessage = attribute.name + ' je povinné pole';
        }
        else if (isNaN(newValue)) {
          errorMessage = attribute.name + ' se skládá pouze z číslic';
        }
        else if (newValue < field.minimum) {
          errorMessage = attribute.name + ' musí být větší než ' + field.minimum;
        }

        field.pristine = false;
        field.hasError = !!errorMessage;
        field.error = errorMessage;

        if (field.hasError) {
          isValid = false;
        }

        fields[attribute._id] = field;
      }
    });

    if (isValid) {
      for (let field in fields) {
        if (fields.hasOwnProperty(field)) {
          if (fields[field].pristine == true) {
            isValid = false;
            break;
          }
        }
      }
    }

    this.setState({
      values,
      fields,
      isValid
    });
  }

  onSubmitPress() {
    const measurement = this.props.measurement;

    // Extract attributes from form and create array of attributes reading
    let attributes = this.state.attributes.map(attribute => ({
      attribute: attribute._id,
      value: this.state.values[attribute._id]
    }));

    let reading = {
      measurement: measurement._id,
      date: moment.utc().toISOString(),
      attributes
    };

    this.props.actions.addReadingFormSubmit(reading);
  }

  render() {
    let self = this;
    const measurement = this.props.measurement;

    return (
      <View style={styles.container}>

        <Text style={styles.headline}>{measurement.name}</Text>

        <AddReadingForm
          form={this.props.readings.form}
          attributes={this.state.attributes}
          values={this.state.values}
          fields={this.state.fields}
          onChange={self.onChange.bind(self)}
          style={styles.centered}
        />

        <Button
          disabled={!this.state.isValid || this.state.isFetching}
          onPress={self.onSubmitPress.bind(self)}
          text="PŘIDAT"
          style={styles.centered}
        />

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
  container: {
    flex: 1,
    marginTop: 56,
    padding: 16,
    backgroundColor: '#FFFFFF'
  },
  headline: Object.assign({}, TYPO.paperFontHeadline, {
    paddingBottom: 32
  }),
  centered: {
    justifyContent: 'center',
    // alignItems: 'center',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddReadingScene);
