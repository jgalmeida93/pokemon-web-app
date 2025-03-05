"use client";

import { useState } from "react";
import { Pokemon, PokemonFormData } from "@/types/pokemon";
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
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { pokemonApi } from "@/app/services/api";
import { usePokemon } from "@/context/PokemonContext";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    types: z.string().optional(),
    abilities: z.string().optional(),
    height: z
      .union([
        z.string().transform((val) => (val === "" ? undefined : Number(val))),
        z.number(),
      ])
      .optional()
      .nullable(),
    weight: z
      .union([
        z.string().transform((val) => (val === "" ? undefined : Number(val))),
        z.number(),
      ])
      .optional()
      .nullable(),
    imageUrl: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    usePokeApi: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.usePokeApi) {
        return true;
      }
      return !!data.types && !!data.abilities && !!data.height && !!data.weight;
    },
    {
      message: "All fields are required unless using PokeAPI",
      path: ["usePokeApi"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

interface AddPokemonModalProps {
  onPokemonAdded: (pokemon: Pokemon) => void;
}

export function AddPokemonModal({ onPokemonAdded }: AddPokemonModalProps) {
  const { fetchPokemons } = usePokemon();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      types: "",
      abilities: "",
      height: undefined,
      weight: undefined,
      imageUrl: "",
      usePokeApi: false,
    },
  });

  const watchUsePokeApi = form.watch("usePokeApi");

  const onSubmit = async (data: FormValues) => {
    try {
      let submitData;

      if (data.usePokeApi) {
        submitData = { name: data.name };
      } else {
        const typesArray = data.types
          ? data.types.split(",").map((type) => type.trim())
          : [];
        const abilitiesArray = data.abilities
          ? data.abilities.split(",").map((ability) => ability.trim())
          : [];
        submitData = {
          name: data.name,
          types: typesArray,
          abilities: abilitiesArray,
          height: data.height !== undefined ? data.height : null,
          weight: data.weight !== undefined ? data.weight : null,
          imageUrl: data.imageUrl || "",
        } as PokemonFormData;
      }

      const newPokemon = await pokemonApi.create(submitData);

      onPokemonAdded(newPokemon);
      await fetchPokemons();
      toast.success(`${data.name} added successfully!`);
      setIsDialogOpen(false);
      form.reset();
    } catch (error: unknown) {
      if (error instanceof Error && "status" in error) {
        const apiError = error as { status: number };
        if (apiError.status === 404) {
          toast.error(`${data.name} doesn't exist!`);
        } else if (apiError.status === 409 || apiError.status === 500) {
          toast.error("Failed to add Pokemon, Pokemon already exists!");
        } else {
          toast.error("Failed to add Pokemon");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Error adding Pokemon:", error);
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button data-testid="addpokemon">Add New Pokemon</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Pokemon</DialogTitle>
          <DialogDescription>
            Fill in the details of the new Pokemon you want to add to your
            collection.
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
            {" "}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Pikachu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usePokeApi"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I dont remember all the Pokemon information
                    </FormLabel>
                    <FormDescription>
                      Check this box if you want us to fetch the remaining
                      Pokemon details from PokeAPI. We just need the Pokemon
                      name.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {!watchUsePokeApi && (
              <>
                <FormField
                  control={form.control}
                  name="types"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Types</FormLabel>
                      <FormControl>
                        <Input placeholder="electric" {...field} />
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
                        <Input placeholder="static,lightning-rod" {...field} />
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
                            placeholder="4"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? undefined : Number(value)
                              );
                            }}
                            value={
                              field.value === undefined || field.value === null
                                ? ""
                                : field.value
                            }
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
                            placeholder="60"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? undefined : Number(value)
                              );
                            }}
                            value={
                              field.value === undefined || field.value === null
                                ? ""
                                : field.value
                            }
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
                        <Input
                          placeholder="https://example.com/pikachu.png"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter className="pt-4">
              <Button type="submit">Add Pokemon</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
