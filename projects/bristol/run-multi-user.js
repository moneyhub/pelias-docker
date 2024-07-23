#!/usr/bin/env node
const yargs = require("yargs/yargs")
const {hideBin} = require("yargs/helpers")
const argv = yargs(hideBin(process.argv)).argv
const Papa = require("papaparse")
const fs = require("fs")
const readline = require("readline")
const {Parser} = require("json2csv")

const {getEnrichTransactionsWithGeolocations} = require("../src")

if (!argv.inputTxsLocation || !argv.outputTxsLocation) {
  console.log("All of the following must be provided:")
  console.log(" --inputTxsLocation, --outputTxsLocation")
  console.log("The input file MUST have contiguous blocks for each user, i.e. sort by user ID")
  process.exit(1)
}

const LOCAL_PELIAS_SOCKET = "http://localhost:4000"

const MAX_CONCURRENT_USERS = argv.maxConcurrentUsers || 4
const SEARCH_CONCURRENCY = argv.searchConcurrency || 1
const TRANSACTION_CONCURRENCY = argv.transactionConcurrency || 200

const geotagUserTxs = enrichTransactionsWithGeolocations => async (txs, firstRows) => {
  const enrichedTransactions = await enrichTransactionsWithGeolocations(txs)
  for (const transaction of enrichedTransactions) {
    delete transaction.searchTerm
    for (const geotag of transaction.geoTags) {
      delete geotag.distance
      delete geotag.gid
      delete geotag.localitySearch
      delete geotag.regionSearch
      delete geotag.descriptionScore
    }
  }
  const json2csvParser = new Parser({header: firstRows})
  const csv = json2csvParser.parse(enrichedTransactions) + "\n"
  fs.appendFileSync(argv.outputTxsLocation, csv)
}

const respectMaxConcurrentUsers = async (activePromises) => {
  if (activePromises.length >= MAX_CONCURRENT_USERS) {
    await Promise.race(activePromises)
    activePromises = activePromises.filter(p => p.status === "pending")
  }
  return activePromises
}

const run = async () => {
  const enrichTransactionsWithGeolocations = getEnrichTransactionsWithGeolocations(
    LOCAL_PELIAS_SOCKET, SEARCH_CONCURRENCY, TRANSACTION_CONCURRENCY)
  const geoTagger = geotagUserTxs(enrichTransactionsWithGeolocations)

  let headers = []
  let readingHeaderLine = true
  let transactions = []
  let writingFirstRows = true
  let userId = null

  const fileStream = fs.createReadStream(argv.inputTxsLocation)

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  let activePromises = []

  for await (const line of rl) {
    const parsed = Papa.parse(line, { header: false }).data[0]
    if (readingHeaderLine) {
      headers = parsed
      readingHeaderLine = false
    } else {
      if (parsed) {
        const transaction = {}
        headers.forEach((header, index) => {
          transaction[header] = parsed[index]
        })
        if (!userId) userId = transaction.userId
        if (userId !== transaction.userId) {
          activePromises = await respectMaxConcurrentUsers(activePromises)
          console.log(`Processing user ${userId}`)
          const geoTaggerPromise = geoTagger(transactions, writingFirstRows)
          if (writingFirstRows) {
            await geoTaggerPromise
          } else {
            activePromises.push(geoTaggerPromise)
          }
          writingFirstRows = false
          transactions = []
          userId = transaction.userId
        }
        transactions.push(transaction)
      }
    }
  }

  if (transactions.length) {
    activePromises = await respectMaxConcurrentUsers(activePromises)
    const geoTaggerPromise = geoTagger(transactions, writingFirstRows)
    activePromises.push(geoTaggerPromise)
  }

  await Promise.all(activePromises)

  console.log("Geotagging finished")
}

run().catch(err => {
  console.log(err)
  process.exit(1)
})
