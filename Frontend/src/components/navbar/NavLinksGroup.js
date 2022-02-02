import styled from "styled-components";
import NavLink from "./NavLink";
import { breakpoints as bp } from "../navbar/GlobalStyle";

const LinksGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: ${(p) => Number(!p.compact)};
  padding: 24px 0 14px 0;
  margin-right: 2px;
  overflow: hidden;
  overflow-y: auto;
  background-color: rgba(var(--color-secondary-rgb), 0.1);
  transition: flex-grow 0.3s cubic-bezier(0.4, 0, 1, 1);
  ::-webkit-scrollbar {
    width: 4px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const DenseNavLinks = styled(NavLink)`
  && {
    box-shadow: none;
    min-height: 36px;
  }
`;

const links = [
  {
    to: "/Dashboard",
    icon: "fas fa-box",
    label: "Dashboard",
  },
  {
    to: "/ClientPage",
    icon: "fas fa-clipboard",
    label: "Clientes",
  },
  {
    to: "/EmployeePage",
    icon: "fas fa-redo-alt",
    label: "Empleados",
  },
  {
    to: "/MembershipPage",
    icon: "fas fa-redo-alt",
    label: "Membresias",
  },
  {
    to: "/ProductsPage",
    icon: "fas fa-redo-alt",
    label: "Products",
  },

  /* {
    to: "/ExitPage",
    icon: "fas fa-cog",
    label: "Cerrar Sesión",
  }, */
];

function NavLinksGroup(props) {
  return (
    <LinksGroup {...props}>
      {links.map((l) => (
        <DenseNavLinks
          compact={props.compact}
          key={l.to}
          to={l.to}
          iconClassName={l.icon}
          label={l.label}
        />
      ))}
    </LinksGroup>
  );
}

export default NavLinksGroup;
