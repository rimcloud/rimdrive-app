import React, { Component } from "react";
import { ipcRenderer } from 'electron';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as AccountActions from 'modules/AccountModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class InfoPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serverUrl: 'http://demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros',
            pathItem: ''
        };
    }

    componentDidMount() {
        const { AccountProps, AccountActions } = this.props;
        // load and init rimdrive config
        AccountActions.reqLoginUserInfo(AccountProps.get('userId'));
    }

    render() {
        
        const { classes } = this.props;
        const { GlobalProps, AccountProps } = this.props;

        const driveConfig = GlobalProps.get('driveConfig');
        let protocol = (driveConfig) ? driveConfig.get('serverConfig.protocol').value() : '';
        let hostname = (driveConfig) ? driveConfig.get('serverConfig.hostname').value() : '';
        let port = (driveConfig) ? driveConfig.get('serverConfig.port').value() : '';
        
        let paStorageName = '';
        let paStorageQuota = '';
        let paStorageUsed = '';
        if(AccountProps && AccountProps.get('padata')) {
            paStorageName = AccountProps.getIn(['padata', 'name']);
            paStorageQuota = `${AccountProps.getIn(['padata', 'quota'])} GB`;
            paStorageUsed = AccountProps.getIn(['padata', 'used']);
        }

        return (
            <React.Fragment>
                <Card className={classes.card} square={true}>
                    <RCContentCardHeader title="사용자 정보" subheader="" />
                    <CardContent>
                        <Typography variant="body2" component="p">
                            아이디 : userid
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={classes.card} square={true}>
                    <RCContentCardHeader
                        title="저장소 정보"
                        subheader="" />
                    <CardContent>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>저장소 이름</TableCell>
                                    <TableCell align="right">할당량</TableCell>
                                    <TableCell align="right">사용량</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key={1}>
                                    <TableCell component="th" scope="row">{paStorageName}</TableCell>
                                    <TableCell align="right">{paStorageQuota}</TableCell>
                                    <TableCell align="right">{paStorageUsed}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className={classes.card} square={true}>
                    <RCContentCardHeader title="서버 연결 정보" subheader="" />
                    <CardContent>
                        <Typography variant="body2" component="p">프로토콜 : {(protocol) ? protocol.slice(0, -1) : ''}</Typography>
                        <Typography variant="body2" component="p">주소 : {hostname}</Typography>
                        <Typography variant="body2" component="p">포트 : {port}</Typography>
                    </CardContent>
                </Card>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    GlobalProps: state.GlobalModule, 
    AccountProps: state.AccountModule
});

const mapDispatchToProps = (dispatch) => ({
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    AccountActions: bindActionCreators(AccountActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(InfoPage));


