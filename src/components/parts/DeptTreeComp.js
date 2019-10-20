import React, { Component } from "react";

import { makeStyles } from '@material-ui/core/styles';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DeptUserActions from 'modules/DeptUserModule';

import SvgIcon from '@material-ui/core/SvgIcon';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';



import MailIcon from '@material-ui/icons/Mail';


const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const useTreeItemStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
    '&:focus > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(4),
    },
  },
  expanded: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

function ItemCircle(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" {...props}>
      <path fill="#000000" d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
    </SvgIcon>
  );
}

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, onItemClick, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot} onClick={onItemClick}>
        <Checkbox style={{padding: 0}}
          checked={false}
        onChange={null}
        value="checkedA"
        inputProps={{
          'aria-label': 'primary checkbox',
        }}
      />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
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
      item = <StyledTreeItem key={deptCd} labelIcon={MailIcon}
              nodeId={deptCd.toString()} labelText={dept.get('deptNm')}
              labelInfo={222}
              onItemClick={() => this.handleSelectDept(deptCd)}
              >
              {(dept.get('children').size > 0) ?
                dept.get('children').map((e) => {
                  return this.getTreeItemMap(deptList, e);
                }) : <div></div>}
              </StyledTreeItem>;
    } else {
      item = <StyledTreeItem key={deptCd} labelIcon={MailIcon}
        nodeId={deptCd.toString()} labelText={dept.get('deptNm')}
        labelInfo={222}
        onItemClick={() => this.handleSelectDept(deptCd)}
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
