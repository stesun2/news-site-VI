import {
  fetchArticleByID,
  fetchArticles,
  fetchArticlesBySection,
  addArticle,
} from './ArticlesAPI';
import fetchMock from 'fetch-mock';
require('isomorphic-fetch');

afterEach(() => {
  fetchMock.restore();
})

it('calls fetchArticleByID(1)', (done) => {
  fetchMock.get('http://localhost:3001/api/articles/1', {success: true});
  return fetchArticleByID(1)
    .then((json) => {
      expect(json.success).toEqual(true);
      done();
    })
    .catch((err) => {
      throw new Error('Call failed');
    });;
});

it('calls fetchArticles()', (done) => {
  fetchMock.get('http://localhost:3001/api/articles', {success: true});
  return fetchArticles()
    .then((json) => {
      expect(json.success).toEqual(true);
      done();
    })
    .catch((err) => {
      throw new Error('Call failed');
    });;
});

it('calls fetchArticlesBySection(\'opinion\')', (done) => {
  fetchMock.get('http://localhost:3001/api/articles?filter={"where":{"section":"opinion"}}', {success: true});
  return fetchArticlesBySection('opinion')
    .then((json) => {
      expect(json.success).toEqual(true);
      done();
    })
    .catch((err) => {
      throw new Error('Call failed');
    });
});

it('submits an article by calling addArticle()', (done) => {
  const request = fetchMock.post('http://localhost:3001/api/articles', {success: true});
  const articleObject = {title: 'test', byline: 'title', abstract: 'adsf'};
  return addArticle(articleObject, 'token')
    .then((json) => {
      const requestBody = request._calls[0][1].body;
      const headers = request._calls[0][1].headers;
      expect(headers.Authorization).toEqual('token');
      expect(requestBody).toEqual(JSON.stringify(articleObject));
      expect(json.ok).toEqual(true);
      done();
    })
    .catch((err) => {
      throw new Error('Call failed');
    });
});
