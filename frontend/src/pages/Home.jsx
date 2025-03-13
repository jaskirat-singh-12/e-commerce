import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
// import NewsletterBox from '../components/NewsletterBox'
import Banner from '../components/Banner'
import Chatbox from '../components/Chatbox'

const Home = () => {
  return (
    <div>
      <Hero />
      <Banner/>
      <LatestCollection/>
      <BestSeller/>
      <Chatbox/>
      <OurPolicy/>
    </div>
  )
}

export default Home
