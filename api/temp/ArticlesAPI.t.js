import ArticlesAPI from './ArticlesAPI';
import fetchMock from 'fetch-mock';
require('isomorphic-fetch');

afterEach(() => {
  fetchMock.restore();
})

it('calls ArticlesAPI.fetchArticleByID(1)', (done) => {
  fetchMock.get('http://localhost:3001/api/articles/1', {success: true});
  return ArticlesAPI.fetchArticleByID(1)
    .then((json) => {
      expect(json.ok).toEqual(true);
      done();
    })
    .catch((err) => {
      throw new Error('Call failed');
    });;
});

it('calls ArticlesAPI.fetchArticles()', (done) => {
  fetchMock.get('http://localhost:3001/api/articles', {success: true});
  return ArticlesAPI.fetchArticles()
    .then((json) => {
      expect(json.ok).toEqual(true);
      done();
    })
    .catch((err) => {
      throw new Error('Call failed');
    });;
});

it('calls ArticlesAPI.fetchArticlesBySection(\'opinion\')', (done) => {
  fetchMock.get('http://localhost:3001/api/articles?filter={"where":{"section":"opinion"}}', {success: true});
  return ArticlesAPI.fetchArticlesBySection('opinion')
    .then((json) => {
      expect(json.ok).toEqual(true);
      done();
    })
    .catch((err) => {
      throw new Error('Call failed');
    });
});

it('submits an article by calling ArticlesAPI.addArticle()', (done) => {
  const request = fetchMock.post('http://localhost:3001/api/articles', {success: true});
  const articleObject = {title: 'test', byline: 'title', abstract: 'adsf'};
  return ArticlesAPI.addArticle(articleObject)
    .then((json) => {
      const requestBody = request._calls[0][1].body;
      expect(requestBody).toEqual(JSON.stringify(articleObject));
      expect(json.ok).toEqual(true);
      done();
    })
    .catch((err) => {
      throw new Error('Call failed');
    });
});
