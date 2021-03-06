const expect = require('chai').expect
const QueryParser = require( '../src/query-parser' )
const queryParser = new QueryParser({ log: () => {} })

function getFilter( queryJson ) {
  var searchString = 'search?' + JSON.stringify( queryJson)
  var query = queryParser.createQuery( queryParser.parseInput( searchString ) )
  return query.filter.toString()
}

describe( 'the provider creates the correct filter for each query', () => {

  it( 'creates the right filter for a query with one condition', () => {
    var filterString = getFilter({
      table: 'someTable',
      query: [[ 'title', 'eq', 'Don Quixote' ] ]
    })
    expect( filterString ).to.equal( 'r.row("title").eq("Don Quixote")' )
  })

  it( 'creates the right filter for a query with multiple conditions', () => {
    var filterString = getFilter({
      table: 'someTable',
      query: [
        [ 'title', 'eq', 'Don Quixote' ],
        [ 'released', 'gt', 1700 ],
        [ 'author', 'match', '.*eg' ]
      ]
    })

    expect( filterString ).to.equal(
      'r.row("title").eq("Don Quixote").and(r.row("released").gt(1700)).and(r.row("author").match(".*eg"))'
    )
  })
})