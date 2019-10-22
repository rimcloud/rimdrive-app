import React, { Component } from "react";
import { ipcRenderer } from 'electron';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountActions from 'modules/AccountModule';

import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';
import path from 'path';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class InfoPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serverUrl: 'http://demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros',
            pathItem: ''
        };
    }

    handleLoginBtnClick = (e) => {
        const { AccountActions, AccountProps } = this.props;
        console.log('AccountProps ::: ', (AccountProps)
            ? AccountProps.toJS()
            : '--');
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

    handleUploadTest = () => {
        const serverUrl = this.state.serverUrl;
        const filePath = this.state.pathItem;

        if (fs.existsSync(filePath)) {
            console.log('The file exists.');
        }

        const bbFile = new Blob([fs.readFileSync(filePath)]);
        const form_data = new FormData();
        form_data.append('rimUploadFile', bbFile, path.basename(filePath));
        form_data.append('method', 'UPLOAD');     
        form_data.append('userid', 'test01');   
        form_data.append('path', encodeURI('/개인저장소/모든파일/abab'));
        return axios.post(serverUrl, form_data);
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }    

    render() {
        
        const { classes } = this.props;

        return (
            <React.Fragment>
                {/**
                <Card className={classes.card}>
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
                <Card className={classes.card}>
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
                                    <TableCell component="th" scope="row">개인저장소</TableCell>
                                    <TableCell align="right">20 GB</TableCell>
                                    <TableCell align="right">495 B</TableCell>
                                </TableRow>
                                <TableRow key={2}>
                                    <TableCell component="th" scope="row">nec</TableCell>
                                    <TableCell align="right">10 GB</TableCell>
                                    <TableCell align="right">340 B</TableCell>
                                </TableRow>
                                <TableRow key={3}>
                                    <TableCell component="th" scope="row">2</TableCell>
                                    <TableCell align="right">10 GB</TableCell>
                                    <TableCell align="right">0 B</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                */}
                <Card>
                    <RCContentCardHeader title='업로드 테스트' subheader="" />
                    <CardContent>
                    <Grid container spacing={3}>
                    <Grid item xs={2}><Typography variant="body2" component="p">서버주소</Typography></Grid>
                    <Grid item xs={8}><TextField
                        value={this.state.serverUrl}
                        fullWidth={true}
                        margin="none"
                        variant="outlined"
                        inputProps={{ style: { padding: 4 } }}
                        onChange={this.handleValueChange('serverUrl')}
                    />
                    </Grid>
                </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={2}><Typography variant="body2" component="p">파일 선택</Typography></Grid>
                            <Grid item xs={8}><TextField
                                value={this.state.pathItem}
                                fullWidth={true}
                                margin="none"
                                variant="outlined"
                                inputProps={{ style: { padding: 4 } }}
                            />
                            </Grid>
                            <Grid item xs style={{ textAlign: 'center' }}><Button className={classes.RCSmallButton}
                                variant="contained" color="primary"
                                onClick={this.handleShowFolderDialog} >
                                선택
                            </Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={6}></Grid>
                            <Grid item xs={6} style={{ textAlign: 'right' }}>
                                <Button className={classes.RCSmallButton}
                                    variant="contained" color="primary"
                                    onClick={this.handleUploadTest} >
                                    업로드
                            </Button>
                            </Grid>
                        </Grid>

                    </CardContent>
                </Card>

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({ AccountProps: state.AccountModule });

const mapDispatchToProps = (dispatch) => ({
    AccountActions: bindActionCreators(AccountActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(InfoPage));


