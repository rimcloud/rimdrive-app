import React, { Component } from "react";

import { makeStyles } from '@material-ui/core/styles';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import SvgIcon from '@material-ui/core/SvgIcon';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import MailIcon from '@material-ui/icons/Mail';

const useTreeItemStyles = makeStyles(theme => ({
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
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
  const { labelText, labelIcon: LabelIcon, onItemClick, onItemChange, isChecked, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot} onClick={onItemClick}>
          {props.nodeId !== '0' &&
          <Checkbox style={{ padding: 0 }}
            checked={isChecked}
            onChange={onItemChange}
            value="checkedA"
            inputProps={{
              'aria-label': 'primary checkbox',
            }}
          />
          }
          <Typography variant="body2">
            {labelText}
          </Typography>
        </div>
      }
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

  isChecked(deptCd) {
    const { shareDepts } = this.props;
    if(shareDepts !== undefined && shareDepts.size > 0) {
      if(shareDepts.findIndex((n) => (n.get('shareWithUid') === deptCd)) > -1) {
        return true;
      }
    }
    return false;
  }

  getTreeItemMap = (deptList, deptCd) => {
    const dept = deptList.find(e => (e.get('deptCd') === deptCd));

    if (dept.get('children').size > 0) {
      return <StyledTreeItem key={deptCd} labelIcon={MailIcon}
        nodeId={deptCd.toString()} labelText={dept.get('deptNm')}
        isChecked={this.isChecked(deptCd)}
        onItemClick={() => this.props.onSelectDept(deptCd)}
        onItemChange={(event) => this.props.onChangeDeptCheck(event, dept)}
      >
        {(dept.get('children').size > 0) ?
          dept.get('children').map((e) => {
            return this.getTreeItemMap(deptList, e);
          }) : <div></div>}
      </StyledTreeItem>;
    } else {
      return <StyledTreeItem key={deptCd} labelIcon={MailIcon}
        nodeId={deptCd.toString()} labelText={dept.get('deptNm')}
        isChecked={this.isChecked(deptCd)}
        onItemClick={() => this.props.onSelectDept(deptCd)}
        onItemChange={(event) => this.props.onChangeDeptCheck(event, dept)}
      />
    }
  }

  render() {
    const { classes, deptList } = this.props;

    let deptTree = null;
    if (deptList !== undefined) {
      // console.log('deptList >>>>>>>>> ', deptList.toJS());
      deptTree = this.getTreeItemMap(deptList, deptList.getIn([0, 'deptCd']), 1);
    }

    return (
      <div>
        {(deptTree) &&
          <Card elevation={0} square={true} >
            <RCContentCardHeader title="조직" subheader=""/>
            <CardContent>
              <TreeView
                className={classes.shareFilesCard}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                defaultEndIcon={<ItemCircle />}
                onNodeToggle={this.handleNodeToggle}
              >
                {deptTree}
              </TreeView>
            </CardContent>
          </Card>
        }
      </div>
    );
  }
}

export default withStyles(CommonStyle)(DeptTreeComp);
