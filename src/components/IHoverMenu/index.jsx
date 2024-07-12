import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";

function IHoverMenu({
  listMenuItem = [
    { id: 1, content: "001" },
    { id: 2, content: "002" },
    { id: 3, content: "003" },
  ],
  onChange = (value) => {},
  value = listMenuItem[0],
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentContent, setCurrentContent] = React.useState(
    listMenuItem[0]?.content
  );
  function handleClick(event) {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }

  function handleItemClick(item) {
    setCurrentContent(item.content);
    onChange(item);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <Button
        aria-owns={anchorEl ? "simple-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        onMouseOver={handleClick}
      >
        {value?.content}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
      >
        {listMenuItem.map((item, index) => (
          <MenuItem
            key={item.id}
            onClick={() => {
              handleClose();
              handleItemClick(item);
            }}
          >
            {item?.content}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default IHoverMenu;
