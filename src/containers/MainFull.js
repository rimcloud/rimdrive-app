import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import RCRouters from "containers/RCRouters/";

class MainFull extends Component {

    render() {
      const { classes } = this.props;
      return (
        <div>
          <RCRouters />
        </div>
      )
    }

}

const mapStateToProps = (state) => ({
    GlobalProps: state.GlobalModule
  });
  
  const mapDispatchToProps = (dispatch) => ({
    GlobalActions: bindActionCreators(GlobalActions, dispatch)
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(MainFull));