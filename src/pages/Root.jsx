import { Container } from "@mui/system";
import React from "react";
import { Header } from "../components";
import { Outlet } from "react-router-dom";

export function Root() {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </>
  );
}
