"use client";

import { useState, useEffect } from "react";
import { Pokemon } from "@/types/pokemon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { pokemonApi } from "@/app/services/api";
import { usePokemon } from "@/context/PokemonContext";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  types: z.string().min(1, "Types are required"),
  abilities: z.string().min(1, "Abilities are required"),
  height: z.number().min(1, "Height is required"),
  weight: z.number().min(1, "Weight is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface EditPokemonModalProps {
  pokemon: Pokemon;
  onPokemonUpdated: (updatedPokemon: Pokemon) => void;
  trigger: React.ReactNode;
}

export function EditPokemonModal({
  pokemon,
  onPokemonUpdated,
  trigger,
}: EditPokemonModalProps) {
  const { fetchPokemons } = usePokemon();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: pokemon.name,
      types: Array.isArray(pokemon.types)
        ? pokemon.types.join(",")
        : String(pokemon.types || ""),
      abilities: Array.isArray(pokemon.abilities)
        ? pokemon.abilities.join(",")
        : String(pokemon.abilities || ""),
      height: pokemon.height,
      weight: pokemon.weight,
      imageUrl: pokemon.imageUrl || "",
    },
  });

  useEffect(() => {
    if (isDialogOpen) {
      form.reset({
        name: pokemon.name,
        types: Array.isArray(pokemon.types)
          ? pokemon.types.join(",")
          : String(pokemon.types),
        abilities: Array.isArray(pokemon.abilities)
          ? pokemon.abilities.join(",")
          : String(pokemon.abilities),
        height: pokemon.height,
        weight: pokemon.weight,
        imageUrl: pokemon.imageUrl || "",
      });
    }
  }, [isDialogOpen, form, pokemon]);

  const onSubmit = async (data: FormValues) => {
    try {
      const updatedPokemon = await pokemonApi.update(pokemon.id, data);
      await fetchPokemons();
      onPokemonUpdated(updatedPokemon);
      toast.success(`${data.name} updated successfully!`);
      setIsDialogOpen(false);
    } catch (error: unknown) {
      console.error("Error updating Pokemon:", error);
      toast.error("Failed to update Pokemon");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pokemon</DialogTitle>
          <DialogDescription>
            Update the details of {pokemon.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.error("Form validation errors:", errors);
              const errorMessages = Object.entries(errors).map(
                ([field, error]) => `${field}: ${error?.message || "Invalid"}`
              );
              if (errorMessages.length > 0) {
                toast.error(errorMessages[0]);
              } else {
                toast.error("Please check the form for errors");
              }
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="types"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Types</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="abilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abilities</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (dm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (hg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit">Update Pokemon</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
