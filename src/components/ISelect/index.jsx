import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

export default function ISelect({ getValue, listSelect = [] }) {
  const [value, setValue] = React.useState("");
  console.log(listSelect);
  const handleChange = (event) => {
    setValue(event.target.value);
    getValue(event.target.value);
  };
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Thể loại</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        label="Category"
        onChange={handleChange}
      >
        {listSelect.map((item, index) => {
          return (
            <MenuItem key={item} value={item.val}>
              {item.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
