"use client";

import { useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { pokemonApi } from "@/app/services/api";

interface DeleteConfirmationModalProps {
  pokemon: Pokemon;
  onPokemonDeleted: () => void;
  trigger?: React.ReactNode;
}

export function DeleteConfirmationModal({
  pokemon,
  onPokemonDeleted,
  trigger,
}: DeleteConfirmationModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await pokemonApi.delete(pokemon.id);
      toast.success(
        `${pokemon.name} was successfully removed from your collection`
      );
      onPokemonDeleted();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error deleting Pokemon:", error);
      toast.error(`Failed to delete ${pokemon.name}. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="destructive">Delete Pokemon</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {pokemon.name} from your collection?
            <span className="ml-2 text-destructive">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Pokemon"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
