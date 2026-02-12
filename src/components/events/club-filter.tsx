import React from "react";
import { clubs } from "@/data/clubs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClubFilterProps {
  selectedClubs: string[];
  onToggleClub: (clubId: string) => void;
  onReset: () => void;
}

export function ClubFilter({
  selectedClubs,
  onToggleClub,
  onReset,
}: ClubFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-full border-border">
          <Filter className="w-4 h-4" />
          Filter by Club
          {selectedClubs.length > 0 && (
            <span className="flex items-center justify-center bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full ml-1">
              {selectedClubs.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Select Clubs</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          <DropdownMenuItem onClick={onReset} className="cursor-pointer">
            <div
              className={cn(
                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                selectedClubs.length === 0
                  ? "bg-primary text-primary-foreground"
                  : "opacity-50 [&_svg]:invisible",
              )}
            >
              <Check className={cn("h-4 w-4")} />
            </div>
            <span>All Events</span>
          </DropdownMenuItem>
          {clubs.map((club) => {
            const isSelected = selectedClubs.includes(club.id);
            return (
              <DropdownMenuItem
                key={club.id}
                onClick={(e) => {
                  e.preventDefault();
                  onToggleClub(club.id);
                }}
                className="cursor-pointer"
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible",
                  )}
                >
                  <Check className={cn("h-4 w-4")} />
                </div>
                <span>{club.name}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        {selectedClubs.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onReset}
              className="justify-center text-center text-destructive focus:text-destructive cursor-pointer"
            >
              Clear Filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
