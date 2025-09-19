import React from "react";
import { Typography } from "@mui/material";
import { Outlet } from "react-router";

function Layout() {
  return (
    <>
      <header className="bg-gray-900 text-white">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="flex items-center gap-2">
              <img
                src="https://imgs.search.brave.com/VLyYm6topnbcKnaXs0j9ACK6fOdgigw4uwOMy1RO-x8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbmcu/cG5ndHJlZS5jb20v/cG5nLXZlY3Rvci8y/MDIyMDkwMy9vdXJt/aWQvcG5ndHJlZS1y/b21hbnRpYy1tb3Zp/ZS1pY29uLXBuZy1p/bWFnZV82MTM0ODU4/LnBuZw"
                alt=""
                className="h-8 w-auto"
              />
              <span className="text-lg">Movies Gallery</span>
            </a>
          </div>

          <div className="flex flex-1 justify-end">
            <a href="#" className="text-sm font-semibold text-white">
              Home
            </a>
          </div>
        </nav>

      </header>

      <main className="max-w-7xl mx-auto p-6 lg:px-8">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
