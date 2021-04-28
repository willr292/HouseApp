import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { Maybe, useVoteMutation, VoteMutation } from "../generated/graphql";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { ApolloCache, gql } from "@apollo/client";

// TODO: Double clicking on same arrow removes vote maybe?

interface UpvoteSectionProps {
  id: string;
  voteStatus: Maybe<number> | undefined;
  points: number;
}

const updateAfterVote = (
  value: number,
  postId: string,
  cache: ApolloCache<VoteMutation>,
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({
  id,
  voteStatus,
  points,
}) => {
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (voteStatus === 1) {
            return;
          }
          setLoadingState("upvote-loading");
          await vote({
            variables: {
              postId: id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, id, cache),
          });
          setLoadingState("not-loading");
        }}
        colorScheme={voteStatus === 1 ? "green" : undefined}
        isLoading={loadingState === "upvote-loading"}
        aria-label="upvote post"
        icon={<ChevronUpIcon />}
      />
      {points}
      <IconButton
        onClick={async () => {
          if (voteStatus === -1) {
            return;
          }
          setLoadingState("downvote-loading");
          await vote({
            variables: {
              postId: id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, id, cache),
          });
          setLoadingState("not-loading");
        }}
        colorScheme={voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downvote-loading"}
        aria-label="downvote post"
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};
