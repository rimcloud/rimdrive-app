import React, {Component} from "react";

import {withStyles} from '@material-ui/core/styles';
import {CommonStyle} from 'templates/styles/CommonStyles';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as AccountActions from 'modules/AccountModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


class InfoPage extends Component {

    handleLoginBtnClick = (e) => {
        const {AccountActions, AccountProps} = this.props;
        console.log('AccountProps ::: ', (AccountProps)
            ? AccountProps.toJS()
            : '--');
        AccountActions.reqLoginProcess(AccountProps.get('id'), AccountProps.get('password'));
    }

    handleChangeValue = name => event => {
        this
            .props
            .AccountActions
            .changeAccountParamData({name: name, value: event.target.value});
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {AccountProps: NextAccountProps} = nextProps;
        const {AccountProps} = this.props;
        return NextAccountProps.get('userToken') !== AccountProps.get('userToken');

    }

    render() {
        const {classes} = this.props;
        
        return (
            <React.Fragment>
                <Card className={classes.card}>
                    <RCContentCardHeader title="사용자 정보" subheader=""/>
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
                                <MoreVertIcon style={{ height: "0.6em", color: "#ffffff"}}/>
                            </IconButton>
                        }
                        title="저장소 정보"
                        subheader=""/>
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
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({AccountProps: state.AccountModule});

const mapDispatchToProps = (dispatch) => ({
    AccountActions: bindActionCreators(AccountActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(InfoPage));
