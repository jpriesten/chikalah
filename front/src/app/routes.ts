import { JobPostComponent } from "./job-post/job-post.component";
import { AuthGuard } from "./core/auth.guard";

import { HomeComponent } from "./home/home.component";
import { JoblistComponent } from "./joblist/joblist.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { FindBholomenComponent } from "./find-bholomen/find-bholomen.component";
import { PagenotfoundComponent } from "./pagenotfound/pagenotfound.component";

export const appRoutes = [
  // Paths that don't need authentication to get to
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: SignupComponent,
  },

  // Paths that need authentication to access
  {
    path: "job-post",
    children: [
      {
        path: "",
        component: JobPostComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "find-bholomen",
    children: [
      {
        path: "",
        component: FindBholomenComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "job-list",
    children: [
      {
        path: "",
        component: JoblistComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "**",
    component: PagenotfoundComponent,
  },
];
