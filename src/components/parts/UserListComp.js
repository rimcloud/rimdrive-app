import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'modules/DeptUserModule';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class UserListComp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: ''
    };
  }

  handleSelectUser = (user) => {
    const { UserActions } = this.props;
    UserActions.showUserDetail({
      selectedUser: user
    });
  }

  render() {
    const { classes } = this.props;
    const { UserProps } = this.props;

    const listData = UserProps.get('listData');

    return (
      <div>
      {(listData && listData.size > 0) && 
      <Table className={classes.table} size="small" stickyHeader>
      <TableHead>
        <TableRow className={classes.fileTableHeadRow}>
          <TableCell className={classes.fileTableHeadCell} >이름</TableCell>
          <TableCell className={classes.fileTableHeadCell} >아이디</TableCell>
          <TableCell className={classes.fileTableHeadCell} >직급</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {listData.map(user => {
          return (
          <TableRow hover className={classes.fileTableRow} key={user.get('empId')}
            onClick={() => this.handleSelectUser(user)}
          >
            <TableCell component="th" align="center" scope="user">{user.get('empId')}</TableCell>
            <TableCell>{user.get('empNm')}</TableCell>
            <TableCell align="right">{user.get('grade')}</TableCell>
          </TableRow>
        );
      })}
      </TableBody>
    </Table>
        }
</div>
    );
  }
}

const mapStateToProps = (state) => ({
  UserProps: state.DeptUserModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(UserListComp));
