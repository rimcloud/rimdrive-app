import React, {Component} from "react";
import fs from 'fs';

import {withStyles} from '@material-ui/core/styles';
import {CommonStyle} from 'templates/styles/CommonStyles';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as AccountActions from 'modules/AccountModule';
import * as GlobalActions from 'modules/GlobalModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class SyncPage extends Component {
    
    componentDidMount() {
        const { GlobalProps } = this.props;
        console.log('SyncPage : componentDidMount');
    }

    handleChangeValue = name => event => {
        this
            .props
            .AccountActions
            .changeAccountParamData({name: name, value: event.target.value});
    }

    handleSaveClick = (e) => {
        try {
            fs.writeFileSync('rimdrive-app.cfg', 'content', 'utf-8');
        } catch (e) {
            alert(e);
        }
    }


    handleAddSyncClick = () => {
        const { GlobalProps } = this.props;
        if(GlobalProps && GlobalProps.getIn(['syncData', 'rimdrive', 'sync']) && GlobalProps.getIn(['syncData', 'rimdrive', 'sync']).size > 1) {
            alert('동기화 항목은 최대 두개만 가능합니다.');
        } else {
            // 디폴트 동기화 항목 추가
            const { GlobalActions } = this.props;
            GlobalActions.addSyncItemData();
        }
    }

    handleClose = (e) => {
        const { GlobalProps } = this.props;
    }

    render() {
        const {classes} = this.props;
        const { GlobalProps } = this.props;

        let currSyncDatas = [];
        console.log('render.....');
        if(GlobalProps && GlobalProps.getIn(['syncData', 'rimdrive', 'sync'])) {
            console.log('-1-');
            const syncs = GlobalProps.getIn(['syncData', 'rimdrive', 'sync']);
            console.log('syncs ::: ', syncs);
            if(syncs && syncs.size > 0) {
                console.log('-2-');
                currSyncDatas = syncs;
                console.log('currSyncDatas ::: ', currSyncDatas);
            }
        }

        return (
            <React.Fragment>

                <Box style={{padding:8, textAlign:'right'}}>
                    <Button onClick={this.handleAddSyncClick} variant="contained" color="primary">
                        파일 동기화 추가
                    </Button>
                </Box>
                {currSyncDatas && currSyncDatas.map(s => (
                    <Card className={classes.card} key={s.get('no')}>
                        <RCContentCardHeader title={`NO.${s.get('no')}`} subheader=""/>
                        <CardContent>
                            <Typography variant="body2" component="p">
                                PC폴더 : {s.get('pclocation')}
                            </Typography>
                            <Typography variant="body2" component="p">
                                저장소폴더 : {s.get('cloudlocation')}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
                }

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    AccountProps: state.AccountModule,
    GlobalProps: state.GlobalModule
});

const mapDispatchToProps = (dispatch) => ({
    AccountActions: bindActionCreators(AccountActions, dispatch),
    GlobalActions: bindActionCreators(GlobalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SyncPage));
