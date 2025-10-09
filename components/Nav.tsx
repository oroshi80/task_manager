"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  // NavbarMenuItem,
  // Link,
  // Button,
} from "@heroui/react";
import { BsKanban } from "react-icons/bs";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <BsKanban size={36} />
          <p className="font-bold text-inherit ml-6">Task Manager</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {/* <Link href="#">Login</Link> */}
        </NavbarItem>
        <NavbarItem>
          <div className="flex gap-2">
            {/* <Button as={Link} color="primary" href="#" variant="flat">
              Sign Up
            </Button> */}
            <ThemeSwitcher />
          </div>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu></NavbarMenu>
    </Navbar>
  );
}
