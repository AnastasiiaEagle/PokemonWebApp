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
}

export default function PokeCard({pokeImg, pokeName}: PokeCardProps) {
  const [like, setLike] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('liked')
      return saved === 'true'
    }
    return false
  })
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  })

  const saveLocal = () =>{
    const saved = localStorage.getItem('likedPokemons')
    let favorites: string[] = [];

    if(saved){
      try {
        const data = JSON.parse(saved)

        if (Array.isArray(data)) {

          const exists = data.includes(pokeName)

          if(exists){
            favorites = data.filter(name => name !== pokeName);
          }else{
            favorites = [...data, pokeName];
          }
        }
      } catch (error) {
        console.log(error)
      }      
    } else {
        favorites.push(pokeName);
    }

        localStorage.setItem('likedPokemons', JSON.stringify(favorites))
  }

  const handleLike = () => {
    setLike(like => !like)
  }

  useEffect(()=>{
    saveLocal()
  }, [like])

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
          onClick={handleLike}
        >
          <FavoriteIcon color={like ? 'error' : 'inherit'}/>
        </IconButton>
      </CardActions>
    </Card>
  );
}

//Зробити виведення на окремій сторінці улюблених покемонів