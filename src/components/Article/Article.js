import React, { Component } from 'react';
import { Media } from 'reactstrap';
import "./article.css";

class Article extends Component {
  render() {
    const { title, created_date: createdDate, abstract, byline, image } = this.props;
    return (
      <Media>
        <Media left>
          { image && <img className="image" src={ image }/> }
        </Media>
        <Media body className="body">
          <Media heading>{ title }</Media>
          <p>{ createdDate }</p>
          { byline && <p>{ byline }</p> }
          <p>{ abstract }</p>
        </Media>
      </Media>
    )
  }
}

export default Article;


// Functional solution:
// function Article({ title, created_date: createdDate, abstract, byline, image }) {
//   return (
//     <Media>
//        <Media left>
//          {image && <img src={image} />}
//        </Media>
//        <Media body>
//          <Media heading>{title}</Media>
//          <p>{createdDate}</p>
//          {byline && <h2>{byline}</h2>}
//          <p>{abstract}</p>
//        </Media>
//      </Media >
//   );
// }
