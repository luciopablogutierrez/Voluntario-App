"use client";
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { UserPlus } from 'lucide-react';
import type { Volunteer } from '@/app/actions';

interface VolunteerInputProps {
  allVolunteers: Volunteer[];
  onAddVolunteer: (name: string) => void;
}

export function VolunteerInput({ allVolunteers, onAddVolunteer }: VolunteerInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddVolunteer(inputValue.trim());
      setInputValue('');
      setOpen(false);
    }
  };
  
  const handleSelect = (name: string) => {
    onAddVolunteer(name);
    setInputValue('');
    setOpen(false);
  }

  React.useEffect(() => {
    if (inputValue.trim().length > 0) {
        setOpen(true);
    } else {
        setOpen(false);
    }
  }, [inputValue]);
  
  const filteredVolunteers = allVolunteers.filter(v => v.name.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
       <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="w-full">
            <Input
              type="text"
              placeholder="Nombre del voluntario"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-background"
              aria-label="Nombre del voluntario"
              autoComplete="off"
            />
          </div>
        </PopoverAnchor>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandList>
              <CommandGroup>
                {filteredVolunteers.map(v => (
                  <CommandItem key={v.id} onSelect={() => handleSelect(v.name)}>
                    {v.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              {filteredVolunteers.length === 0 && inputValue.trim().length > 0 && (
                <CommandEmpty>
                  <div className="p-2 text-sm">
                    <span>No se encontró. Crear nuevo:</span>
                    <Button variant="link" className="p-1 h-auto" onClick={() => handleSelect(inputValue)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      {inputValue}
                    </Button>
                  </div>
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90 shrink-0 text-accent-foreground" aria-label="Agregar voluntario">
        <UserPlus className="h-5 w-5" />
      </Button>
    </form>
  )
}
