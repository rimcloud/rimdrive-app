import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FileActions from 'modules/FileModule';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class FileListComp extends Component {

  handleSelectFile = (file) => {
    const { FileActions } = this.props;
    FileActions.showFileDetail({
      selectedFile: file
    });
  }

  render() {
    const { classes } = this.props;
    const { FileProps } = this.props;

    const listData = FileProps.get('listData');

    return (
      <div>
        <Table className={classes.table} size="small" stickyHeader>
          <TableHead>
            <TableRow className={classes.fileTableHeadRow}>
              <TableCell className={classes.fileTableHeadCell} >아이디</TableCell>
              <TableCell className={classes.fileTableHeadCell} >이름</TableCell>
              <TableCell className={classes.fileTableHeadCell} >사이즈</TableCell>
            </TableRow>
          </TableHead>
          {(listData && listData.size > 0) &&
            <TableBody>
              {listData.map(file => {
                return (
                  <TableRow hover className={classes.fileTableRow} key={file.get('fileId')}
                    onClick={() => this.props.onSelectFile({
                      type: 'F',
                      id: file.get('fileId'),
                      name: file.get('fileName'),
                      size: file.get('fileSize')
                    })}
                  >
                    <TableCell component="th" align="center" scope="file">
                      {file.get('fileId')}
                    </TableCell>
                    <TableCell>{file.get('fileName')}</TableCell>
                    <TableCell align="right">{file.get('fileSize')}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          }
          {(listData === null || listData.size < 1) &&
            <TableBody>
              <TableRow hover className={classes.fileTableRow} >
                <TableCell component="th" align="center" colSpan="3">파일이 없습니다.</TableCell>
              </TableRow>
            </TableBody>
          }
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  FileProps: state.FileModule
});

const mapDispatchToProps = (dispatch) => ({
  FileActions: bindActionCreators(FileActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(FileListComp));
