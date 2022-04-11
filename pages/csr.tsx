import { gql, useQuery } from "@apollo/client";

interface Post {
  databaseId: number;
  title: string;
}

interface PostEdge {
  node: Post;
}

const POSTS_PER_PAGE = 10;

const GET_POSTS = gql`
  query getPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          databaseId
          title
          slug
        }
      }
    }
  }
`;

/**
 * Page CSR
 *
 * @return {JSX.Element} CSR page components
 */
const CSR = () => {
  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: {
      first: POSTS_PER_PAGE,
      after: null,
    },
  });
  const posts = data?.posts?.edges?.map((edge: PostEdge) => edge.node) || [];
  const havePosts = Boolean(posts.length);

  return (
    <>
      <h1>CSR Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>An error has occurred.</p>
      ) : !havePosts ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post: Post) => {
          return (
            <article
              key={post.databaseId}
              style={{
                border: `2px solid #eee`,
                padding: `1rem`,
                marginBottom: `1rem`,
                borderRadius: `10px`,
              }}
            >
              <h2>{post.title}</h2>
            </article>
          );
        })
      )}
    </>
  );
};
export default CSR;