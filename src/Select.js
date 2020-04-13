import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(2),
    marginBottom: 0,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function CustomizedSelects({
  list,
  label,
  helperText,
  value,
  onChange,
  multiple
}) {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl} margin={"none"} size="small">
      <InputLabel id={label}>{label}</InputLabel>
      <Select
        labelId={label}
        id={label}
        value={value}
        multiple={multiple}
        onChange={onChange}
        filterSelectedOptions={true}
      >
        {list.map(option => (
          <MenuItem value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}
