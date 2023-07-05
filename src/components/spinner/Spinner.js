import logo from "./logo.svg";
import "./Spinner.css";

function Spinner() {
  return (
    <div className="spinner">
      <header className="spinner-header">
        <img src={logo} className="spinner-logo" alt="logo" />
        <p>Loading ......</p>
      </header>
    </div>
  );
}

export default Spinner;
