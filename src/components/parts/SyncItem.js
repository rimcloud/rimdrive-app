import React, {Component} from "react";
import fs from 'fs';

import {withStyles} from '@material-ui/core/styles';
import {CommonStyle} from 'templates/styles/CommonStyles';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as AccountActions from 'modules/AccountModule';
import * as GlobalActions from 'modules/GlobalModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class SyncItem extends Component {

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

    checkType = value => {
        return (value !== 'm');
    }

    handleTypeChange = name => event => {
        const { GlobalActions, item } = this.props;
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'a' : 'm') : event.target.value;
        GlobalActions.chgSyncTypeData({
            no: item.get('no'),
            value: value
        });

        // const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;
        // this.props.MediaRuleActions.setEditingItemValue({
        //     name: name,
        //     value: value
        // });
    }

    render() {
        const { classes } = this.props;
        const { item, key } = this.props;
        console.log('-render item- ', item.toJS());
        // let currSyncDatas = [];
        // let item = null;
        // if(GlobalProps && GlobalProps.getIn(['syncData', 'rimdrive', 'sync'])) {
        //     const syncs = GlobalProps.getIn(['syncData', 'rimdrive', 'sync']);
        //     item = syncs.find(n => (n.get('no') === no));

        //     console.log('-item- ', item);
        //     // console.log('syncs ::: ', syncs);
        //     // if(syncs && syncs.size > 0) {
        //     //     console.log('-2-');
        //     //     currSyncDatas = syncs;
        //     //     console.log('currSyncDatas ::: ', currSyncDatas);
        //     // }
        // }

        return (
            <React.Fragment>
            {item && 
            <Card className={this.props.isFirst ? classes.syncItemCardFirst : classes.syncItemCard} key={key}>
                <RCContentCardHeader title={`#. ${item.get('no')}`} subheader=""/>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={2}><Typography variant="body2" component="p">PC폴더</Typography></Grid>
                        <Grid item xs={8}><TextField
                                id="pcloc"
                                value={item.get('pclocation')}
                                fullWidth={true}
                                margin="none"
                                variant="outlined"
                                inputProps={{style: {padding: 4}}}
                            />
                        </Grid>
                        <Grid item xs style={{textAlign: 'center'}}><Button className={classes.RCSmallButton}
                            variant="contained" color="primary"
                            onClick={this.handleLoginBtnClick} >
                            수정
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={2}><Typography variant="body2" component="p">저장소폴더</Typography></Grid>
                        <Grid item xs={8}><TextField
                                id="cloudloc"
                                value={item.get('cloudlocation')}
                                fullWidth={true}
                                margin="none"
                                variant="outlined"
                                inputProps={{style: {padding: 4}}}
                            />
                        </Grid>
                        <Grid item xs style={{textAlign: 'center'}}><Button className={classes.RCSmallButton}
                            variant="contained" color="primary"
                            onClick={this.handleLoginBtnClick} >
                            수정
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={2}><Typography variant="body2" component="p">작동구분</Typography></Grid>
                        <Grid item xs={6}>
                            <FormControlLabel 
                                control={<Switch onChange={this.handleTypeChange('type')} 
                                    checked={this.checkType(item.get('type'))}
                                    color="primary" />}
                                label={(item.get('type') === 'a') ? '자동실행' : '수동실행'}
                            />
                        </Grid>
                        <Grid item xs={2} style={{textAlign: 'right'}}><Button className={classes.RCSmallButton}
                        variant="contained" color="primary"
                        onClick={this.handleLoginBtnClick} >
                        바로실행
                        </Button></Grid>
                        <Grid item xs style={{textAlign: 'center'}}><Button className={classes.RCSmallButton}
                            variant="contained" color="secondary"
                            onClick={this.handleLoginBtnClick} >
                            삭제
                            </Button>
                        </Grid>
                    </Grid>

                </CardContent>
            </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SyncItem));