const HDWalletProvider = require("@truffle/hdwallet-provider");
const opensea = require("opensea-js")
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const Web3 = require("web3")
const MD5 = require("crypto-js/md5");
const { stringify } = require("querystring");
var accountAddress = ""
var alchemy = ""
var active = true
var decentraSerials = []


// ADD DOUBLE CLICK TO GO TWICE AS FAST WITH ARRAY TO NOT DO THEM TWICE
// NOTIFY WHEN MARGIN GETS CLAPPED
// AUTOMATION


//window.ethereum.enable()


async function main() {
    console.log("STARTED PISSMODE")
    let targetSerials = document.getElementById("serials").value.split(" ")
    if (document.getElementById("serials").value == "decentramode") {
        targetSerials = decentraSerials
    }
    console.log(targetSerials.length)
    const tokenAddress = document.getElementById("colltoken").value
    const offerAmount = parseFloat(document.getElementById("offeramount").value)
    const hours = parseInt(document.getElementById("expiry").value)

    const provider = new HDWalletProvider({
        privateKeys: [document.getElementById("pkey").value],
        providerOrUrl: alchemy
    });
    
    const seaport = new OpenSeaPort(provider, {
      networkName: Network.Main
    })
    for (let i = 0; i < targetSerials.length; i++) {
            try {
                const offer = await seaport.createBuyOrder({
                    asset: {
                        tokenAddress: tokenAddress, // CryptoKitties
                        tokenId: targetSerials[i], // Token ID
                    },
                    accountAddress,
                    // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
                    startAmount: offerAmount,
                    expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * hours)
                })
                console.log(i, offer)
            } catch(err) {
                console.log(err)
                continue
            }
    }
    console.log("run done")
}

window.onload = function(){
    document.getElementById("enter").addEventListener("click", function(){
        console.log(MD5(document.getElementById("password").value).toString())
        console.log("a66f0b0740385279d65d2c43a8dc06a9")
        console.log("08d73df56eabed0bb5dec9346fd8570b")

        if (MD5(document.getElementById("password").value).toString() == "a66f0b0740385279d65d2c43a8dc06a9") {
            accountAddress = "0x167d487990cf93813370aea88db435a5d3902fe2"
            alchemy = "https://eth-mainnet.alchemyapi.io/v2/98FU1uo1p9pfp6KV2iS8GEi3Ny4JD5zR"
            main()
        } else if (MD5(document.getElementById("password").value).toString() == "08d73df56eabed0bb5dec9346fd8570b") {
            accountAddress = "0xc5fdeF0fF84be777E045d2cB05359d3Fc66f9023"
            alchemy = "https://eth-mainnet.alchemyapi.io/v2/uWdYeNPjRbGTEzefSyCw6ay4qAS5OOJf"
            main()
        } else if (MD5(document.getElementById("password").value).toString() == "ee5bf3c471288eda453ff4dd65ccd10a") {
            accountAddress = "0xC2d714611B8d490aB21AF2E35cEdeAB10bb53fDd"
            alchemy = "https://eth-mainnet.alchemyapi.io/v2/uWdYeNPjRbGTEzefSyCw6ay4qAS5OOJf"
            main()
        } else {
            document.getElementById("resp").innerHTML = "Wrong passwrd retard"
        }
    })
    document.getElementById("fetch").addEventListener("click", function(){
        console.log("Sheesh you clicked")
        fetch("https://os-master.fruitbarrel.repl.co").then(function(response) {
            return response.json()
        }).then(function(data){
            console.log(data)
            const tokenAddress = document.getElementById("colltoken").value
            let collectionName = data["collections"][tokenAddress]["collection_name"]
            let collectionDescription = data["collections"][tokenAddress]["collection_description"]
            let floorPrice = data["collections"][tokenAddress]["floor_price"]
            let listingCount = data["collections"][tokenAddress]["listing_count"]
            let bidCount = data["collections"][tokenAddress]["bid_count"]
            let updatedAt = new Date(data["collections"][tokenAddress]["updated_at"]*1000)
            let listedSerialString = ""

            for (let key in data["collections"][tokenAddress]["listed_serials"]) {
                listedSerialString += key + " "
            }

            if (document.getElementById("floor_override").value != "") {
                console.log("FloorOverriden")
                floorPrice = parseFloat(document.getElementById("floor_override").value)
            }

            document.getElementById("serials").value = listedSerialString
            document.getElementById("collection_name").innerHTML = collectionName
            //document.getElementById("collection_description").innerHTML = collectionDescription
            document.getElementById("token_address").innerHTML = tokenAddress
            document.getElementById("floor_price").innerHTML = "Floor Price: " + floorPrice
            document.getElementById("listing_count").innerHTML = "Listing Count: " + listingCount
            document.getElementById("bid_count").innerHTML = "Bid Count: " + bidCount
            document.getElementById("updated_at").innerHTML = "Updated At: " + updatedAt

            let ratios = [0.05, 0.1, 0.15, 0.20, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0]
            for (let index in ratios) {
                console.log(ratios[index])
                let theoreticalBid = (floorPrice * ratios[index]).toFixed(4)
                let beatBidsCount = 0
                for (let key in data["collections"][tokenAddress]["bids"]) {
                    if (theoreticalBid > data["collections"][tokenAddress]["bids"][key]) {
                        beatBidsCount ++
                    }
                }

                document.getElementById(ratios[index]).innerHTML = `BB@${(ratios[index] * 100).toFixed(0)} (${theoreticalBid}): ${beatBidsCount}`
                /*
                const label = document.createElement("label")
                const node = document.createTextNode(`BB@${(ratios[index] * 100).toFixed(0)} (${theoreticalBid}): ${beatBidsCount}`)
                label.appendChild(node)
                label.setAttribute("id", ratios[index])
                const sr = document.getElementById("split right")
                sr.appendChild(label)
                sr.appendChild(br)
                */
            }

            // Display it
        }).catch(function(err) {
            console.log("Something errored lol but idk what it is")
            console.log("Nvm i found what it is", err)
        })

    })
    document.getElementById("decentramode").addEventListener("click", function(){
        fetch("https://decentraserials.fruitbarrel.repl.co").then(function(response){
            return response.json()
        }).then(function(data){
            console.log(data)
            decentraSerials = data
            document.getElementById("colltoken").value = "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d"
            document.getElementById("serials").value = "decentramode"
        }).catch(function(err){
            console.log("Something errored lol but idk what it is")
            console.log("Nvm i found what it is", err)
        })
    })
}
