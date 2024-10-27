import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import * as React from "react";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLocation } from "react-router-dom";
import theme from "../../theme";

/**
 * @description component Drawer để mở thanh menu khi nhấn vào nút
 * @param {string} orientation - hướng mở menu ( "left" | "top" | "right" | "bottom" ), mặc định là "left"
 * @param {React.ReactNode} drawerButton - nội dung của nút mở menu
 * @param {Array<{text: string, icon: React.ReactNode}>} listItem - danh sách các item trong menu
 * @returns JSX.Element
 */
export default function IDrawer({
  orientation = "left",
  drawerButton = "SHOW",
  listItem = [],
  logo = "/logo-dtvt.png",
}) {
  const location = useLocation();

  // Khởi tạo state cho việc mở và đóng menu với các hướng
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  // Hàm xử lý mở và đóng menu
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  // Hàm render nội dung menu, nhận vào hướng mở menu
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {/* Các Item bên trong drawer */}
      <List>
        <ListItem>
          <ListItemButton>
            <img src={logo} alt="anh-logo-web" width={"50%"} height={"auto"} />
          </ListItemButton>
        </ListItem>
        {listItem.map((item, index) => (
          <ListItem key={item?.id + index} disablePadding>
            <Link to={`${item?.path}`} style={{
              textDecoration: "none",
              color: location.pathname ===item?.path ? '#fff' :"black",
              backgroundColor: location.pathname ===item?.path && theme.colors.primary1,
              width: "100%",
            }}>
              <ListItemButton>
                <ListItemIcon>{React.cloneElement(item?.icon, {
                  style: { color: location.pathname ===item?.path ? '#fff' :"black" },
                })}</ListItemIcon>
                <ListItemText primary={item?.name} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      {/* Sau này nếu muốn chia thêm có thể chia divider bên dưới */}
    </Box>
  );

  return (
    <div>
      <React.Fragment key={orientation}>
        <Button onClick={toggleDrawer(orientation, true)}>
          {drawerButton}
        </Button>
        {/* Drawer có thể trượt ra vào trên mobile */}
        <SwipeableDrawer
          anchor={orientation}
          open={state[orientation]}
          onClose={toggleDrawer(orientation, false)}
          onOpen={toggleDrawer(orientation, true)}
        >
          {list(orientation)}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
