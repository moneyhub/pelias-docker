#!/usr/bin/env node
const yargs = require("yargs/yargs")
const {hideBin} = require("yargs/helpers")
const argv = yargs(hideBin(process.argv)).argv
const csv = require("csv-parser")
const fs = require("fs")
const {Parser} = require("json2csv")

const {getEnrichTransactionsWithGeolocations} = require("../src")

const mean = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length

if (!argv.inputTxsLocation ||
    !argv.outputTxsLocation) {
  console.log("All of the following must be provided:")
  console.log(" --inputTxsLocation, --outputTxsLocation")
  process.exit(1)
}

const LOCAL_PELIAS_SOCKET = "http://localhost:4000"

const SEARCH_CONCURRENCY = argv.searchConcurrency || 5
const TRANSACTION_CONCURRENCY = argv.transactionConcurrency || 50

const generatePostcodeStats = (txs, txLabel) => {
  const txLabelLower = txLabel.toLowerCase()
  const totalNumberOfRows = txs.length
  const numberOfResultsReturned = txs.filter((tx) => tx.resultsReturned).length

  console.log(`------- ${txLabel} transactions (${totalNumberOfRows} rows) postcode results ---------`)

  console.log(`Number of ${txLabelLower} txs: ${totalNumberOfRows}`)
  console.log(`Number of ${txLabelLower} txs with results returned: ${txs.filter((tx) => tx.resultsReturned).length}`)

  const numberOfTxsWithPostcode = txs.filter(tx => tx.postcode).length
  const txsWithEstimatedPostcode = txs.filter(tx => tx.postcodeIsEstimated)
  const numberOfTxsWithEstimatedPostcode = txsWithEstimatedPostcode.length
  const numberOfTxsWithDirectPostcode = numberOfTxsWithPostcode - numberOfTxsWithEstimatedPostcode

  console.log(`Number of ${txLabelLower} txs with direct postcode: ${numberOfTxsWithDirectPostcode}`)
  console.log(`Number of ${txLabelLower} txs with estimated postcode: ${numberOfTxsWithEstimatedPostcode}`)

  console.log(`Number of ${txLabelLower} txs with postcode (direct and estimated): ${numberOfTxsWithPostcode}`)
  console.log(`Postcode coverage in ${txLabelLower} txs with results: ${((numberOfTxsWithDirectPostcode / numberOfResultsReturned) * 100).toPrecision(3)}%`)
  console.log(`Postcode coverage in ${txLabelLower} txs with results relaxed: ${((numberOfTxsWithPostcode / numberOfResultsReturned) * 100).toPrecision(3)}%`)

  const estimatedPostcodeDistances = txsWithEstimatedPostcode.map(tx => tx.estimatedPostcodeDistance)
  console.log(`Mean estimated postcode distance: ${mean(estimatedPostcodeDistances).toPrecision(3)}km`)
  console.log(`Max estimated postcode distance: ${Math.max(...estimatedPostcodeDistances).toPrecision(3)}km`)
  console.log(`Min estimated postcode distance: ${Math.min(...estimatedPostcodeDistances).toPrecision(3)}km`)
}


