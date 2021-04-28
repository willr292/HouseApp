import React from "react";
import { Layout } from "../../components/Layout";
import { Heading, Box } from "@chakra-ui/react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { withApollo } from "../../utils/withApollo";
import router from "next/router";
import { usePostQuery } from "../../generated/graphql";

const Post = ({}) => {
  const { data, error, loading } = usePostQuery({
    variables: {
      // TODO: skip: not uuid
      id: router.query.id as string,
    },
  });

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>{data.post.text}</Box>
      <EditDeletePostButtons
        id={data.post.id}
        creatorId={data.post.creator.id}
      />
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
