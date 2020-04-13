import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FilterIcon from "@material-ui/icons/FilterListTwoTone";
import ClearIcon from "@material-ui/icons/CloseRounded";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

export default function DialogSelect({
  initialFilter,
  filters,
  fetchData,
  onSelect,
  onClear
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selector, setSelector] = useState(initialFilter);
  const [invalidSelector, setInvalidSelector] = useState({});
  const [data, setData] = useState(null);
  const handleChange = (event, i) => {
    var update = [...selector.slice(0, i)];
    update[i] = event.target.value;
    setSelector(update);
  };

  useEffect(() => {
    setSelector(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    if(data==null) return;
    let invalid = {};
    if (selector.length <= filters.length) {
      var result = data;
      for (var selected = 0; selected < selector.length; selected++) {
        var filter = filters[selected];
        if (filter.key !== ".") {
          result = result[filter.key];
        }
        var nextValue = result[selector[selected]];
        if (nextValue) {
          result = nextValue;
          onSelect(result);
        } else {
          for (; selected < selector.length; selected++) {
            invalid[selected] = true;
          }
        }
      }
    } else handleClear();
    if (
      (selector.length > 0) &&
      Object.keys(invalid).length === selector.length
    ) {
      handleClear();
    }
    setInvalidSelector(invalid);
  }, [selector]);

  useEffect(() => {
    console.log("fetching data");
    fetchData()
      .then(res => {
        filterDepth = res;
        return res;
      })
      .then(res => setData(res));
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClear = () => {
    console.log("clearing");
    setSelector([]);
    onClear();
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let filterDepth = data ? data : {};
  return (
    <div>
      <Button
        size="small"
        startIcon={<FilterIcon size="normal" />}
        endIcon={
          selector.length > 0 ? (
            <ClearIcon
              size="small"
              color="textPrimary"
              style={{
                color: "rgb(86, 86, 86)",
                borderLeft: "1px solid rgb(193, 193, 193)",
                paddingLeft: 4
              }}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleClear();
              }}
            />
          ) : null
        }
        onClick={handleClickOpen}
      >
        {selector.length == 0
          ? "Filter"
          : Object.values(invalidSelector).length >= selector.length
          ? "Invalid"
          : selector.filter((x, i) => !invalidSelector[i]).join("/")}
      </Button>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Select your filter</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            {filters.map((filter, i) => {
              console.log("it", i, filter, filterDepth);
              if (filter.key !== ".") {
                filterDepth = filterDepth[filter.key];
              }
              var menu = Object.keys(filterDepth ? filterDepth : {});
              if (filterDepth && filterDepth[selector[i]]) {
                console.log("updating", filterDepth, selector, i);
                filterDepth = filterDepth[selector[i]];
              }
              return (
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="demo-dialog-native">
                    {filter.label}
                  </InputLabel>
                  {
                    <Select
                      value={selector[i] ? selector[i] : "India"}
                      onChange={e => handleChange(e, i)}
                      input={<Input id="demo-dialog-native" />}
                    >
                      {menu.map(key => (
                        <MenuItem value={key}>{key}</MenuItem>
                      ))}
                    </Select>
                  }
                </FormControl>
              );
            })}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
