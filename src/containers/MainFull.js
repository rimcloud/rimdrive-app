import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import RCRouters from 'containers/RCRouters';
import CommonTheme from 'templates/theme/CommonTheme';

class MainFull extends Component {

    render() {
      const { classes } = this.props;
      return (
        <MuiThemeProvider theme={createMuiTheme(CommonTheme)}>
        <div>
          <RCRouters />
        </div>
        </MuiThemeProvider>
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