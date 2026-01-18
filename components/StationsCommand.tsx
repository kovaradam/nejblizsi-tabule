"use client";
import { Station } from "@/data/getData";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

export function StationsCommand(props: { stations: Station[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>open</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTrigger></DialogTrigger>
        <CommandInput placeholder="Vyhledat stanici..." />
        <CommandList>
          <CommandEmpty>Stanice nenalezena</CommandEmpty>
          <CommandGroup heading="">
            {props.stations.map((station) => {
              const href = `/?id=${station.id}`;
              return (
                <CommandItem
                  key={station.id}
                  value={station.name}
                  asChild
                  className="cursor-pointer"
                  onSelect={() => {
                    setOpen(false);
                    router.push(href);
                  }}
                >
                  <Link href={href}>{station.name}</Link>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
