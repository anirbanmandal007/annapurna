import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

var misc: any = {
  sidebar_mini_active: true
};

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}
export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}
//Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboards",
    title: "Dashboards",
    type: "sub",
    icontype: "ni-shop text-primary",
    isCollapsed: true,
    children: [
      { path: "dashboard", title: "Dashboard", type: "link" },
      { path: "alternative", title: "Alternative", type: "link" }
    ]
  },
  {
    path: "/usermanagement",
    title: "User Management",
    type: "sub",
    icontype: "fa fa-users text-orange",
    isCollapsed: true,
    children: [
      { path: "users", title: "Users", type: "link" },
      { path: "roles", title: "Roles", type: "link" }
    ]
  },
  {
    path: "/master",
    title: "Masters",
    type: "sub",
    icontype: "fa fa-certificate text-danger",
    isCollapsed: true,
    children: [
      { path: "department", title: "Department", type: "link" },
      { path: "template", title: "Template", type: "link" },
      { path: "document-type", title: "Document Type", type: "link" },
      { path: "document-type-mapping", title: "Document Type Mapping", type: "link" },
      { path: "branch", title: "Branch", type: "link" },
      { path: "branch-mapping", title: "Branch Mapping", type: "link" },
      { path: "view-custom-form", title: "View Custom Form", type: "link" }
    ]
  },
  {
    path: "/process",
    title: "Process",
    type: "sub",
    icontype: "fa fa-database text-pink",
    isCollapsed: true,
    children: [
      { path: "data-entry", title: "Data Entry", type: "link" },
      { path: "tagging", title: "Tagging", type: "link" },
    ]
  },
  {
    path: "/search",
    title: "Search",
    type: "sub",
    icontype: "fa fa-search text-green",
    isCollapsed: true,
    children: [
      { path: "advance-search", title: "Advance Search", type: "link" },
      { path: "content-search", title: "Content Search", type: "link" },
      { path: "file-storage", title: "File Storage", type: "link" },
    ]
  },
  {
    path: "/report",
    title: "Reports",
    type: "sub",
    icontype: "fa fa-book text-default",
    isCollapsed: true,
    children: [
      { path: "meta-data", title: "Meta Data", type: "link" },
      { path: "status", title: "Status", type: "link" },
      { path: "log", title: "Logs", type: "link" },
    ]
  },
  {
    path: "/examples",
    title: "Examples",
    type: "sub",
    icontype: "ni-ungroup text-orange",
    collapse: "examples",
    isCollapsed: true,
    children: [
      { path: "pricing", title: "Pricing", type: "link" },
      { path: "login", title: "Login", type: "link" },
      { path: "register", title: "Register", type: "link" },
      { path: "lock", title: "Lock", type: "link" },
      { path: "timeline", title: "Timeline", type: "link" },
      { path: "profile", title: "Profile", type: "link" }
    ]
  },
  {
    path: "/components",
    title: "Components",
    type: "sub",
    icontype: "ni-ui-04 text-info",
    collapse: "components",
    isCollapsed: true,
    children: [
      { path: "buttons", title: "Buttons", type: "link" },
      { path: "cards", title: "Cards", type: "link" },
      { path: "grid", title: "Grid", type: "link" },
      { path: "notifications", title: "Notifications", type: "link" },
      { path: "icons", title: "Icons", type: "link" },
      { path: "typography", title: "Typography", type: "link" },
      {
        path: "multilevel",
        isCollapsed: true,
        title: "Multilevel",
        type: "sub",
        collapse: "multilevel",
        children: [
          { title: "Third level menu" },
          { title: "Just another link" },
          { title: "One last link" }
        ]
      }
    ]
  },
  {
    path: "/forms",
    title: "Forms",
    type: "sub",
    icontype: "ni-single-copy-04 text-pink",
    collapse: "forms",
    isCollapsed: true,
    children: [
      { path: "elements", title: "Elements", type: "link" },
      { path: "components", title: "Components", type: "link" },
      { path: "validation", title: "Validation", type: "link" }
    ]
  },
  {
    path: "/tables",
    title: "Tables",
    type: "sub",
    icontype: "ni-align-left-2 text-default",
    collapse: "tables",
    isCollapsed: true,
    children: [
      { path: "tables", title: "Tables", type: "link" },
      { path: "sortable", title: "Sortable", type: "link" },
      { path: "ngx-datatable", title: "Ngx Datatable", type: "link" }
    ]
  },
  {
    path: "/maps",
    title: "Maps",
    type: "sub",
    icontype: "ni-map-big text-primary",
    collapse: "maps",
    isCollapsed: true,
    children: [
      { path: "google", title: "Google Maps", type: "link" },
      { path: "vector", title: "Vector Map", type: "link" }
    ]
  },
  {
    path: "/widgets",
    title: "Widgets",
    type: "link",
    icontype: "ni-archive-2 text-green"
  },
  {
    path: "/charts",
    title: "Charts",
    type: "link",
    icontype: "ni-chart-pie-35 text-info"
  },
  {
    path: "/calendar",
    title: "Calendar",
    type: "link",
    icontype: "ni-calendar-grid-58 text-red"
  }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }
  onMouseEnterSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  }
  onMouseLeaveSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  }
  minimizeSidebar() {
    const sidenavToggler = document.getElementsByClassName(
      "sidenav-toggler"
    )[0];
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("g-sidenav-pinned")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("g-sidenav-pinned");
      body.classList.add("g-sidenav-hidden");
      sidenavToggler.classList.remove("active");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("g-sidenav-pinned");
      body.classList.remove("g-sidenav-hidden");
      sidenavToggler.classList.add("active");
      misc.sidebar_mini_active = true;
    }
  }
}
