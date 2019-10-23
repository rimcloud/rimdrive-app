import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as ShareActions from 'modules/ShareModule';
import * as FileActions from 'modules/FileModule';
import * as DeptUserActions from 'modules/DeptUserModule';

import RCDialogConfirm from 'components/utils/RCDialogConfirm';
import RCContentCardHeader from 'components/parts/RCContentCardHeader';
import ShareConfDialog from 'components/parts/ShareConfDialog';
import ShareInfoDialog from 'components/parts/ShareInfoDialog';

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
            shareConfDialogOpen: false,
            shareInfoDialogOpen: false
        };
    }

    componentDidMount() {
        const { ShareActions, FileActions, DeptUserActions } = this.props;
        // get share info
        ShareActions.getShareInfoList();
        // get cloud folders
        FileActions.getDriveFolderList();
        // get cloud depts
        DeptUserActions.getDeptList();
    }

    handleShareConfDialogClose = () => {
        this.setState({ shareConfDialogOpen: false });
    }

    handleAddShareInfo = () => {
        this.props.ShareActions.setShareItemRemove();
        this.setState({ shareConfDialogOpen: true });
    }

    handleShareInfoDialogClose = () => {
        this.setState({ shareInfoDialogOpen: false });
    }

    handleShareInfoDialogOpen = () => {
        this.setState({ shareInfoDialogOpen: true });
    }

    handleDeleteShareInfo = () => {
        console.log('handleDeleteShareInfo....');
        
    }

    handleClickShareInfo = (fid, sid) => {
        const { ShareActions } = this.props;
        ShareActions.getShareInfo({
            sid: sid,
            fid: fid
        }).then((res) => {
            if(res.status && res.status.result === 'SUCCESS') {
                this.setState({ shareInfoDialogOpen: true });
            }
        });
    }

    render() {
        const { classes, ShareProps } = this.props;
        const { shareConfDialogOpen, shareInfoDialogOpen } = this.state;

        const shareInfoList = ShareProps.get('shareInfoList');
        // console.log('[SharePage] - shareInfoList >>> ', (shareInfoList) ? shareInfoList.toJS() : 'none');

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
                        {(shareInfoList && shareInfoList.size > 0) &&
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
                                    {shareInfoList.map(sn => {
                                        return (
                                            <TableRow hover className={classes.fileTableRow} key={sn.get('fileId')}
                                                onClick={() => this.handleClickShareInfo(sn.get('fileId'), sn.get('storageId'))}
                                            >
                                                <TableCell component="th" align="center" scope="sn">{sn.get('fileId')}</TableCell>
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
                <ShareConfDialog dialogOpen={shareConfDialogOpen} onDialogClose={this.handleShareConfDialogClose} />
                <ShareInfoDialog dialogOpen={shareInfoDialogOpen} onDialogClose={this.handleShareInfoDialogClose} />
                <RCDialogConfirm />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    ShareProps: state.ShareModule,
    FileProps: state.FileModule
});

const mapDispatchToProps = (dispatch) => ({
    ShareActions: bindActionCreators(ShareActions, dispatch),
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    FileActions: bindActionCreators(FileActions, dispatch),
    DeptUserActions: bindActionCreators(DeptUserActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SharePage));
