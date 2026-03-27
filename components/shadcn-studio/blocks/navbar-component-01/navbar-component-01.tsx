import { BellIcon, MenuIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/shadcn-studio/logo";
import Link from "next/link";

type NavigationItem = {
  title: string;
  href: string;
  /** If to display the link as the app logo. */
  logo?: boolean;
}[];

const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-links">
          {navigationData.map((item, index) =>
            item.logo ? (
              <Link key={index} href={item.href}>
                <Logo className="navbar-logo" />
              </Link>
            ) : (
              <Link key={index} href={item.href} className="navbar-link">
                {item.title}
              </Link>
            ),
          )}
        </div>

        <div className="navbar-actions">
          <Link href="/notifications">
            <Button variant="ghost" size="icon">
              <BellIcon />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <SearchIcon />
            <span className="sr-only">Search</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {navigationData.map((item, index) =>
                  !item.logo ? (
                    <DropdownMenuItem key={index}>
                      <Link href={item.href}>{item.title}</Link>
                    </DropdownMenuItem>
                  ) : null,
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
