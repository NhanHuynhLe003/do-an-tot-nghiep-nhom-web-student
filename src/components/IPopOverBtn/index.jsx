import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import * as React from "react";

export default function IPopOverBtn({
  wrapperStyle = {},
  popoverStyle = {},
  ButtonComponent = <Button></Button>,
  ComponentPopOver = <Box></Box>,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box sx={{ ...wrapperStyle }}>
      {React.cloneElement(ButtonComponent, {
        "aria-describedby": id,
        onClick: handleClick,
      })}
      <Popover
        sx={{ ...popoverStyle }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {React.cloneElement(ComponentPopOver, {})}
      </Popover>
    </Box>
  );
}
