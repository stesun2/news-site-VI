import React, { Component } from 'react';
import ArticleList from '../components/ArticleList/ArticleList.js'
import { fetchArticles, searchArticles } from '../api/ArticlesAPI';
import { InputGroup, Input } from 'reactstrap';

class HomePage extends Component {
  state = {
    articles: []
  };

  async componentDidMount() {
    try {
      const articlesJson = await fetchArticles();
      this.setState({ articles: articlesJson });
    } catch (e) {
      console.error('error fetching articles: ', e);
    }
  }

  async handleSearch(event) {
    const textToSearchFor = event.target.value;
    try {
      let articlesJson;
      if (!textToSearchFor) {
        articlesJson = await fetchArticles();
      } else {
        articlesJson = await searchArticles(textToSearchFor);
      }
      this.setState({ articles: articlesJson });
    } catch (e) {
      console.error('error searching articles: ', e);
    }
  }

  render() {
    return (
      <div>
        <InputGroup>
          <Input onChange={(e) => this.handleSearch(e)} type="text" placeholder="Search" />
        </InputGroup>
        <ArticleList articles={this.state.articles} />
      </div>
    );
  }
}

export default HomePage;


// Functional solution:
// function HomePage(props) {
//   const [ articles, setArticles ] = React.useState([]);
//   const [ searchText, setSearchText ] = React.useState('');

//   React.useEffect(() => {
//     const fetchArticlesAsync = async () => {
//       try {
//         let articlesJson;
//         if (!searchText) {
//           articlesJson = await fetchArticles();
//         } else {
//           articlesJson = await searchArticles(searchText);
//         }
//         setArticles(articlesJson);
//       } catch (e) {
//         console.error('error fetching articles: ', e);
//       }
//     };

//     if (!articles.length || searchText) {
//       fetchArticlesAsync();
//     }
//   }, [articles, searchText]);

//   const handleSearch = (e) => setSearchText(e.target.value);

//   return (
//     <div>
//       <InputGroup>
//         <Input onChange={handleSearch} type="text" placeholder="Search" />
//       </InputGroup>
//       <ArticleList articles={articles} />
//     </div>
//   );
// }
