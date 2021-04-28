import { useApolloClient } from "@apollo/client";
import { Flex, Link, Box, useColorModeValue, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { DarkModeSwitch } from "./DarkModeSwitch";

export const NavBar = () => {
  const router = useRouter();
  const bg = useColorModeValue("#38B2AC", "#1D4044");
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body = null;

  // data is loading
  if (loading || router.route == "/login" || router.route == "/register") {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={4}>
            create post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg={bg} p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link></Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
      <DarkModeSwitch />
    </Flex>
  );
};
