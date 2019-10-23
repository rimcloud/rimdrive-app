import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as FileActions from 'modules/FileModule';
import * as ShareActions from 'modules/ShareModule';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";

class ShareListComp extends Component {

  handleSelectItem = (selectedItem) => {
    if (selectedItem.type === 'D') {
      this.props.FileActions.showFilesInFolder({
        path: selectedItem.path
      });
    }
    this.props.FileActions.setSelectedItem({
      selectedItem: selectedItem
    });
  }

  handleDeleteFromShare = (group, id) => {
    const { ShareActions } = this.props;
    ShareActions.deleteItemForShare({
      group: group,
      id: id
    });
  }

  handleChangePermission = (group, id, value) => {
    const { ShareActions } = this.props;
    ShareActions.changePermission({
      group: group,
      id: id,
      value: value
    });
  }

  render() {
    const { classes } = this.props;
    const { ShareProps, isEdit } = this.props;

    const shareDepts = ShareProps.get('shareDepts') ? ShareProps.get('shareDepts') : [];
    const shareUsers = ShareProps.get('shareUsers') ? ShareProps.get('shareUsers') : [];

    return (
        <Card className={classes.card}>
          <CardContent>
            <Table className={classes.table} size="small" stickyHeader>
              <TableHead>
                <TableRow className={classes.fileTableHeadRow}>
                  <TableCell className={classes.fileTableHeadCell} >구분</TableCell>
                  <TableCell className={classes.fileTableHeadCell} >이름</TableCell>
                  <TableCell className={classes.fileTableHeadCell} >위치</TableCell>
                  <TableCell className={classes.fileTableHeadCell} >권한</TableCell>
                  {isEdit &&
                  <TableCell className={classes.fileTableHeadCell} >수정</TableCell>
                  }
                </TableRow>
              </TableHead>
              <TableBody style={{ backgroundColor: '#ffffff', opacity: '0.5' }}>
                {shareDepts.map(dept => {
                  return (
                    <TableRow hover className={classes.fileTableRow} key={dept.get('shareWithUid')}>
                      <TableCell component="th" align="center" scope="dept">조직</TableCell>
                      <TableCell>{dept.get('shareWithName')}</TableCell>
                      <TableCell>{dept.get('whleDeptCd')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>
                      {isEdit &&
                        <ButtonGroup size="small" variant="contained"
                          aria-label="small contained primary button group"
                        >
                          <Button color={dept.get('permissions') === 'R' ? 'secondary' : 'primary'}
                            onClick={() => this.handleChangePermission('dept', dept.get('shareWithUid'), 'R')}
                          >읽기</Button>
                          <Button color={dept.get('permissions') === 'W' ? 'secondary' : 'primary'}
                            onClick={() => this.handleChangePermission('dept', dept.get('shareWithUid'), 'W')}
                          >편집</Button>
                        </ButtonGroup>
                      }
                      {!isEdit &&
                        <Typography>{dept.get('permissions') === 'R' ? '읽기권한' : '편집권한'}</Typography>
                      }
                      </TableCell>
                      {isEdit &&
                      <TableCell style={{textAlign:'center'}}>
                        <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={() => this.handleDeleteFromShare('dept', dept.get('shareWithUid'))}>삭제</Button>
                      </TableCell>
                      }
                    </TableRow>
                  );
                })}
                {shareUsers.map(user => {
                  return (
                    <TableRow hover className={classes.fileTableRow} key={user.get('shareWithUid')}>
                      <TableCell component="th" align="center" scope="dept">사용자</TableCell>
                      <TableCell>{user.get('shareWithName')}</TableCell>
                      <TableCell>{user.get('deptNm')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>
                      {isEdit &&
                        <ButtonGroup size="small" variant="contained"
                          aria-label="small contained primary button group"
                        >
                          <Button color={user.get('permissions') === 'R' ? 'secondary' : 'primary'}
                            onClick={() => this.handleChangePermission('user', user.get('shareWithUid'), 'R')}
                          >읽기</Button>
                          <Button color={user.get('permissions') === 'W' ? 'secondary' : 'primary'}
                            onClick={() => this.handleChangePermission('user', user.get('shareWithUid'), 'W')}
                          >편집</Button>
                        </ButtonGroup>
                      }
                      {!isEdit &&
                        <Typography>{user.get('permissions') === 'R' ? '읽기권한' : '편집권한'}</Typography>
                      }
                      </TableCell>
                      {isEdit &&
                      <TableCell style={{textAlign:'center'}}>
                        <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={() => this.handleDeleteFromShare('user', user.get('shareWithUid'))}>삭제</Button>
                      </TableCell>
                      }
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  GlobalProps: state.GlobalModule,
  ShareProps: state.ShareModule,
  FileProps: state.FileModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  ShareActions: bindActionCreators(ShareActions, dispatch),
  FileActions: bindActionCreators(FileActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(ShareListComp));
