import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


class MainFull extends Component {

    render() {
    }

}

const mapStateToProps = (state) => ({
    GlobalProps: state.GlobalModule
  });
  
  const mapDispatchToProps = (dispatch) => ({
    GlobalActions: bindActionCreators(GlobalActions, dispatch)
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRFull));