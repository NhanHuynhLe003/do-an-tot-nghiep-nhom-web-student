import { Breadcrumbs } from "@mui/material";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import style from "./IBreadcrumbs.module.css";
import clsx from "clsx";

/**
 * @typedef {Object} BreadcrumbItem
 * @property {number} id
 * @property {string} path
 * @property {string} name
 */

/**
 * @typedef {import('@mui/material').BreadcrumbsProps} BreadcrumbsProps
 */

/**
 * @param {BreadcrumbsProps & {listBreadcrumbs?: BreadcrumbItem[]}} props
 */
export default function IBreadcrumbs({
  listBreadcrumbs = [
    {
      id: 1,
      path: "/",
      name: "Home",
    },
    {
      id: 2,
      path: "/admin",
      name: "Admin",
    },
    {
      id: 3,
      path: "/admin/book-manage",
      name: "Quản lý sách",
    },
  ],
  ...props
}) {
  const location = useLocation();
  return (
    <Breadcrumbs aria-label="breadcrumb" {...props}>
      {listBreadcrumbs.map((item) => (
        <Link
          className={clsx(style.linkBreadcrumb, {
            [style.activeLink]: location.pathname === item.path,
          })}
          key={item.id}
          to={item.path}
        >
          {item.name}
        </Link>
      ))}
    </Breadcrumbs>
  );
}
