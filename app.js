(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');
  
    function addImage(data) {
      let htmlContent = '';
      const firstImage = data.results[0];
      if (firstImage) {
          htmlContent = `<figure>
              <img src="${firstImage.urls.small}" alt="${searchedForText}">
              <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
          </figure>`;
      } else {
          htmlContent = 'Unfortunately, no image was returned for your search.'
      }
      responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }
  
    function addArticles (data) {
      let htmlContent = '';
      const copyright = data.copyright;
      const firstArticle = data.response.docs[0];
      if(data.response && data.response.docs && data.response.docs[0]) {
        htmlContent = `
        <table>
          <tr><td>
          <h1>${firstArticle.headline.main}</h1>
          <h3>${firstArticle.byline.original}</h3>
          <h4>${firstArticle.pub_date.substring(0,10)}</h4>
          ${firstArticle.snippet} ... 
          (<a href="${firstArticle.web_url}">Continue reading @ NYT</a>)
          <br>${copyright}<br>
          </td></tr>
          <tr><td>
          <h2>More Articles...</h2>` + '<ul>' + data.response.docs.map(
          article => `<li class="article">
            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
            <p>${article.snippet}</p></li>`).join('') + `</ul>
          </td></tr>
          </table>` ;
      } else {
        htmlContent = '<div class="error-no-image">No images available</div>'
      }
      responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }
    function requestError(e, part) {
          console.log(e);
          responseContainer.insertAdjacentHTML('beforeend', 
            `<p class="network-warning">Oh no! There was an error making a request 
            for the ${part}.</p>`);
    }
  
      form.addEventListener('submit', function (e) {
          e.preventDefault();
          responseContainer.innerHTML = '';
          searchedForText = searchField.value;
      
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
        headers: {
          Authorization: `Client-ID 2ded2e7e1b3ae07131a376b6a61e6dc7f7a99f2b141540cb5280b0fe8c1ad069`
        }
      }).then(response => response.json())
      .then(addImage)
      .catch(e => requestError(e, 'image'));
  
      fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=08b2cfd3ce3345d6aa1f46cf09559b0d`)
      .then(response => response.json())
      .then(addArticles)
      .catch(e => requestError(e, 'article'));
  
    });
})();
