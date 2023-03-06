import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import { CMS_NAME, FADE_DOWN_ANIMATION_VARIANTS } from '../lib/constants'
import Post from '../interfaces/post'
import { useEffect, useState } from 'react'
import urlExist from "url-exist"
import { io } from "socket.io-client";
import { motion } from 'framer-motion'
import Link from 'next/link';
// import styles from '../styles/index.css';
import ScrappedSite from '../components/scrappedSite'
import { MagnifyingGlass } from 'react-loader-spinner'

type Props = {
  allPosts: Post[]
}
let socket: any;

export default function Index() {
  const [enteredUrl, setUrl] = useState('');
  const [enteredUrlForSingleScrap, setUrlForSingleScrap] = useState('');
  const [pTags, setPTags] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [scrapingStarted, setScrapingStarted] = useState(false);

  useEffect(() => {
    socketInitializer();
  }, []);

  useEffect(() => {
    async function sleep() {
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
    sleep().then(() => {
      setRefresh(!refresh);
    });
    console.log("reloaded")
  }, [refresh])

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();
    socket.on('connect', () => {
      console.log('connected')
    })
    socket.on('scraping-a-site', (url: any) => {
      console.log("scrapping started ", url)
    })
    socket.on('scraping-started', () => {
      setScrapingStarted(true);
    })
    socket.on('scraping-finished', () => {
      setScrapingStarted(false);
    })
    socket.on('disconnect', () => {
      console.log('disconnected')
      setScrapingStarted(false);
    })
    socket.on('p-tags', (msg: any) => {
      console.log("Incoming sentences from socket", msg)
      const newPtags = pTags;
      if (msg.data.length > 0) {
        newPtags.push(msg);
        setPTags(newPtags);
        setRefresh(!refresh);
        console.log("All senetecnes in state pTags ", pTags);
      }

    })
  }


  const inputChangeHandler = (e: any) => {
    setUrl(e.target.value)
  }
  const inputChangeHandlerSingleScrap = (e: any) => {
    setUrlForSingleScrap(e.target.value)
  }
  const keyDownFullSiteScrap = async (e: any) => {
    if (e.key === 'Enter') {
      // const isValidUrl = await urlExist(enteredUrl)
      // if(!isValidUrl) {
      //   alert("Please type valid url")
      //   return;
      // }
      console.log("going to ... ", enteredUrl)
      socket.emit('full-site-scrap', enteredUrl)
    }
  }
  const keyDownSingleSiteScrap = async (e: any) => {
    if (e.key === 'Enter') {
      // const isValidUrl = await urlExist(enteredUrlForSingleScrap)
      // if(!isValidUrl) {
      //   alert("Please type valid url")
      //   return;
      // }
      console.log("going to ... ", enteredUrlForSingleScrap)
      socket.emit('single-site-scrap', enteredUrlForSingleScrap)
    }
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{`WebScrapping and GPT3`}</title>
        </Head>
        <Container>
          <motion.div
            className=""
            initial="hidden"
            whileInView="show"
            animate="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            <motion.div
              className="flex items-end mt-8 bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              <input type="text" onKeyDown={keyDownSingleSiteScrap} onChange={inputChangeHandlerSingleScrap} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue w-full p-2.5" placeholder="URL for single page scrapping..." />
              <input type="text" onKeyDown={keyDownFullSiteScrap} onChange={inputChangeHandler} className="ml-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5" placeholder="URL for full site scrapping..." />
              
            </motion.div>
          </motion.div>

          
          <motion.div
            className="flex items-end mt-8 bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            <MagnifyingGlass
              visible={scrapingStarted}
              height="80"
              width="80"
              ariaLabel="MagnifyingGlass-loading"
              wrapperStyle={{}}
              wrapperClass="MagnifyingGlass-wrapper"
              glassColor='#c0efff'
              color='#e15b64'
            />
          </motion.div>


          {/* For displaying scrapped url with modal support */}
          <div className="pl-8 my-10 w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
            {
              pTags.map(function (para: any) {
                const contents = { link: para.link, data: para.data };
                return (
                  <ScrappedSite contents={contents} key={contents.link} />
                )
              })
            }
          </div>

        </Container>
        <div style={{
                position: 'fixed',
                top: '92%',
                left: '1%', 
                width: '2em',
                height: '2.5em',
                zIndex: '50',
              }}>
                <Link href="/gpt3Model">
                  <div style={{
                    backgroundColor: '#3182ce',
                    color: '#fff',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '8rem',
                    minHeight: '2.5rem'
                  }}>
                    Test GPT3
                  </div>
                </Link>
              </div>
      </Layout>
    </>
  )
}