const run = async () => {
  const enrichTransactionsWithGeolocations = getEnrichTransactionsWithGeolocations(LOCAL_PELIAS_SOCKET, SEARCH_CONCURRENCY, TRANSACTION_CONCURRENCY)

  let start = true
  const transactions = []

  fs.createReadStream(argv.inputTxsLocation)
    .pipe(csv())
    .on("data", function(transaction) {
      transactions.push(transaction)
    })
    .on("end", async function() {
      const json2csvParser = new Parser({header: start})

      console.log("Starting geolocation enrichment of transactions")

      console.profile("Enrich transactions")
      console.time("Enrich transactions")
      const enrichedTransactions = await enrichTransactionsWithGeolocations(transactions)
      console.timeEnd("Enrich transactions")
      console.profileEnd("Enrich transactions")

      const enrichedTransactionWithUpdatedCorrectOsmRef = enrichedTransactions.map(tx => {
        const correctOsmRef = tx.correctOsmRef === "node/492098581"
          ? "node/502587755"
          : tx.correctOsmRef

        return {
          ...tx,
          correctOsmRef,
        }
      })

      const enrichedTransactionsWithAdditionalResultInfo = enrichedTransactionWithUpdatedCorrectOsmRef.map(tx => {
        const hasHadResultsReturned = tx => !!(tx.geoTags && tx.geoTags.length > 0)

        const isCorrectResultTop =  (tx) => {
          if (!tx.geoTags || tx.geoTags.length === 0 || !tx.correctOsmRef) {
            return false
          }
          return tx.geoTags[0].gid.includes(tx.correctOsmRef)
        }

        const isCorrectResultReturned = (tx) => {
          if (!tx.geoTags || tx.geoTags.length === 0 || !tx.correctOsmRef) {
            return false
          }
          for (const geoTag of tx.geoTags) {
            if (geoTag.gid.includes(tx.correctOsmRef)) {
              return true
            }
          }
          return false
        }

        const getPostcode = (tx) => tx.geoTags && tx.geoTags.length > 0 ? tx.geoTags[0].postcode : null

        const hasEstimatedPostcode = (tx) => {
          if (!tx.geoTags || tx.geoTags.length === 0) {
            return false
          }
          if (tx.geoTags[0].postcodeIsEstimated) {
            return true
          }
          return false
        }

        const getEstimatedPostcodeDistance = (tx) => {
          if (!tx.geoTags || tx.geoTags.length === 0) {
            return null
          }
          return tx.geoTags[0].estimatedPostcodeDistanceFromResultKm
        }

        return {
          ...tx,
          resultsReturned: hasHadResultsReturned(tx),
          correctResultTop: isCorrectResultTop(tx),
          correctResultReturned: isCorrectResultReturned(tx),
          postcode: getPostcode(tx),
          postcodeIsEstimated: hasEstimatedPostcode(tx),
          estimatedPostcodeDistance: getEstimatedPostcodeDistance(tx),
        }
      })

      const txsWithCorrectLatLogProvided = enrichedTransactionsWithAdditionalResultInfo.filter(tx => tx.correctLatLong)

      const txsForStats = txsWithCorrectLatLogProvided

      const totalLabelledRows = txsForStats.length
      const numberOfLabelledResultsReturned = txsForStats.filter((tx) => tx.resultsReturned).length
      const numberOfLabelledCorrectResults = txsForStats.filter((tx) => tx.correctResultTop).length
      const numberOfLabelledRelaxedCorrectResults = txsForStats.filter((tx) => tx.correctResultReturned).length

      console.log(`------- STATS for ${totalLabelledRows} rows ---------`)
      console.log("Coverage: ", ((numberOfLabelledResultsReturned / totalLabelledRows) * 100).toPrecision(2), "%")
      console.log("Precision: ", ((numberOfLabelledCorrectResults / numberOfLabelledResultsReturned) * 100).toPrecision(2), "%")
      console.log("Precision relaxed: ", ((numberOfLabelledRelaxedCorrectResults / numberOfLabelledResultsReturned) * 100).toPrecision(2), "%")
      console.log("Accuracy: ", ((numberOfLabelledCorrectResults / totalLabelledRows) * 100).toPrecision(2), "%")
      console.log("Accuracy relaxed: ", ((numberOfLabelledRelaxedCorrectResults / totalLabelledRows) * 100).toPrecision(2), "%")

      generatePostcodeStats(txsForStats, "Labelled")
      generatePostcodeStats(enrichedTransactionsWithAdditionalResultInfo, "All")

      console.log("------- END STATS ---------")

      console.log("Transaction enriched with geolocation info - saving results")

      if (start === true) {
        start = false
      }

      const csv = json2csvParser.parse(enrichedTransactionsWithAdditionalResultInfo) + "\n"

      fs.writeFileSync(argv.outputTxsLocation, csv, function (err) {
        if (err) {
          throw err
        }
      })

      console.log("Transaction enriched with geolocation info - results saved")
      console.log("Transaction geolocation enrichment complete. Exiting.")
    })
}

run().catch(err => {
  console.log(err)
  process.exit(1)
})
