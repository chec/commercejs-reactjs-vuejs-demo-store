import React from 'react';
import { Link } from "react-router-dom";
import {ReactComponent as LettersHeroBg } from '../assets/letters-hero-big.svg'
import shoesHero from '../assets/shoes-hero.png';

function LandingPage(props) {
  return (
    <div className="flex flex-grow-1 items-center bg-black pv5 pv4-m pv3-l">
      <div className="relative w-100 mw9 center ph2">
        <div className="w-90 o-40 center pv2">
          <LettersHeroBg />
        </div>
        <div className="absolute absolute--fill flex flex-column items-center w-90 center mt5">
          <img src={shoesHero} alt="Pair of Shoes" width="100%" height="auto" />
        </div>
        <div className="absolute absolute--fill flex flex-column justify-center items-center nb7 ph3">
          <p className="flex flex-shrink-1 flex-column hero-text f3 f2-m f1-l white tc pb5 lh-title">
            LOREM IPSUM LOREM IPSUM
            <Link to="/white-shoe" className="medium-text f7 cherry bg-blossom ttu pv3 ph3 bg-white outline-0 dim pointer self-center mr3 no-underline">
              shop products
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage;
