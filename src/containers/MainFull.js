import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import Button from '@material-ui/core/Button';

class MainFull extends Component {

  handleAddClientInGroup = (e) => {
    console.log(e);
  }

    render() {
      return (
        <div>
        
        <Button onClick={this.handleAddClientInGroup} >
                BUTTON
                    </Button>
        
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