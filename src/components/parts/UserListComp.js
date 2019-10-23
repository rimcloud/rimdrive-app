import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

class UserListComp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: ''
    };
  }

  handleSelectUser = (user) => {
  }

  isChecked(empId) {
    const { shareUsers } = this.props;
    if(shareUsers !== undefined && shareUsers.size > 0) {
      if(shareUsers.findIndex((n) => (n.get('shareWithUid') === empId)) > -1) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { classes } = this.props;
    const { userListData } = this.props;

    return (
      <div>
      {(userListData && userListData.size > 0) && 
      <Table className={classes.table} size="small" stickyHeader>
      <TableHead>
        <TableRow className={classes.fileTableHeadRow}>
        <TableCell className={classes.fileTableHeadCell} >선택</TableCell>
        <TableCell className={classes.fileTableHeadCell} >이름</TableCell>
        <TableCell className={classes.fileTableHeadCell} >아이디</TableCell>
          <TableCell className={classes.fileTableHeadCell} >직급</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {userListData.map(user => {
          return (
          <TableRow hover className={classes.fileTableRow} key={user.get('empId')}
            onClick={() => this.props.onSelectUser(user)}
          >
          <TableCell><Checkbox style={{ padding: 0 }}
          checked={this.isChecked(user.get('empId'))}
          onChange={(event) => this.props.onChangeUserCheck(event, user)}
          inputProps={{
            'aria-label': 'primary checkbox',
          }}
        /></TableCell>
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

export default withStyles(CommonStyle)(UserListComp);
