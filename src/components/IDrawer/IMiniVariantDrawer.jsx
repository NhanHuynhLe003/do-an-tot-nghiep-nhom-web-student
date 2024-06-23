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
import { Stack, Typography } from "@mui/material";

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
  drawerItems,

  direction = "right",
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [listItemDrawer, setListItemDrawer] = React.useState(drawerItems);

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

  const handleDrawerOpen = (id) => {
    setListItemDrawer((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, isActive: true };
        } else {
          return { ...item, isActive: false };
        }
      });
    });
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setListItemDrawer((prev) => {
      return prev.map((item) => {
        return { ...item, isActive: false };
      });
    });
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

        <Stack
          className="Stack_Drawer_Container"
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          {/* Nội dung content */}
          {listItemDrawer &&
            listItemDrawer.map((itemDrawer, index) => {
              if (itemDrawer.isActive)
                return (
                  <Box
                    key={"CONTENT_DRAWER_" + itemDrawer.id}
                    className="Item_Contents"
                    sx={{
                      px: 1,
                      width: "73%",
                      display: open ? "flex" : "none",
                      minHeight: "80vh",
                      justifyContent: "center",
                      overflowY: "auto",
                      order: open ? 1 : 10,
                      mb: 2,
                    }}
                  >
                    {itemDrawer.componentContent}
                  </Box>
                );
              return <></>;
            })}

          {/* ListButton */}
          <List
            className="List_Item_Button"
            sx={{
              width: open ? "25%" : "100%",
              order: open ? 10 : 1,
              height: "fit-content",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-around",
              position: "sticky",
              top: 0,
            }}
          >
            {listItemDrawer &&
              listItemDrawer.map((itemDrawer, index) => (
                <ListItem
                  key={itemDrawer.id}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <Box
                    sx={{
                      minHeight: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: open ? "flex-end" : "center",
                      // px: 2.5,
                    }}
                    onClick={() => handleDrawerOpen(itemDrawer.id)}
                  >
                    <ListItemButton
                      sx={{
                        justifyContent: open ? "flex-end" : "center",
                        p: "0.75rem 0",

                        px: !open && "2.5rem",

                        maxWidth: "4rem",
                        height: "auto",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          opacity: itemDrawer.isActive ? 1 : 0.5,
                          justifyContent: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "100%",
                          height: "auto",
                        }}
                      >
                        <img
                          width={"40rem"}
                          height={"auto"}
                          alt={`${itemDrawer.title}-icon`}
                          src={itemDrawer.icon}
                        ></img>
                        <Typography
                          variant="h3"
                          sx={{
                            fontSize: "0.85rem",
                            mt: 1,
                            fontWeight: itemDrawer.isActive ? "500" : "400",
                            color: itemDrawer.isActive
                              ? "#333"
                              : "var(--color-gray3)",
                          }}
                        >
                          {itemDrawer.title}
                        </Typography>
                      </ListItemIcon>
                    </ListItemButton>
                  </Box>
                </ListItem>
              ))}
          </List>
        </Stack>
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
