import React, { Component } from "react";
import { Map } from 'immutable';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DeptUserActions from 'modules/DeptUserModule';

import SvgIcon from '@material-ui/core/SvgIcon';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

function ItemCircle(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" {...props}>
      <path fill="#000000" d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
    </SvgIcon>
  );
}

class DeptTreeComp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: ''
    };
  }

  handleNodeToggle = (id, extend) => {
    // console.log('id :: ', id);
    // console.log('extend :: ', extend);
  }


  handleSelectDept = (dept) => {
    const { DeptUserActions } = this.props;
    // show dept info and user list

    DeptUserActions.getUserList({
      selectedDeptCd: dept
    });

    DeptUserActions.showDeptInfo({
      selectedDeptCd: dept
    });
  }

  getTreeItemMap = (deptList, deptCd) => {
    const dept = deptList.find(e => (e.get('deptCd') === deptCd));
    let item = null;
    if(dept.get('children').size > 0) {
      item = <TreeItem key={deptCd}
              nodeId={deptCd.toString()} label={dept.get('deptNm')}
              onClick={() => this.handleSelectDept(deptCd)}
              >
              {(dept.get('children').size > 0) ?
                dept.get('children').map((e) => {
                  return this.getTreeItemMap(deptList, e);
                }) : <div></div>}
              </TreeItem>;
    } else {
      item = <TreeItem key={deptCd}
        nodeId={deptCd.toString()} label={dept.get('deptNm')}
        onClick={() => this.handleSelectDept(deptCd)}
        />
    }
    return item;
  }

  render() {
    const { classes, deptList } = this.props;
    
    let deptTree = null;
    if(deptList !== undefined) {
      console.log('deptList >>>>>>>>> ', deptList.toJS());
      deptTree = this.getTreeItemMap(deptList, deptList.getIn([0, 'deptCd']), 1);
    }

    const pathItems = <React.Fragment>
            <TreeItem nodeId='1' label='부서1' onClick={() => this.handleSelectDept(Map({deptName:'부서1',deptId:'dept001'}))}>
                <TreeItem nodeId='2' label='부서2' onClick={() => this.handleSelectDept(Map({deptName:'부서2',deptId:'dept002'}))} />
                <TreeItem nodeId='3' label='부서3' onClick={() => this.handleSelectDept(Map({deptName:'부서3',deptId:'dept003'}))}>
                  <TreeItem nodeId='31' label='부서31' onClick={() => this.handleSelectDept(Map({deptName:'부서31',deptId:'dept0031'}))} />
                  <TreeItem nodeId='32' label='부서32' onClick={() => this.handleSelectDept(Map({deptName:'부서32',deptId:'dept0032'}))} />
                </TreeItem>
                <TreeItem nodeId='4' label='부서4' onClick={() => this.handleSelectDept(Map({deptName:'부서4',deptId:'dept004'}))} />
                <TreeItem nodeId='5' label='부서5' onClick={() => this.handleSelectDept(Map({deptName:'부서5',deptId:'dept005'}))}>
                    <TreeItem nodeId='6' label='부서6' onClick={() => this.handleSelectDept(Map({deptName:'부서6',deptId:'dept006'}))} />
                    <TreeItem nodeId='7' label='부서7' onClick={() => this.handleSelectDept(Map({deptName:'부서7',deptId:'dept007'}))} />
                </TreeItem>
            </TreeItem>
        </React.Fragment>;

    return (
      <div>
      {(deptTree) && 
        <TreeView
          className={classes.shareFilesCard}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultEndIcon={<ItemCircle />}
          onNodeToggle={this.handleNodeToggle}
        >
          {deptTree}
        </TreeView>
      }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  DeptUserProps: state.DeptUserModule
});

const mapDispatchToProps = (dispatch) => ({
  DeptUserActions: bindActionCreators(DeptUserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(DeptTreeComp));
