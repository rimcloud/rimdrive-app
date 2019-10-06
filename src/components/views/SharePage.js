import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GlobalActions from 'modules/GlobalModule';
import * as AccountActions from 'modules/AccountModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';
import FileListComp from 'components/parts/FileListComp';
import FolderTreeComp from 'components/parts/FolderTreeComp';
import DetailViewComp from 'components/parts/DetailViewComp';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';

class SharePage extends Component {

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Card className={classes.card}>
                    <RCContentCardHeader title="Cloud Files" subheader="" />
                    <CardContent style={{padding:0}}>
                        <Grid container style={{margin: 0}}>
                            <Grid item xs={6}>
                                <Box style={{height:200, border:'1px solid pink' }}>
                                    <FolderTreeComp />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box style={{height:200, border:'1px solid pink', overflow: 'auto'}}>
                                    <FileListComp />
                                </Box>
                            </Grid>
                        </Grid>
                        <Paper elevation={2} style={{margin:4, padding:4, backgroundColor: '#efefef'}}>
                            <DetailViewComp />
                        </Paper>
                    </CardContent>
                </Card>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({ AccountProps: state.AccountModule });

const mapDispatchToProps = (dispatch) => ({
    AccountActions: bindActionCreators(AccountActions, dispatch),
    GlobalActions: bindActionCreators(GlobalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SharePage));
