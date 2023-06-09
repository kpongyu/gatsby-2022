/** @jsx jsx */
import { jsx } from "theme-ui";
import React, { useState } from "react";
import { Link, graphql } from "gatsby";
import { RiArrowRightLine, RiArrowLeftLine } from "react-icons/ri";
import Layout from "../components/layout";
import PostCard from "../components/post-card";
import Seo from "../components/seo";

const styles = {
  pagination: {
    a: {
      color: "muted",
      "&.is-active": {
        color: "text",
      },
      "&:hover": {
        color: "text",
      },
    },
  },
};

export const blogListQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { template: { eq: "blog-post" } } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            slug
            title
            featuredImage {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED, width: 345, height: 260)
              }
            }
          }
        }
      }
    }
  }
`;


const FilterButtons = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="filters-row">
      <button
        className={activeFilter === null ? "button active" : "button"}
        onClick={() => handleFilterChange(null)}
      >
        All Projects
      </button>
      <button
        className={activeFilter === "2023" ? "button active" : "button"}
        onClick={() => handleFilterChange("2023")}
      >
        Projects in 2023
      </button>
      <button
        className={activeFilter === "2022" ? "button active" : "button"}
        onClick={() => handleFilterChange("2022")}
      >
        Projects in 2022
      </button>
    </div>
  );
};





const Pagination = props => {
  const filteredPosts = props.posts;
  const hasPagination = filteredPosts.length > 0;

  if (hasPagination) {
    return (
      <div className="pagination" sx={styles.pagination}>
        <ul>
          {!props.isFirst && (
            <li>
              <Link to={props.prevPage} rel="prev">
                <span className="icon -left">
                  <RiArrowLeftLine />
                </span>{" "}
                Previous
              </Link>
            </li>
          )}
          {Array.from({ length: props.numPages }, (_, i) => (
            <li key={`pagination-number${i + 1}`}>
              <Link
                to={`${props.blogSlug}${i === 0 ? "" : i + 1}`}
                className={props.currentPage === i + 1 ? "is-active num" : "num"}
              >
                {i + 1}
              </Link>
            </li>
          ))}
          {!props.isLast && (
            <li>
              <Link to={props.nextPage} rel="next">
                Next{" "}
                <span className="icon -right">
                  <RiArrowRightLine />
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    );
  } else {
    return null;
  }
};

class BlogIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: null
    };
  }

  handleFilterChange = (filter) => {
    this.setState({ filter });
  }

  render() {
    const { data } = this.props;
    const { currentPage, numPages } = this.props.pageContext;
    const blogSlug = "/blog/";
    const isFirst = currentPage === 1;
    const isLast = currentPage === numPages;
    const prevPage = currentPage - 1 === 1 ? blogSlug : blogSlug + (currentPage - 1).toString();
    const nextPage = blogSlug + (currentPage + 1).toString();

    const allPosts = data.allMarkdownRemark.edges;
    const filteredPosts = allPosts
      .filter(edge => !!edge.node.frontmatter.date)
      .filter(edge => this.state.filter ? edge.node.frontmatter.date.includes(this.state.filter.toString()) : true);

    const posts = filteredPosts.map(edge => <PostCard key={edge.node.id} data={edge.node} />);

    let props = {
      isFirst,
      prevPage,
      numPages,
      blogSlug,
      currentPage,
      isLast,
      nextPage,
      posts,
    };

    return (
      <Layout className="blog-page">
        <Seo
          title={"Blog — Page " + currentPage + " of " + numPages}
          description={"Stackrole base blog page " + currentPage + " of " + numPages}
        />
        <h1>Projects</h1>
        <FilterButtons onFilterChange={this.handleFilterChange} />
        <div className="grids col-1 sm-2 lg-3">{posts}</div>
        <Pagination {...props} />
      </Layout>
    );
  }
}

export default BlogIndex;
