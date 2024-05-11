import { IconButton, TextField } from "@mui/material";
import { useController } from "react-hook-form";

export function InputArea({
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
    <TextField
      value={value}
      ref={ref}
      onChange={onChange}
      name={name}
      fullWidth
      error={!!error} //Nếu có lỗi thì hiện thông báo lỗi
      helperText={error?.message} //Text bên dưới hiển thị lỗi validation
      margin="none"
      label={label}
      id={id}
      className={className}
      style={style}
      placeholder={placeHolder}
      {...rest}
    ></TextField>
  );
}
