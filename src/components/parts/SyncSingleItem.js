import React, {Component} from "react";

import {withStyles} from '@material-ui/core/styles';
import {CommonStyle} from 'templates/styles/CommonStyles';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as AccountActions from 'modules/AccountModule';
import * as GlobalActions from 'modules/GlobalModule';
import * as FileActions from 'modules/FileModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class SyncSingleItem extends Component {

    checkType = value => {
        return (value !== 'm');
    }

    handleTypeChange = name => event => {
        const { item } = this.props;
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'a' : 'm') : event.target.value;

        this.props.onChangeSyncType(item.get('no'), value);
    }

    handleShowFolderDialog = (locType) => {
        const { item } = this.props;
        this.props.onShowFolderDialog(item.get('no'), locType);
    }

    handleDblClick = () => {
        // console.log('handleDblClick >>>>>>>>>>>>>>>>>>>>>> ');
    }
    handleSingleClick = () => {
        // console.log('handleSingleClick >>>>>>>>>>>>>>>>>>>>>> ');
    }
    
    render() {
        const { classes } = this.props;
        const { item, key } = this.props;

        // console.log('item ----------- ', (item) ? item.toJS(): 'none');
        return (
            <React.Fragment>
            {item && 
            <Card className={this.props.isFirst ? classes.syncItemCardFirst : classes.syncItemCard} key={key} square={true}>
                <RCContentCardHeader title="동기화 설정정보" subheader=""/>
                <CardContent style={{padding: 20}}>

                    <Grid container spacing={3} style={{marginBottom: 20}}>
                        <Grid item xs={2}><Typography variant="body2" component="p">컴퓨터폴더</Typography></Grid>
                        <Grid item xs={8}><TextField
                                id="pcloc"
                                value={item.get('local')}
                                fullWidth={true}
                                margin="none"
                                variant="outlined"
                                inputProps={{style: {padding: 4}}}
                            />
                        </Grid>
                        <Grid item xs style={{textAlign: 'center'}}><Button className={classes.RCSmallButton}
                            variant="contained" color="primary"
                            onClick={() => this.handleShowFolderDialog('local')} >
                            수정
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} style={{marginBottom: 20}}>
                        <Grid item xs={2}><Typography variant="body2" component="p">저장소폴더</Typography></Grid>
                        <Grid item xs={8}><TextField
                                id="cloudloc"
                                value={item.get('cloud')}
                                fullWidth={true}
                                margin="none"
                                variant="outlined"
                                inputProps={{style: {padding: 4}}}
                            />
                        </Grid>
                        <Grid item xs style={{textAlign: 'center'}}><Button className={classes.RCSmallButton}
                            variant="contained" color="primary"
                            onClick={() => this.handleShowFolderDialog('cloud')} >
                            수정
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={2}><Typography variant="body2" component="p">작동구분</Typography></Grid>
                        <Grid item xs={8}>
                            <FormControlLabel 
                                control={<Switch onChange={this.handleTypeChange('type')} 
                                    checked={this.checkType(item.get('type'))}
                                    color="primary" />}
                                label={(item.get('type') === 'a') ? '자동실행' : '수동실행'}
                            />
                        </Grid>
                        <Grid item xs style={{textAlign: 'center'}}><Button className={classes.RCSmallButton}
                            variant="contained" color="primary"
                            disabled={(item.get('type') === 'a')}
                            onClick={() => this.props.onStartSyncFile(item.get('no'))} >바로실행
                        </Button></Grid>
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
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    FileActions: bindActionCreators(FileActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SyncSingleItem));
