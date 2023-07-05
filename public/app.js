window.google.maps.importLibrary("maps").then(() => {  
  const search = instantsearch({
    indexName: 'data',
    searchClient: instantMeiliSearch(
      'http://localhost:7700',
      '7dbf47219adeebf6f3aad5f97ef244f42bf6a73ea4dab7246ee42b8436443f21'
    ),
  });
  
  search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '#searchbox',
    }),
    instantsearch.widgets.geoSearch({
      container: '#maps',
      googleReference: window.google,
    }),
    // instantsearch.widgets.hits({
    //   container: '#hits',
    //   templates: {
    //     item: `
    //       <div>
    //         <div class="hit-name">
    //           {{#helpers.highlight}}{ "attribute": "nom" }{{/helpers.highlight}}
    //         </div>
    //       </div>
    //     `,
    //   },
    // }),
  ])
  
  search.start()
});
