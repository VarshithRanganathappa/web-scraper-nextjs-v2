import * as cheerio from 'cheerio';
import { axiosGet, getFullUrl, getHostname } from './helperFunctions';
const axios = require('axios');
const fs = require('fs'); 
import urlExist from "url-exist"

let visitedLink = [];
let linksQueue;

export async function singleSiteScrape(url, socket) {
  visitedLink = [];
  console.log("Hello World!,  scraping-started");
  socket.emit('scraping-started');
  const isValidUrl = await urlExist(url)
  if(!isValidUrl) return;
  const response = await axiosGet(url);
  if(response === null) return;
  const body = response.data;
  const $ = cheerio.load(body); 
  const allPTags = await getPTagsText({href: url});
  console.log(allPTags);
  socket.emit('p-tags', {link: url, data: allPTags});
  socket.emit('scraping-finished');
}


export async function fullSiteScrape(url, socket) {
  visitedLink = [];
  console.log("Hello World!,  scraping-started");
  socket.emit('scraping-started');
  const isValidUrl = await urlExist(url)
  if(!isValidUrl) {
    return ;
  }
  const response = await axiosGet(url);
  if(response === null) return;
  const body = response.data; 
  const $ = cheerio.load(body); // Load HTML data and initialize cheerio 
  linksQueue = getLinks($, url);
  if(linksQueue.length > 0) 
    await bfsVisit(url, linksQueue, socket);
  socket.emit('scraping-finished');
  // return links;
}

async function bfsVisit(url, linksQueue, socket) {

  while(linksQueue.length > 0) {
    if(!socket.connected) {
      console.log("Socket is disconnected");
      socket.emit('scraping-finished');
      let visitedLink = [];
      return;
    }
    if(visitedLink.length > 1400) {
      console.log("Limit reached");
      socket.emit('scraping-finished');
      let visitedLink = [];
      return;
    }
    const link = linksQueue.shift();
    console.log("In bfsVisit", link.href)
    if(!visitedLink.includes(link.href)) {
      visitedLink.push(link.href);
      console.log("Site is not visited previusly", link.href)
      socket.emit('scraping-a-site', link.href);
      console.log(link.href);

      const allPTags = await getPTagsText(link);
      console.log(allPTags);
      socket.emit('p-tags', {link: link.href, data: allPTags});

      const isValidUrl = await urlExist(link.href)
      if(!isValidUrl) 
        continue
      
      const response = await axiosGet(link.href);
      if(response === null) continue;
      const body = response.data; 
      const $ = cheerio.load(body); // Load HTML data and initialize cheerio 
      linksQueue = linksQueue.concat(getLinks($, url));
    }

  }
}

function getLinks($, url) {
  const links = $('a');
  const linksData = []

  // loop through all the anchors and get the text
  links.each((index, el) => {
    const data = {
      text: $(el).text(),
      href: getFullUrl(url, $(el).attr('href'))
    }
    if(data.href && data.href.length > 0)
      linksData.push(data);
  })
  console.log("links data in getLinks",linksData);
  return linksData;
}

// Get p tags and text from a page
async function getPTagsText(link) {
  const isValidUrl = await urlExist(link.href)
  if(!isValidUrl) return [];
  const response = await axiosGet(link.href);
  if(response === null) return;
  const body = response.data;
  const $ = cheerio.load(body); // Load HTML data and initialize cheerio

  const pTags = $('p');
  const pTagsTextList = []

  // loop through all the anchors and get the text
  pTags.each((index, el) => {
    const text = $(el).text();
    if(text.length > 60)
      pTagsTextList.push(text);
  })
  return pTagsTextList;
}






const getPokemons = ($) => { 
	// Get all list items from the unodered list with a class name of 'products' 
	const pokemons = $('.products li'); 
	const pokemonData = []; 
	// The 'each()' method loops over all pokemon list items 
	pokemons.each((index, el) => { 
		// Get the image, name, and price of each pokemon and create an object 
		const pokemon = {} 
 
		// Selector to get the image 'src' value of a pokemon 
		pokemon.img = $(el).find('a > img').attr('src'); 
		pokemon.name = $(el).find('h2').text(); // Selector to get the name of a pokemon 
		pokemon.price = $(el).find('.amount').text(); // Selector to get the price of a pokemon 
		pokemonData.push(pokemon) 
	}) 
 
	// Create a 'pokemon.json' file in the root directory with the scraped pokemonData 
	fs.writeFile("pokemon.json", JSON.stringify(pokemonData, null, 2), (err) => { 
		if (err) { 
			console.error(err); 
			return; 
		} 
		console.log("Data written to file successfully!"); 
	}); 
} 