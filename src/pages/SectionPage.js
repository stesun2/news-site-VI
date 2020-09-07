import React, { Component } from 'react';
import ArticleList from '../components/ArticleList/ArticleList.js'
import { fetchArticlesBySection } from '../api/ArticlesAPI.js'

class SectionPage extends Component {
  state = {
    articles: []
  }

  fetchArticles = () => {
    fetchArticlesBySection(this.props.match.params.sectionID)
      .then((apiResponseJSON) => {
        this.setState({
          articles: apiResponseJSON
        });
      })
      .catch((e) => {
        console.error('error fetching articles: ', e);
      });
  }

  componentDidMount() {
    this.fetchArticles();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState === this.state) {
      this.fetchArticles();
    }
  }

  render() {
    return (
      <div>
        <ArticleList articles={this.state.articles} />
      </div>
    );
  }
}

export default SectionPage;

// Functional solution:
// function SectionPage(props) {
//   const [ articles, setArticles ] = React.useState([]);
//   const [ sectionID, setSectionID ] = React.useState(props.match.params.sectionID);

//   React.useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const apiResponseJSON = await fetchArticlesBySection(props.match.params.sectionID);
//         setArticles(apiResponseJSON);
//       } catch (e) {
//         console.error('error fetching articles: ', e);
//       };
//     };

//     if (!articles.length) { // when the component first mounts, fetch articles
//       fetchArticles();
//     }
//     else if (sectionID !== props.match.params.sectionID) { // when the sectionID changes, fetch articles
//       setSectionID(props.match.params.sectionID);
//       fetchArticles();
//     }
//   }, [articles, props.match.params.sectionID]);

//   return (
//     <div>
//       <ArticleList articles={articles} />
//     </div>
//   );
// }
