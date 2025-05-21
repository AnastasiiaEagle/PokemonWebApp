'use client';

import PokeCard from "@/components/PokeCard/PokeCard";
import { useEffect, useRef, useState } from "react";

type Pokemon = {
  name: string;
  url: string;
};

export default function Home() {
  const [pok, setPok] = useState<{ name: string; url: string }[]>([])
  const [offset, setOffset] = useState(0)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const pokemonApi = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}")
    const pokemon = await res.json()
    setPok(prev => [...prev, ...pokemon.results])
  }

  useEffect(()=>{
    pokemonApi()
  }, [offset])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setOffset(prev => prev + 20);
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

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
    <div ref={loaderRef} style={{ height: "40px" }} />
    </>
  );
}
