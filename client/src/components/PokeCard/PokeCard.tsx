'use client';

import { useEffect, useState } from "react"
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useInView } from "react-intersection-observer";


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

type PokeCardProps = {
    pokeImg: string,
    pokeName: string,
    onLikedPokemon: (like: boolean)=> void
}

export default function PokeCard({pokeImg, pokeName, onLikedPokemon}: PokeCardProps) {
  const showLikeLocal = () =>{
    const saved = localStorage.getItem('likedPokemons')
    if (saved) {
      try {
        const data = JSON.parse(saved);
        console.log(data)
        if (Array.isArray(data) && data.includes(pokeName)) {
          return true
        }
      } catch (error) {
        console.error('Error parsing likedPokemons from localStorage:', error)
      }
    }
    return false
  }
  
  const [like, setLike] = useState(() => showLikeLocal())
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true
  })

  const saveLocal = (like: boolean) => {
  const saved = localStorage.getItem('likedPokemons');
  let favorites: string[] = [];

  try {
    const data = saved ? JSON.parse(saved) : [];

    if (Array.isArray(data)) {
      if (like) {
        favorites = data.includes(pokeName) ? data : [...data, pokeName];
      } else {
        favorites = data.filter(name => name !== pokeName);
      }
    }
  } catch (error) {
    console.error('Error parsing likedPokemons from localStorage:', error);
  }

  localStorage.setItem('likedPokemons', JSON.stringify(favorites));
};


  useEffect(()=>{
    saveLocal(like)
    onLikedPokemon(like)
  },[like, pokeName])

  return (
    <Card sx={{ maxWidth: 345 }} ref={ref}>
      <CardMedia
        component="img"
        height="125"
        image={inView ? pokeImg : "images/kotik.jpg"}
        alt={pokeName}
        style={{ 
          objectFit: 'cover', 
          height: '250px',         
          }}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {pokeName}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites"
          onClick={() => setLike(prev => !prev)}
        >
          <FavoriteIcon color={like ? 'error' : 'inherit'}/>
        </IconButton>
      </CardActions>
    </Card>
  );
}