import React, { useRef, useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SearchIcon from '@mui/icons-material/Search';

import {NavBarButton} from './Button';
import {UploadButton} from './ButtonUpload';
import {SelectDataset} from './SelectDataset';
import {TextSearch} from './TextSearch';
import { useSelector } from 'react-redux';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

function NavBar() {

  const navbarRef = useRef(null);
  var playlistType = useSelector((state) => state.playlistType);
  const [playlistName, setPlaylistName] = useState('Stored Items');


  useEffect(() => {
    if (playlistType) {
      setPlaylistName('pinned soundscapes')
    }
    else {
      setPlaylistName('Search Results')
    }
  }, [playlistType])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar ref={navbarRef} position="static" sx={{ backgroundColor: 'rgb(100, 100, 100)', minHeight:'auto'}}>
        <Toolbar variant="dense">
          <Search sx={{ mr: 2, marginLeft: 'auto' }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <TextSearch/>
          </Search>
          <NavBarButton buttonText={'Filter by radar chart'} fontColor={'black'} backGroundColor={'rgb(34, 120, 207)'} borderColor={'rgb(34, 120, 207)'} func={"radarRequest"}/>
          <NavBarButton buttonText={'Filter by ISO slider'} fontColor={'black'} backGroundColor={'rgb(34, 120, 207)'} borderColor={'rgb(34, 120, 207)'} func={"isoRequest"}/>
          <NavBarButton buttonText={'Filter by single items'} fontColor={'black'} backGroundColor={'rgb(34, 120, 207)'} borderColor={'rgb(34, 120, 207)'} func={"sliderRequest"}/>
          <NavBarButton buttonText={'List ' + String(playlistName)} fontColor={'black'} backGroundColor={'rgb(129, 153, 129)'} borderColor={'rgb(129, 153, 129)'} func={"storedPlaylist"}/>
          <NavBarButton buttonText={'Download pinned soundscapes'} fontColor={'black'} backGroundColor={'rgb(253, 173, 80)'} borderColor={'rgb(253, 173, 80)'} func={"exportToFile"}/>
          <NavBarButton buttonText={'Save pinned soundscapes'} fontColor={'black'} backGroundColor={'rgb(253, 173, 80)'} borderColor={'rgb(253, 173, 80)'} func={"save"}/>
          <UploadButton buttonText={'Load pinned soundscapes'} fontColor={'black'} backGroundColor={'rgb(253, 173, 80)'} borderColor={'rgb(253, 173, 80)'}/>
          <SelectDataset/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;