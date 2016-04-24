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

import React, { Component, StyleSheet } from 'react-native';
import t from 'tcomb-form-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import readingsActions from '../reducers/readings/readingsActions';


let Form = t.form.Form;


const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(readingsActions, dispatch),
  dispatch
});


class AddReadingForm extends Component {

  render() {
    let formFields = {};
    let options = {
      fields: {
        // To be created later
      }
    };

    this.props.attributes.map(attribute => {
      // Create field options
      const form = this.props.form;
      const field = this.props.fields[attribute._id];

      options.fields[attribute._id] = {
        label: attribute.name,
        maxLength: 12,
        editable: !form.isFetching,
        hasError: field.hasError,
        error: field.error,
        keyboardType: 'numeric',
        textAlignVertical: 'middle',
        stylesheet: customStylesheet
      };

      // ...and field data type
      formFields[attribute._id] = t.Number;
    });

    let readingForm = t.struct(formFields);

    return (
      <Form
        ref="form"
        type={readingForm}
        options={options}
        value={this.props.values}
        onChange={this.props.onChange}
      />
    );
  }
}

// Stylesheet override
let customStylesheet = Object.assign({}, Form.stylesheet);

// Gray color for control labels
customStylesheet.controlLabel.normal.color = '#BBBBBB';

// Fix low padding between text and edit box bottom line
customStylesheet.textbox.normal.paddingBottom = 8;
customStylesheet.textbox.error.paddingBottom = 8;
customStylesheet.textbox.notEditable.paddingBottom = 8;


export default connect(mapStateToProps, mapDispatchToProps)(AddReadingForm);
