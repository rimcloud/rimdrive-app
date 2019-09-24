
import { commonLayout } from "templates/styles/CommonLayout";

export const CommonStyle = theme => ({

    // Full page. - main container
    fullRoot_1: {
        border: "1px solid red",
        
        // backgroundColor: "#efefef",
        // backgroundImage: "linear-gradient(#f9f0e0, #ffa500)"
        backgroundImage: "linear-gradient(#517cff, #ffa500)"
        // backgroundImage: "linear-gradient(#aec1fb, #fbdeaa)"
    },

    fullRoot: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#efefef",
        // backgroundImage: "linear-gradient(#f9f0e0, #ffa500)"
        backgroundImage: "linear-gradient(#517cff, #ffa500)"
        // backgroundImage: "linear-gradient(#aec1fb, #fbdeaa)"
    },

    homeFull: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#efefef",
        // backgroundImage: "linear-gradient(#f9f0e0, #ffa500)"
        backgroundImage: "linear-gradient(#517cff, #ffa500)"
        // backgroundImage: "linear-gradient(#aec1fb, #fbdeaa)"
    },

    fullRoot_old: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#efefef",
        // backgroundImage: "linear-gradient(#f9f0e0, #ffa500)"
        backgroundImage: "linear-gradient(#517cff, #ffa500)"
        // backgroundImage: "linear-gradient(#aec1fb, #fbdeaa)"
    },

    rcCenter: {
        margin: "auto",
        maxWidth: "50%",
    },

    rcMainTitle: {
        color: "#3a3a3a",
        textAlign: "center",
        fontSize: "40px",
        margin: "16px"
    },

    mainPage: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        
        // backgroundColor: "#efefef",
        // backgroundImage: "linear-gradient(#f9f0e0, #ffa500)"
        // backgroundImage: "linear-gradient(#517cff, #ffa500)",
        backgroundImage: "linear-gradient(#aec1fb, #fbdeaa)"
    },


    appBody: {
        marginTop: 0,
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        overflowX: "hidden",
    },
    fullMain: {
        marginRight: 0,
        marginLeft: commonLayout.sideBarWidth,
        marginTop: commonLayout.headerHeight,
        flex: 1,
        zIndex: 1200,
        minWidth: 0,
        transition: "margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s",
        display: "block",
    },
    fullWideMain: {
        marginRight: 0,
        marginLeft: 0,
        marginTop: commonLayout.headerHeight,
        flex: 1,
        zIndex: 1200,
        minWidth: 0,
        transition: "margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s",
        display: "block",
    },


    // PAGE Header (global)
    headerRoot: {
        display: "flex",
        flexDirection: "row",
        zIndex: 1300,
        position: "fixed",
        height: commonLayout.headerHeight,
        padding: 0,
        margin: 0,
        boxShadow: "none",
    }, 

    headerToolbar: {
        flexDirection: "row",
        minHeight: commonLayout.headerHeight,
        width: "100%"
    },

    headerBrandLogo: {
        color: "white",
        width: "calc(" + commonLayout.sideBarWidth + " - 24px)",
        paddingLeft: 0,
        paddingRight: 0
    },

    // MENU (use router)
    menuRoot: {
        transition: "left 0.25s, right 0.25s, width 0.25s",
        position: "relative",
        flexWrap: "wrap",
        overflowX: "auto",
        overflowY: "auto",
        minWidth: 700,
        marginTop: 0,
        height:
            "calc(100vh - " +
            commonLayout.headerHeight +
            " - " +
            commonLayout.breadcrumbHeight +
            " - " +
            commonLayout.footerHeight +
            " - " +
            "20px" +
            ")",
    },

    // MENU Header
    menuHeaderRoot: {
        paddingBottom: 0,
        marginBottom: 10
    },

    menuHeaderTitle: {
        margin: '8px 20px 16px 20px',
        fontWeight: 'bold',
        borderBottom: '#455a64',
        borderBottomWidth: 'thin',
        borderBottomStyle: 'dashed'
    },

    // MENU Body
    menuBodyRoot: {
        marginLeft: 20,
        marginRight: 20,
        boxShadow: "none",
        backgroundColor: theme.palette.background.default
    },

    menuContainerClass: {
        top: commonLayout.headerHeight + " !important",
        position: "fixed",
        zIndex: 1019,
        width: commonLayout.sideBarWidth,
        height: "calc(100vh - " + commonLayout.headerHeight + ") !important",
        flex: "0 0 200px",
        order: "-1",
        transition: "margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: 0,
    },

    menuItemClass: {
        padding: "3px 5px 0px 20px !important",
        '&:focus': {
          backgroundColor: "#78909C",
        }
    },

    nestedClass: {
        padding: "3px 5px 0px 30px !important"
    },
    nestedMoreClass: {
        padding: "3px 5px 0px 40px !important"
    },
    
    // MENU Footer
    menuFooterRoot: {
        textAlign: "right",
        padding: "0.5rem 1rem",
        height: commonLayout.footerHeight,
        borderTop: "1px solid #a4b7c1",
        minWidth: 700
    },
    

    // Breadcrumb
    breadcrumbRoot: {
        transition: "left 0.25s, right 0.25s, width 0.25s",
        position: "relative",
        borderBottom: "1px solid #a4b7c1",
        display: "flex",
        flexWrap: "wrap",
        padding: "0.75rem 1rem",
        marginTop: 0,
        marginBottom: 0,
        listStyle: "none",
        height: commonLayout.breadcrumbHeight,
        alignItems: "center"
    },
    breadcrumbParentMenu: {
        color: "blue"
    },
    breadcrumbCurrentMenu: {
        color: "#455a64"
    },

    // Rule Component
    ruleViewerCard: {
        border: "1px solid #efefef",
        backgroupColor: "#fefefe"
    },
    compTitle: {
        backgroundColor:"lightBlue",
        color:"blue",
        fontWeight:"bold"
    },
    compTitleForBasic: {
        backgroundColor:"lightPink",
        color:"red",
        fontWeight:"bold"
    },
    compTitleForUserRole: {
        backgroundColor:"Moccasin",
        color:"Peru",
        fontWeight:"bold"
    },
    compTitleForEmpty: {
        backgroundColor:"lightBlue",
        color:"white",
        fontWeight:"bold"
    },
    


    // TREE
    parentNodeClass: {
        color: "#455a64"
    },

    childNodeClass: {
        color: "#808080"
    },


    // Client Selecter (GRClientSelector)
    csRoot: {
        border: '0px solid gray',
        display: 'flex'
    },
    csGroupArea: {
        height: "100%",
        width: "30%",
        overflow: "auto"
    },
    csClientArea: {
        height: "100%",
        width: "70%",
        overflow: "auto"
    },
    csSelectItemList: {
        paddingTop: "0px",
        paddingBottom: "0px"
    },
    csSelectItem: {
        padding: "5px 0px 5px 0px"
    },
    csSelectCheck: {
        width: "24px",
        height: "24px"
    },



    // Client information dialog (ClientDialog)
    tabContainer: {
        margin: "0px 30px",
        minHeight: 500,
        minWidth: 500
    },


    // Client Profile Setter
    profileLabel: {
        height: "25px",
        marginTop: "10px"
    },
    profileItemRow: {
        marginTop: "10px"
    },

    // Register key manager - ??????????????????
    createButton: {
        paddingTop: 24
    },

    // Department manager
    deptTreeCard: {
        maxHeight: "300px"
    },
    deptInfoCard: {
        marginBottom: "0px"
    },
    deptUserCard: {
        marginTop: "20px"
    },
    deptTitle: {
        marginBottom: "16px",
        fontSize: "14px",
    },
    deptCd: {
        marginBottom: "12px"
    },

    // alarm badge
    alarmBadge: {
        top: 0,
        right: 0,
        width: 30
    },
    
    // notice manager
    noticeContentCard: {
        boxShadow: 'initial',
        backgroundColor: 'initial'
    },
    noticeContentCardHeader: {
        padding: '14.5px',
        textAlign: 'center'
    },
    noticeContentCardHeaderTitle: {
        fontSize: '0.75rem',
        color: 'rgba(0, 0, 0, 0.54);'
    },
    noticeContentCardContent: {
        overflow: 'auto',
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        padding: '0 16px'
    },
    noticeDialogContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        outline: 'none'
    },
    noticeDialogHeader: {
        padding: '24px 24px 20px'
    },
    noticeDialogContent: {
        padding: '0 24px 24px'
    },
    noticeDialogActions: {
        justifyContent: 'flex-end'
    },



    // COMMON ----------------------------------------------------
    fullWidth: {
        width: "100%"
    },
    bullet: {
        display: 'inline-block',
        margin: '0px 2px',
        transform: 'scale(1.8)',
        fontSize: '16px'
    },
    cartBullet: {
        display: 'inline-block',
        margin: '0px 2px',
        transform: 'scale(1.8)',
        fontSize: '12px'
    },
    smallIconButton: {
        minWidth: '34px'
    },
    GRSmallButton: {
        padding: "0px 2px 0px 2px",
        minWidth: "26px",
        minHeight: "24px"
    },
    GRIconSmallButton: {
        padding: "0px 2px 0px 0px",
        minWidth: "48px",
        minHeight: "24px"
    },
    popoverMsg: {
        margin: theme.spacing.unit * 2,
        color: theme.palette.error.light
    },

    // Dialog Container and row - common (containerClass)
    dialogContainer: {
        margin: "0px 30px",
        minHeight: 300,
        minWidth: 500
    },
    dialogItemRow: {
        marginTop: "0px",
    },
    dialogItemRowBig: {
        marginTop: "10px",
    },

    buttonInTableRow: {
        color: "darkgray",
        padding: "0px",
        minWidth: "0px",
        minHeight: "0px"
    },

    // table, tr, th, td
    grSmallAndHeaderCell: {
        paddingLeft: "0px",
        paddingRight: "0px",
    },
    grSmallAndHeaderCellAndFix: {
        paddingLeft: "0px",
        paddingRight: "0px",
        position: "sticky",
        top: 0
    },
    grSmallAndClickCell: {
        padding: "0px",
        cursor: "pointer"
    },
    grSmallAndClickCellAndBreak: {
        padding: "0px",
        cursor: "pointer",
        wordBreak: "break-all"
    },
    grSmallAndClickAndNumericCell: {
        padding: "0px 10px 0px 0px",
        cursor: "pointer",
    },
    grSmallAndClickAndCenterCell: {
        padding: "0px 0px 0px 0px",
        cursor: "pointer",
        textAlign: "center"
    },
    grSmallAndClickAndCenterCellAndBreak: {
        padding: "0px 0px 0px 0px",
        cursor: "pointer",
        textAlign: "center",
        wordBreak: "break-all"
    },
    grSmallAndClickAndRightCell: {
        padding: "0px 0px 0px 0px",
        cursor: "pointer",
        textAlign: "right"
    },
    grObjInCell: {
        height: "inherit"
    },

    grSelectedRow: {
        backgroundColor: theme.palette.secondary.light + " !important"
    },

    grDefaultRuleRow: {
        backgroundColor: "#fae9dc"
    },
    grStandardRuleRow: {
        backgroundColor: "#faf8e4"
    },

    // root: {
    //     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    //     borderRadius: 3,
    //     border: 0,
    //     color: 'white',
    //     height: 48,
    //     padding: '0px 30px',
    //     boxShadow: '0px 3px 5px 2px rgba(255, 105, 135, .3)',
    // },
    // label: {
    //     textTransform: 'capitalize',
    // },

    specCategory: {
        fontWeight: 'bold',
        fontSize: '0.85rem',
        padding: '0px 2px 0px 2px',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        verticalAlign: 'inherit',
        color: '#b69238'
    },
    specTitle: {
        fontSize: '0.75rem',
        padding: '0px 2px 0px 2px',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        verticalAlign: 'inherit'
    },
    specContent: {
        fontSize: '0.75rem',
        fontWeight: 'bold',
        padding: '2px 12px 0px 2px',
        textAlign: 'right',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        verticalAlign: 'inherit'
    }


});

