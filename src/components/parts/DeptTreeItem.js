import React, { Component } from "react";

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import TreeItem from '@material-ui/lab/TreeItem';

class DeptTreeItem extends Component {

  static propTypes = {
    labelText: PropTypes.string.isRequired
  }

  render() {
    const { classes, ...other } = this.props;

    return (
      <TreeItem
        label={
          <div>label</div>
        }

        {...other}
      >
      </TreeItem>
    );
  }
}



export default withStyles(CommonStyle)(DeptTreeItem);
