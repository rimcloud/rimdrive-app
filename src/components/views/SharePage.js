import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GlobalActions from 'modules/GlobalModule';
import * as FileActions from 'modules/FileModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';
import FileListComp from 'components/parts/FileListComp';
import FolderTreeComp from 'components/parts/FolderTreeComp';

import FileAndFolderView from 'components/parts/FileAndFolderView';

import DeptTreeComp from 'components/parts/DeptTreeComp';
import UserListComp from 'components/parts/UserListComp';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class SharePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false
        };
    }

    componentDidMount() {
        console.log('>>> SharePage :::  componentDidMount............');
        // get cloud folders
        const { FileActions } = this.props;
        FileActions.getDriveFolderList()
    }

    handleClickOpen = () => {
        this.setState({
            dialogOpen: true
        });
    };

    handleClose = () => {
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
                            <FileAndFolderView
                                onOpenShare={this.handleClickOpen}
                            />
                        </Paper>
                    </CardContent>
                </Card>
                <Dialog fullScreen open={dialogOpen} onClose={this.handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.shareAppBar}>
                        <Toolbar className={classes.shareToolbar}>
                            <Typography edge="start" variant="h6" className={classes.shareTitle}>공유 설정</Typography>
                            <Button color="primary" variant="contained" className={classes.RCSmallButton} onClick={this.handleClose}>저장</Button>
                            <IconButton color="inherit" onClick={this.handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Grid container style={{ margin: 0 }}>
                        <Grid item xs={6} >
                            <Box style={{ height: 200, margin: 4, padding: 4, backgroundColor: '#efefef' }}>
                                <DeptTreeComp />
                            </Box>
                        </Grid>
                        <Grid item xs={6} >
                            <Box style={{ height: 200, margin: 4, padding: 4, backgroundColor: '#efefef', overflow: 'auto' }}>
                                <UserListComp />
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider />
                    <div>선택된 조직 또는 사용자를 표시한다.</div>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({ 
    FileProps: state.FileModule 
});

const mapDispatchToProps = (dispatch) => ({
    FileActions: bindActionCreators(FileActions, dispatch),
    GlobalActions: bindActionCreators(GlobalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SharePage));
