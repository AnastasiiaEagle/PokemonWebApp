'use client';

import PokeCard from "@/components/PokeCard/PokeCard";
import { off } from "process";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

type Pokemon = {
  name: string;
  url: string;
};

export default function Home() {
  const [pok, setPok] = useState<{ name: string; url: string }[]>([])
  const [offset, setOffset] = useState(0)
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
      console.log(pokemon)
    } catch (error) {
      console.error("Помилка завантаження:", error)
    } finally {
      isFetching.current = false
    }
  }

  useEffect(()=>{
    pokemonApi()
  }, [offset])

  useEffect(() => {
    if(inView && !isFetching.current && pok.length!==0){
      setOffset(offset => offset+20)
    }
  }, [inView]);

  useEffect(()=>{
  },[pok])

  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {
        Array.isArray(pok) ? pok.map((p: { name: string }, i)=> (
          <PokeCard key={i} pokeImg={'https://img.pokemondb.net/artwork/'+ p.name +'.jpg'} pokeName={p.name} />
        )): null
      }
    </div>
    <div ref={ref} style={{ height: "40px" }} />
    {!isFetching.current && <p className="text-center mt-4">Завантаження...</p>}
    </>
  );
}

// Здійснює декілька викликів при довгій загрузці
