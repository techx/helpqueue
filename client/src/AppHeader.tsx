import React, { useEffect } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import useLogin from "./hooks/useLogin";
import useViewer, { Query } from "./hooks/useViewer";
import ServerHelper, { ServerURL } from "./components/ServerHelper";
import { useCookies } from "react-cookie";
import { ClientSettings } from "./components/Types";

const AppHeader: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [cookies, setCookies] = useCookies(["settings"]);
  const settings: ClientSettings | null = cookies["settings"]
    ? cookies["settings"]
    : null;
  const { viewer, isLoggedIn } = useViewer();
  const { logout, redirectToDopeAuth } = useLogin();

  const getSettings = async () => {
    const res = await ServerHelper.post(ServerURL.settings, {});
    if (res.success) {
      setCookies("settings", res.settings, { path: "/" });
    }
  };

  document.title = (settings ? settings.app_name : "") + " HelpLIFO";
  useEffect(() => {
    getSettings();
  }, []);

  const viewerButton = isLoggedIn ? (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        Hello {viewer(Query.name)}
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem onClick={() => (window.location.href = "/profile")}>
          Change your name!
        </DropdownItem>
        <DropdownItem onClick={logout}>Logout</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  ) : (
    <NavItem>
      <NavLink onClick={()=>redirectToDopeAuth()}>Login with DopeAuth</NavLink>
    </NavItem>
  );
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">
          {settings ? settings.app_name : null}
        </NavbarBrand>
        <NavbarToggler onClick={() => setIsOpen(open => !open)} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink
                href={
                  settings
                    ? "mailto:" + settings.app_contact_email
                    : "mailto:help@hackmit.org"
                }
              >
                Contact Us
              </NavLink>
            </NavItem>
            {viewerButton}
          </Nav>
        </Collapse>
      </Navbar>
      <br />
    </div>
  );
};

export default AppHeader;
