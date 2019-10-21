import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GlobalActions from 'modules/GlobalModule';
import * as FileActions from 'modules/FileModule';
import * as DeptUserActions from 'modules/DeptUserModule';

import ShareConfDialog from 'components/parts/ShareConfDialog';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';
import FileListComp from 'components/parts/FileListComp';
import FolderTreeComp from 'components/parts/FolderTreeComp';

import FileOrFolderView from 'components/parts/FileOrFolderView';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Divider from '@material-ui/core/Divider';


class SharePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: true
        };
    }

    componentDidMount() {
        console.log('>>> SharePage :::  componentDidMount............');
        // get cloud folders
        const { FileActions, DeptUserActions } = this.props;
        
        FileActions.getDriveFolderList()
        DeptUserActions.getDeptList();
    }

    handleClickOpen = () => {
        
        this.setState({
            dialogOpen: true
        });
    };

    handleDialogClose = () => {
        this.setState({
            dialogOpen: false
        });
    }

    render() {
        const { classes, FileProps } = this.props;
        const { dialogOpen } = this.state;

        return (
            <div>
                <Card className={classes.card}>
                    <RCContentCardHeader title="Cloud Files" subheader="" />
                    <CardContent style={{ padding: 0 }}>
                        <Grid container style={{ margin: 0 }}>
                            <Grid item xs={6}>
                                <Box style={{ height: 200, margin: 4, padding: 4, backgroundColor: '#efefef' }}>
                                    <FolderTreeComp folderList={FileProps.get('folderList')} />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box style={{ height: 200, margin: 4, padding: 0, backgroundColor: '#efefef', overflow: 'auto' }}>
                                    <FileListComp />
                                </Box>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Paper elevation={2} style={{ margin: 4, padding: 4, backgroundColor: '#efefef' }}>
                            <FileOrFolderView
                                onOpenShare={this.handleClickOpen}
                            />
                        </Paper>
                    </CardContent>
                </Card>
                <ShareConfDialog dialogOpen={dialogOpen} onDialogClose={this.handleDialogClose} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({ 
    FileProps: state.FileModule 
});

const mapDispatchToProps = (dispatch) => ({
    FileActions: bindActionCreators(FileActions, dispatch),
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    DeptUserActions: bindActionCreators(DeptUserActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SharePage));
