import React, { useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";

export default function IMenuListFloat({
  ListButtonContent = <div>SHOW</div>,
  menuListItems = [
    { content: "Profile", tag: "profile" },
    { content: "My account", tag: "my-account" },
    { content: "Logout", tag: "logout" },
  ],
  fnClickItem = (payload) => {
    // Hàm xử lý sẽ được đặt ở component cha, ta sẽ truyền hàm qua props
    console.log(payload);
  },
  itemSelected = menuListItems[0].content,
  placement = "bottom-start",
  widthMenuList,
}) {
  // dùng để xác định menu có mở hay không
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  // Xử lý khi click vào button
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Xử lý khi click ra ngoài menu
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // Xử lý khi click vào item
  const handleClickItem = (event, mark) => {
    fnClickItem(mark);

    //Nếu không có các action như "SET_COLOR", "SHOW_MENU_CHILD" thì sẽ đóng menu
    if (!mark.action) {
      handleClose(event);
    }
  };

  // Xử lý khi nhấn Tab hoặc Esc
  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack className="IMenuListFloat_Container" direction="row" spacing={2}>
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          {ListButtonContent}
        </Button>
        <Popper
          style={{ zIndex: 1000, backgroundColor: "#fff" }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement={placement}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  {/* Nơi chứa các menu List */}
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    sx={{
                      width: !widthMenuList
                        ? anchorRef.current.offsetWidth //Độ dài menuList sẽ bằng button Content Show List
                        : widthMenuList,
                      maxHeight: "12rem",
                      overflowY: "auto",
                    }}
                  >
                    {menuListItems &&
                      menuListItems.map((item, index) => (
                        <MenuItem
                          key={item.content + index}
                          onClick={(e) => handleClickItem(e, item)}
                          sx={{
                            fontSize: { sm: "1rem", xs: "0.6em" },
                            // chỉnh màu sắc item khi đang select
                            backgroundColor:
                              item.content === itemSelected
                                ? "rgba(0, 0, 0, 0.08)"
                                : "",
                          }}
                        >
                          {item.content}
                        </MenuItem>
                      ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}
