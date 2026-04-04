"use client";

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
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

type NavigationItem = {
  title: string;
  href: string;
  /** If to display the link as the app logo. */
  logo?: boolean;
}[];

const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
  const { data: session, isPending, isRefetching } = authClient.useSession();

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
          {/* <Button variant="ghost" size="icon">
            <SearchIcon />
            <span className="sr-only">Search</span>
          </Button> */}
          {session && (
            <Link href="/profile">
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt={session.user.name}
                />
                <AvatarFallback>
                  {isPending || isRefetching ? (
                    <Spinner />
                  ) : (
                    session.user.name.at(0)
                  )}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          <Link href="/profile">
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src="/profile.jpg" alt="Profile" />
              <AvatarFallback>NB</AvatarFallback>
            </Avatar>
          </Link>
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
