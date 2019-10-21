import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GlobalActions from 'modules/GlobalModule';
import * as FileActions from 'modules/FileModule';
import * as DeptUserActions from 'modules/DeptUserModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';
import ShareConfDialog from 'components/parts/ShareConfDialog';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class SharePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false
        };
    }

    componentDidMount() {
        console.log('>>> SharePage :::  componentDidMount............');
        const { FileActions, DeptUserActions } = this.props;
        // get share info
        FileActions.getSharedInfoList();
        // get cloud folders
        FileActions.getDriveFolderList();
        DeptUserActions.getDeptList();
    }

    handleClickOpen = () => {
        this.setState({
            dialogOpen: true
        });
    };

    handleDialogClose = () => {
        this.setState({
            dialogOpen: false
        });
    }

    handleAddShareInfo = () => {
        this.setState({
            dialogOpen: true
        });
    }

    handleDeleteShareInfo = () => {
        console.log('handleDeleteShareInfo....');
    }

    render() {
        const { classes, FileProps } = this.props;
        const { dialogOpen } = this.state;

        const sharedList = FileProps.get('sharedList');
        // console.log('nsharedList >>>>>>>>> ', (sharedList) ? sharedList.toJS() : '00000');


        return (
            <div>
                <Card className={classes.card}>
                    <RCContentCardHeader
                        title="공유 정보"
                        action={
                            <Button className={classes.RCSmallButton} variant="contained" color="secondary" onClick={this.handleAddShareInfo}>공유 추가</Button>
                        }
                        subheader="" />
                    <CardContent>
                        {(sharedList && sharedList.size > 0) &&
                            <Table className={classes.table} size="small" stickyHeader>
                                <TableHead>
                                    <TableRow className={classes.fileTableHeadRow}>
                                        <TableCell className={classes.fileTableHeadCell} >아이디</TableCell>
                                        <TableCell className={classes.fileTableHeadCell} >이름</TableCell>
                                        <TableCell className={classes.fileTableHeadCell} >위치</TableCell>
                                        <TableCell className={classes.fileTableHeadCell} >공유대상수</TableCell>
                                        <TableCell className={classes.fileTableHeadCell} >삭제</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{ backgroundColor: '#ffffff', opacity: '0.5' }}>
                                    {sharedList.map(sn => {
                                        return (
                                            <TableRow hover className={classes.fileTableRow} key={sn.get('fileId')}>
                                                <TableCell component="th" align="center" scope="sn">
                                                    {sn.get('fileId')}
                                                </TableCell>
                                                <TableCell>{sn.get('name')}</TableCell>
                                                <TableCell>{sn.get('path')}</TableCell>
                                                <TableCell>{sn.get('shareWithCnt')}</TableCell>
                                                <TableCell>
                                                    <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={this.handleDeleteShareInfo}>삭제</Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        }
                    </CardContent>
                </Card>
                <ShareConfDialog dialogOpen={dialogOpen} onDialogClose={this.handleDialogClose} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    FileProps: state.FileModule
});

const mapDispatchToProps = (dispatch) => ({
    FileActions: bindActionCreators(FileActions, dispatch),
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    DeptUserActions: bindActionCreators(DeptUserActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SharePage));
