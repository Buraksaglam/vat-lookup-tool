import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Jumbotron,
  Table,
  Alert
} from "reactstrap";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      vat_number: "",
      result: {},
      error: null,
      info: null
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  lookup() {
    this.setState({ error: null });
    this.setState({ info: null });
    fetch("https://vat.erply.com/numbers?vatNumber=" + this.state.vat_number)
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(result => {
        if (!result.Valid)
          this.setState({ info: "This VAT number is invalid" });
        this.setState({ result: result });
      })
      .catch(err => {
        err.text().then(errorBody => {
          const error = JSON.parse(errorBody);
          this.setState({ error: error.error });
        });
      });
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <div className="container">
            <NavbarBrand href="/">Vat Number Lookup Tool</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink href="/">Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="https://github.com/buraksaglam">
                    GitHub
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </div>
        </Navbar>
        <Jumbotron>
          <div className="container">
            <h1 className="display-3">Lookup the VAT Numbers!</h1>
            <p className="lead">
              Lookup the vat numbers and learn more about it.
            </p>
          </div>
        </Jumbotron>
        <div className="container">
          <Form>
            {this.state.error ? (
              <Alert color="danger">{this.state.error}</Alert>
            ) : null}
            {this.state.info ? (
              <Alert color="primary">{this.state.info}</Alert>
            ) : null}
            <FormGroup>
              <Label for="exampleEmail">VAT Number</Label>
              <Input
                type="text"
                name="vat_number"
                id="vatNumber"
                placeholder="Write the vat number"
                value={this.state.vat_number}
                onChange={event => {
                  this.setState({ vat_number: event.target.value });
                }}
              />
            </FormGroup>
            <Button onClick={this.lookup.bind(this)}>Submit</Button>
          </Form>
          {Object.keys(this.state.result).length !== 0 ? (
            <div className="result">
              <Table responsive>
                <tbody>
                  <tr>
                    <td>Country Code:</td>
                    <td>{this.state.result.CountryCode}</td>
                  </tr>
                  <tr>
                    <td>Vat Number:</td>
                    <td>{this.state.result.VATNumber}</td>
                  </tr>
                  <tr>
                    <td>Valid:</td>
                    <td>{this.state.result.Valid ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td>Name:</td>
                    <td>{this.state.result.Name}</td>
                  </tr>
                  <tr>
                    <td>Address:</td>
                    <td>{this.state.result.Address}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Home />, document.getElementById("root"));
