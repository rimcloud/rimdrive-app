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
import ShareViewDialog from 'components/parts/ShareViewDialog';

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
            shareInfoDialogOpen: false,
            shareViewDialogOpen: false
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
    handleShareInfoDialogClose = () => {
        this.setState({ shareInfoDialogOpen: false });
    }
    handleShareViewDialogClose = () => {
        this.setState({ shareViewDialogOpen: false });
    }

    handleClickShareEdit = () => {
        this.setState({
            shareViewDialogOpen: false,
            shareInfoDialogOpen: true
        });
    }

    handleClickShareInfoCreate = () => {
        this.props.ShareActions.setShareItemRemove();
        this.setState({ shareConfDialogOpen: true });
    }

    handleClickShareInfoEdit = (event, fid, sid) => {
        event.stopPropagation();
        const { ShareActions } = this.props;
        //
        ShareActions.getShareInfo({
            sid: sid,
            fid: fid
        }).then((res) => {
            if (res.status && res.status.result === 'SUCCESS') {
                this.setState({ shareInfoDialogOpen: true });
            }
        });
    }

    handleClickShareInfoView = (event, fid, sid) => {
        event.stopPropagation();
        const { ShareActions } = this.props;
        ShareActions.getShareInfo({
            sid: sid,
            fid: fid
        }).then((res) => {
            if (res.status && res.status.result === 'SUCCESS') {
                this.setState({ shareViewDialogOpen: true });
            }
        });
    }

    handleShareInfoDelete = () => {
        const { ShareProps, ShareActions } = this.props;

        this.props.GlobalActions.showConfirm({
            confirmTitle: "공유정보 삭제",
            confirmMsg: "공유정보를 삭제 하시겠습니까?",
            handleConfirmResult: (confirmValue, paramObject) => {
                if (confirmValue) {
                    // delete share data
                    ShareActions.setShareInfoDelete(paramObject).then((res) => {
                        // get share info
                        if (res.status) {
                            if (res.status.result === 'SUCCESS') {
                                alert('공유정보가 삭제되었습니다.');
                            } else if (res.status.result === 'FAIL') {
                                alert(res.status.message);
                            }
                        } else {
                            alert('공유정보 삭제중 오류가 발생하였습니다.');
                        }
                    });
                }
            },
            confirmObject: {
                uid: 'test01',
                shid: ShareProps.getIn(['shareInfo', 'shareId'])
            }
        });

    }

    handleShareInfoSave = (actType) => {
        const { FileProps } = this.props;
        const { ShareProps, ShareActions } = this.props;

        if (actType === 'CREATE') {
            // create share data
            ShareActions.setShareInfoCreate({
                uid: 'test01',
                fid: FileProps.getIn(['selectedItem', 'id']),
                shareDepts: ShareProps.get('shareDepts'),
                shareUsers: ShareProps.get('shareUsers')
            }).then((res) => {
                // get share info
                if (res.status) {
                    if (res.status.result === 'SUCCESS') {
                        ShareActions.getShareInfoList();
                        alert('공유정보가 생성되었습니다.');
                    } else if (res.status.result === 'FAIL') {
                        alert(res.status.message);
                    }
                } else {
                    alert('공유정보 생성중 오류가 발생하였습니다.');
                }


            });
        } else if (actType === 'UPDATE') {
            // update share data
            ShareActions.setShareInfoUpdate({
                uid: 'test01',
                shid: ShareProps.getIn(['shareInfo', 'shareId']),
                shareDepts: ShareProps.get('shareDepts'),
                shareUsers: ShareProps.get('shareUsers'),
                formerShareDepts: ShareProps.get('formerShareDepts'),
                formerShareUsers: ShareProps.get('formerShareUsers'),
            }).then((res) => {
                // get share info
                if (res.status) {
                    if (res.status.result === 'SUCCESS') {
                        alert('공유정보가 수정되었습니다.');
                    } else if (res.status.result === 'FAIL') {
                        alert(res.status.message);
                    }
                } else {
                    alert('공유정보 수정중 오류가 발생하였습니다.');
                }
            });
        }
    }

    render() {
        const { classes, ShareProps } = this.props;
        const { shareConfDialogOpen, shareInfoDialogOpen, shareViewDialogOpen } = this.state;

        const shareInfoList = ShareProps.get('shareInfoList');
        // console.log('[SharePage] - shareInfoList >>> ', (shareInfoList) ? shareInfoList.toJS() : 'none');

        return (
            <div>
                <Card className={classes.card}>
                    <RCContentCardHeader
                        title="공유 정보"
                        action={
                            <Button className={classes.RCSmallButton} variant="contained" color="secondary" onClick={this.handleClickShareInfoCreate}>공유 추가</Button>
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
                                        <TableCell className={classes.fileTableHeadCell} >수정</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{ backgroundColor: '#ffffff', opacity: '0.5' }}>
                                    {shareInfoList.map(sn => {
                                        return (
                                            <TableRow hover className={classes.fileTableRow} key={sn.get('fileId')}
                                                onClick={(event) => this.handleClickShareInfoView(event, sn.get('fileId'), sn.get('storageId'))}
                                            >
                                                <TableCell component="th" align="center" scope="sn">{sn.get('fileId')}</TableCell>
                                                <TableCell>{sn.get('name')}</TableCell>
                                                <TableCell>{sn.get('path')}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{sn.get('shareWithCnt')}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>
                                                    <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={(event) => this.handleClickShareInfoEdit(event, sn.get('fileId'), sn.get('storageId'))}>수정</Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        }
                    </CardContent>
                </Card>
                <ShareConfDialog dialogOpen={shareConfDialogOpen} onDialogClose={this.handleShareConfDialogClose} onShareInfoSave={this.handleShareInfoSave} />
                <ShareInfoDialog dialogOpen={shareInfoDialogOpen} onDialogClose={this.handleShareInfoDialogClose} onShareInfoSave={this.handleShareInfoSave} onShareInfoDelete={this.handleShareInfoDelete} />
                <ShareViewDialog dialogOpen={shareViewDialogOpen} onDialogClose={this.handleShareViewDialogClose} onClickShareEdit={this.handleClickShareEdit} />
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
