import React from 'react';
import Link from 'gatsby-link';

import Wrapper from './Wrapper';
import imgSrc from '../../main.png';

function HeaderImage() {
  return (
    
      <Link to="/">
        <img src={imgSrc} alt="" />
      </Link>
    
  );
}

export default HeaderImage;
