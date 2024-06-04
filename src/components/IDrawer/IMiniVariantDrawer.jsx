import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { IMiniVariantDrawerWidth } from "../../constants";

const drawerWidth = IMiniVariantDrawerWidth;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      marginTop: "6.75vh",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": { ...closedMixin(theme), marginTop: "6.75vh" },
  }),
}));

export default function IMiniVariantDrawer({
  handleSetWidthToolBarDrawer,
  children,
  listItemDrawer = ["A", "B", "C", "D"],
  direction = "right",
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const IMiniVariantDrawerRef = React.useRef(null);

  // Hàm lấy ra kích thước của toolbar drawer paper hiện tại rồi cập nhật giá trị
  const updateDrawerWidth = () => {
    const rectPaperDrawer = IMiniVariantDrawerRef.current
      .querySelector(".MuiDrawer-paper")
      .getBoundingClientRect();

    handleSetWidthToolBarDrawer(rectPaperDrawer.width);
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(updateDrawerWidth, 200); //Thêm thời gian để lấy kích thước cửa sổ sau khi cập nhật, vì để đóng toolbar mất 1 khoảng tgian mới đóng hết, nếu lấy giữa chừng sẽ không lấy toàn bộ kích thước toolbar
    return () => clearTimeout(timeoutId);
  }, [open]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box
      ref={IMiniVariantDrawerRef}
      className="IMini_Variant_Drawer_Container"
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        "& > .MuiDrawer-docked": {
          order: direction === "right" ? 2 : 1,
          ml: "-4rem",
        },
        "& > .MuiToolbar-regular": {
          px: 1,
        },
      }}
    >
      <CssBaseline />

      {/* <Toolbar
        sx={{
          order: direction === "right" ? 2 : 1,
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerOpen}
          sx={{
            ...(open && { display: "none" }),
            px: "0.5rem",
            color: "var(--color-primary1)",
          }}
          title="xem chức năng chi tiết"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar> */}

      <Drawer variant="permanent" open={open} anchor={direction}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {listItemDrawer &&
            listItemDrawer.map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={handleDrawerOpen}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>
      <Box
        className="Content_Drawer"
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        {children}
      </Box>
    </Box>
  );
}
