import { FormControlLabel, IconButton, Switch, TextField } from "@mui/material";
import { useController } from "react-hook-form";

export function SwitchButton({
  name,
  control,
  label,
  id,
  className,
  style,
  placeHolder,
  //Tuyền các hàm bên dưới nhằm chặn user sửa props bên ngoài InputField
  onChange: extenalChangeInput,
  onBlur: externalBlurInput,
  value: externalValueInput,

  ...rest
}) {
  const {
    field: { onBlur, onChange, ref, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <FormControlLabel
      sx={{
        display: "flex",

        alignItems: "center",
      }}
      control={
        <Switch
          style={style}
          className={className}
          id={id}
          value={value}
          ref={ref}
          onChange={onChange}
          name={name}
          defaultChecked={value}
          {...rest}
        />
      }
      label={label}
    />
  );
}
