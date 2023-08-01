import { CircularProgress } from "@material-ui/core";
import "./Spinner.css";

function Spinner() {
  return (
    <div className="spinner">
      <header className="spinner-header">
        <CircularProgress />
        <p>Loading ......</p>
      </header>
    </div>
  );
}

export default Spinner;
