"use client";

import React from "react";
import { createCallable } from "react-call";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useIsMobile } from "@/hooks/use-mobile";

export type Address = {
  name: string;
  isFavorite?: boolean;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

interface Props {
  addresses: Address[];
}
type Response = Address | null;

export const AddressPicker = createCallable<Props, Response>(
  ({ call, addresses }) => {
    const [selectedAddress, setSelectedAddress] =
      React.useState<Address | null>(null);
    const isMobile = useIsMobile();

    function handleConfirm() {
      const selected = addresses.find(
        (address) => address.name === selectedAddress?.name,
      );
      if (!selected) {
        return;
      }
      call.end(selected);
    }

    return (
      <Drawer
        open={!call.ended}
        onOpenChange={(open) => call.end(open ? null : null)}
        direction={isMobile ? "bottom" : "right"}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Pick an address</DrawerTitle>
            <DrawerDescription>
              We&apos;ll prepare your order as soon as possible.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 scroll-fade overflow-y-auto p-4">
            <RadioGroup
              value={selectedAddress?.name}
              onValueChange={(value) =>
                setSelectedAddress(
                  addresses.find((address) => address.name === value) || null,
                )
              }
              className="gap-2"
            >
              {addresses.map((address) => (
                <FieldLabel key={address.name} htmlFor={address.name}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle className="flex items-center gap-2">
                        {address.name}
                        {address.isFavorite ? (
                          <Badge variant="secondary">Favorite</Badge>
                        ) : null}
                      </FieldTitle>
                      <FieldDescription className="flex flex-col">
                        <span>{address.street}</span>
                        <span>
                          {address.zip} {address.city} - {address.country}
                        </span>
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={address.name} id={address.name} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </div>
          <DrawerFooter>
            <Button
              onClick={handleConfirm}
              disabled={!selectedAddress}
              className="h-[34px]"
            >
              Confirm Address
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
  1000,
);

AddressPicker.displayName = "AddressPicker";
