
export const CommonStyle = theme => ({

    // Full page. - main container
    fullRoot: {
        //        minHeight: "100vh",
        display: "flex",
        //        flexDirection: "column",        alignItems: "center",
        // justifyContent: "center", backgroundColor: "#efefef", backgroundImage:
        // "linear-gradient(#f9f0e0, #ffa500)"
        backgroundImage: "linear-gradient(#517cff, #ffa500)"
        // backgroundImage: "linear-gradient(#aec1fb, #fbdeaa)"
    },

    homePage: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        
        background: "radial-gradient(#efefef, #b8b8b8)"

        // linear-gradient(#a0a0a0, #ffffff)
        // backgroundColor: "#efefef", backgroundImage: "linear-gradient(#f9f0e0, #ffa500)"
        // backgroundImage: "linear-gradient(#517cff, #ffa500)"
        // backgroundImage: "linear-gradient(#aec1fb, #fbdeaa)"
    },

    fullRoot_old: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#efefef", backgroundImage: "linear-gradient(#f9f0e0,
        // #ffa500)"
        backgroundImage: "linear-gradient(#517cff, #ffa500)"
        // backgroundImage: "linear-gradient(#aec1fb, #fbdeaa)"
    },

    rcCenter: {
        margin: "auto",
        maxWidth: "50%"
    },

    rcMainTitle: {
        color: "#3a3a3a",
        textAlign: "center",
        fontSize: "40px",
        margin: "16px"
    },


    // MAIN
    mainPage: {
        minHeight: "100vh",
        //        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // justifyContent: "center",
        // paddingBottom: "0px",
        // backgroundColor: "#efefef", backgroundImage: "linear-gradient(#f9f0e0,
        // #ffa500)" backgroundImage: "linear-gradient(#517cff, #ffa500)",
        // backgroundImage: "linear-gradient(#aec1fb, #fbdeaa)"
        background: "radial-gradient(#efefef, #b8b8b8)"
    },

    mainTab: {
        backgroundColor: "#5a5a5a",
        color: "#ffffff"
    },

    //

    syncItemCardFirst: {
        minWidth: 275,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0
    },
    syncItemCard: {
        minWidth: 275,
        marginTop: 18,
        marginLeft: 0,
        marginRight: 0
    },

    card: {
        minWidth: 275,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(1.8)',
        fontSize: '16px'
    },
    title: {
        fontSize: '0.7rem'
    },
    pos: {
        marginBottom: 12
    },

    contentPage: {

        // minWidth: "80vw", height: "100%", minHeight: "calc(100vh-48px)", border: "1px
        // solid red", margin: "10px" backgroundImage: "linear-gradient(#aec1fb,
        // #fbdeaa)"

    },

    RCSmallButton: {
        padding: "0px 2px 0px 2px",
        minWidth: "26px",
        minHeight: "24px"
    },

    shareFilesCard: {
        paddingTop: "0px"
    },

    fileTable: {

    },
    fileTableHeadRow: {
        height: 24
    },
    fileTableHeadCell: {
        backgroundColor: 'gray',
        color: 'white',
        border: '1px solid lightgray',
        padding: 0
    },
    fileTableRow: {
        cursor: 'pointer'
    },


    shareAppBar: {
        position: 'relative'
    },
    shareToolbar: {
        minHeight: '48px'
    },
    shareTitle: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
});
