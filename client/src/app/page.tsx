'use client';

import LikePokeCard from "@/components/LikePokeCard/LikePokeCard";
import PokeCard from "@/components/PokeCard/PokeCard";
import { off } from "process";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [pok, setPok] = useState<{ name: string; url: string }[]>([])
  const [likePok, setLikePok] = useState<{ name: string; url: string }[]>([])
  const [offset, setOffset] = useState(0)
  const [onLikedPokemon, setOnLikedPokemon] = useState(true)
  const isFetching = useRef(false);
  const { ref, inView } = useInView({
    threshold: 1,
  })

  const pokemonApi = async () => {
    if(isFetching.current) return
    isFetching.current = true
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset='+offset)
      const pokemon = await res.json()
      setPok(prev => [...prev, ...pokemon.results])
    } catch (error) {
      console.error("Помилка завантаження:", error)
    } finally {
      isFetching.current = false
    }
  }

  const showLike = (like: boolean) => {
    setOnLikedPokemon(like)
    const saveLike = localStorage.getItem('likedPokemons')
    if(saveLike){
      const data = JSON.parse(saveLike)
      setLikePok(data)
    }
  }

  useEffect(()=>{
    pokemonApi()
  }, [offset])

  useEffect(() => {
    if(inView && !isFetching.current && pok.length!== 0){
      setOffset(offset => offset+20)
    }
  }, [inView]);

  useEffect(()=>{
  },[pok])

  useEffect(()=>{
    showLike
  },[onLikedPokemon])

  // useEffect(()=>{
  // }, [likePok])

  return (
    <>
    {Array.isArray(likePok) && likePok.length!=0 ? <h1>Улюблені покемони</h1> : ""}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-5">
        {
        
        Array.isArray(likePok) ? likePok.map((p, i)=> (
          <LikePokeCard key={i} pokeImg={'https://img.pokemondb.net/artwork/'+ p +'.jpg'} pokeName={p}/>
        )): "Поки тут порожньо"
      }
    </div>
    <h1>Усі покемони</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {
        Array.isArray(pok) ? pok.map((p: { name: string }, i)=> (
          <PokeCard key={i} pokeImg={'https://img.pokemondb.net/artwork/'+ p.name +'.jpg'} pokeName={p.name} onLikedPokemon={showLike} />
        )): null
      }
    </div>

    <div ref={ref} style={{ height: "40px" }} />
    {!isFetching.current && <p className="text-center mt-4">Завантаження...</p>}
    </>
  );
}
