import React, { Component } from "react";
import { ipcRenderer } from 'electron';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountActions from 'modules/AccountModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import MoreVertIcon from '@material-ui/icons/MoreVert';

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

    handleLoginBtnClick = (e) => {
        const { AccountActions, AccountProps } = this.props;
        AccountActions.reqLoginProcess(AccountProps.get('id'), AccountProps.get('password'));
    }

    handleChangeValue = name => event => {
        this
            .props
            .AccountActions
            .changeAccountParamData({ name: name, value: event.target.value });
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     const { AccountProps: NextAccountProps } = nextProps;
    //     const { AccountProps } = this.props;
    //     return NextAccountProps.get('userToken') !== AccountProps.get('userToken');
    // }

    handleShowFolderDialog = () => {
        const pathItems = ipcRenderer.sendSync('sync-msg-select-file');
        if (pathItems && pathItems.length > 0) {
            this.setState({
                pathItem: pathItems[0]
            });
        }
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }    

    render() {
        
        const { classes } = this.props;
        const { AccountProps } = this.props;

        // console.log('infoPage render AccountProps : ', (AccountProps) ? AccountProps.toJS() : 'none');
        
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
                            이름 : 홍길동
                        </Typography>
                        <Typography variant="body2" component="p">
                            아이디 : userid
                        </Typography>
                        <Typography variant="body2" component="p">
                            조직정보 : 차세대개발팀
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={classes.card} square={true}>
                    <RCContentCardHeader
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon style={{ height: "0.6em", color: "#ffffff" }} />
                            </IconButton>
                        }
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
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({ 
    AccountProps: state.AccountModule
});

const mapDispatchToProps = (dispatch) => ({
    AccountActions: bindActionCreators(AccountActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(InfoPage));


