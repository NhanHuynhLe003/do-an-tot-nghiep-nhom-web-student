import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

/**
 * @typedef {import('@mui/material').ButtonProps} ButtonProps
 * @typedef {import('@mui/material/Popover').PopoverProps} PopoverProps
 */

/**
 * @param {{
 *  buttonProps: ButtonProps,
 *  popoverProps: PopoverProps,
 *  contentPopup?: string
 *  contentButton?: string
 * }} props
 */
export default function IPopupButton({
  contentPopup = "The content of the Popover.",
  contentButton = "Open Popover",

  popoverProps = {},
  buttonProps = {},
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
    <div>
      <Button aria-describedby={id} onClick={handleClick} {...buttonProps}>
        {contentButton}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        {...popoverProps}
      >
        <Box
          sx={{
            px: 1,
          }}
        >
          {contentPopup}
        </Box>
      </Popover>
    </div>
  );
}
