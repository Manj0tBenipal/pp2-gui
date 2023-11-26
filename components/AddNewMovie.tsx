"use client";
import styles from "@/components/newmovie.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

export default function AddNewMovie({
  setVisibility,
}: {
  setVisibility: Function;
}) {
  return (
    <div className={`${styles.container}`}>
      <CancelIcon
        onClick={() => setVisibility(false)}
        style={{
          position: "absolute",
          right: "1rem",
          top: "1rem",
          cursor: "pointer",
        }}
      />
      <FormControl>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Genre"
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
