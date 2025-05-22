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

export default function LikePokeCard({pokeImg, pokeName}: PokeCardProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true
  })

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
    </Card>
  );
}