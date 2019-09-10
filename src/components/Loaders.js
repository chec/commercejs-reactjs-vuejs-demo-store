import React from 'react';
import { ReactComponent as FootPrintSvg } from '../assets/footprint.svg';

export function FootPrintsLoading(props) {
  return (
    <div className="FootPrintsLoader fixed absolute-fill w-100 h-100 bg-black-90 flex flex-column items-center justify-center z-max">
      <div className="FootPrintsLoader__prints-container">
        {
         Array.from({length: '8'}).map((item, id) => (
           <div className="FootPrintsLoader__print footPrintContainer fill-cherry" key={id}>
             <FootPrintSvg />
           </div>
         ))
        }
      </div>
      <p className="absolute medium-text white f6 ttu">
        { props.children || 'loading...'}
      </p>
    </div>
  )
}
