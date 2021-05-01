import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { MultipleFileUploadField } from "../components/MultipleFileUploadField";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

// TODO: add map picker for location.
// TODO: Validation for form

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          title: "",
          text: "",
          latitude: 0,
          longitude: 0,
          files: [],
        }}
        onSubmit={async (values) => {
          const { errors } = await createPost({
            variables: {
              input: {
                title: values.title,
                text: values.title,
                latitude: values.latitude,
                longitude: values.longitude,
                // @ts-ignore
                photos: values.files.map((file) => file.url),
              },
            },
            update: (cache) => {
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField name="text" placeholder="text..." label="Body" />
            </Box>
            <Box mt={4}>
              <InputField
                name="latitude"
                type="number"
                placeholder="latitude"
                label="Lat"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="longitude"
                type="number"
                placeholder="longitude"
                label="Long"
              />
            </Box>
            <MultipleFileUploadField name="files" />

            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
