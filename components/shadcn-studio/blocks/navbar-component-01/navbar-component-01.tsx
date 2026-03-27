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
}[];

const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-links">
          <Link href="/chart" className="navbar-link">
            Chart
          </Link>
          <Link href="/ratings" className="navbar-link">
            Ratings
          </Link>
          <Link href="/">
            <Logo className="navbar-logo" />
          </Link>
          <Link href="/friends" className="navbar-link">
            Friends
          </Link>
          <Link href="/settings" className="navbar-link">
            Settings
          </Link>
          <Link href="/login" className="navbar-link">
            Login
          </Link>
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
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <Link href={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
