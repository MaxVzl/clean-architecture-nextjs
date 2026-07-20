"use client";

import { useState } from "react";

import { Address, AddressPicker } from "@/components/address-picker";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const [address, setAddress] = useState<Address | null>(null);

  return (
    <div>
      <h1>Test</h1>
      <Button
        onClick={async () => {
          const address = await AddressPicker.call({
            addresses: [
              {
                name: "John Doe",
                street: "123 Main St",
                city: "Anytown",
                state: "CA",
                zip: "12345",
                country: "USA",
                isFavorite: true,
              },
              {
                name: "Jane Doe",
                street: "456 Main St",
                city: "Anytown",
                state: "CA",
                zip: "12345",
                country: "USA",
              },
              {
                name: "Jim Doe",
                street: "789 Main St",
                city: "Anytown",
                state: "CA",
                zip: "12345",
                country: "USA",
              },
            ],
          });
          if (address) {
            setAddress(address);
          }
        }}
      >
        Open
      </Button>
      {address && <div>{address.name}</div>}
    </div>
  );
}
