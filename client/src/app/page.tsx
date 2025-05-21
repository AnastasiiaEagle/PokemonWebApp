'use client';

import PokeCard from "@/components/PokeCard/PokeCard";
import { useEffect, useState } from "react";

type Pokemon = {
  name: string;
  url: string;
};

export default function Home() {
  const [pok, setPok] = useState<{ name: string; url: string }[]>([])

  const pokemonApi = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon")
    const pokemon = await res.json()
    setPok(pokemon.results)
  }

  useEffect(()=>{
    pokemonApi()
  }, [])

  useEffect(()=>{
    console.log(pok)
  },[pok])

  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {
        Array.isArray(pok) ? pok.map((p: { name: string }, i)=> (
          <PokeCard key={p.name} pokeImg={'https://img.pokemondb.net/artwork/'+ p.name +'.jpg'} pokeName={p.name} />
        )): null
      }
    </div>
    </>
  );
}
