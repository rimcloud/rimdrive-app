import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountActions from 'modules/AccountModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

class SharePage extends Component {

    handleNodeToggle = (id, extend) => {
        // console.log('id :: ', id);
        // console.log('extend :: ', extend);
    }

    render() {
        const { classes } = this.props;

        const pathItems = <React.Fragment>
            <TreeItem nodeId='1' label='폴더1'>
                <TreeItem nodeId='2' label='파일1' />
                <TreeItem nodeId='3' label='파일2' />
                <TreeItem nodeId='4' label='파일3' />
                <TreeItem nodeId='5' label='폴더2'>
                    <TreeItem nodeId='6' label='파일4' />
                    <TreeItem nodeId='7' label='파일5' />
                </TreeItem>
            </TreeItem>
        </React.Fragment>;

        return (
            <React.Fragment>
                <Card className={classes.card}>
                    <RCContentCardHeader title="Cloud Files" subheader="" />
                    <CardContent className={classes.shareFilesCard}>


                        <Grid container spacing={3}>
                            <Grid item xs={6} style={{backgroundColor: 'yellow'}}>
                                <TreeView
                                    className={classes.shareFilesCard}
                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                    defaultExpandIcon={<ChevronRightIcon />}
                                    onNodeToggle={this.handleNodeToggle}
                                    onClick={this.handleClick}
                                >
                                    {pathItems}
                                </TreeView>

                            </Grid>
                            <Grid item xs={6}>
                                <TreeView
                                    className={classes.shareFilesCard}
                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                    defaultExpandIcon={<ChevronRightIcon />}
                                    onNodeToggle={this.handleNodeToggle}
                                    onClick={this.handleClick}
                                >
                                    {pathItems}
                                </TreeView>
                            </Grid>
                        </Grid>
                        <Paper >
                            <Typography variant="h5" component="h3">
                                This is a sheet of paper.
        </Typography>
                            <Typography component="p">
                                Paper can be used to build surface or other elements for your application.
        </Typography>
                        </Paper>

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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SharePage));
