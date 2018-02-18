var validateLab2 = pipeline => {
  var aggregations = db.getSiblingDB("aggregations")
  if (!pipeline) {
    print("var pipeline isn't properly set up!")
  } else {
    try {
      var resultsExplain = aggregations.movies.aggregate(pipeline, {
        explain: true
      })
      var result = aggregations.movies.aggregate(pipeline).toArray().length
      var data = 0
      while (result != 1) {
        data++
        result = result % 2 === 0 ? result / 2 : result * 3 + 1
      }
      var { _id, title, rated } = resultsExplain.stages.pop()["$project"]
      return title && rated && !_id
        ? print("Answer is", data)
        : print("Your $project stage doesn't seem correct")
    } catch (e) {
      print(e.message)
    }
  }
}
