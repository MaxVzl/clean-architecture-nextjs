"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { UserDto } from "@/core/application/user/dtos/user.dto";
import { useCustomerSheet } from "@/hooks/use-customer-sheet";
import { apiClient } from "@/lib/api-client";

import { Button } from "./ui/button";

export const CustomerSheet = () => {
  const [customerId, setCustomerId] = useCustomerSheet();

  const { data, isLoading } = useQuery<UserDto>({
    queryKey: ["customer", customerId.customerId],
    queryFn: async () => {
      const res = await apiClient.api.users[":userId"].$get({
        param: { userId: customerId.customerId },
      });
      if (!res.ok) throw new Error("fetch failed");
      return await res.json();
    },
    enabled: customerId.customerId !== "",
  });

  return (
    <Drawer
      open={customerId.customerId !== ""}
      onOpenChange={(open) =>
        setCustomerId({ customerId: open ? customerId.customerId : "" })
      }
      direction="right"
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">{data?.name}</div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose
            asChild
            onClick={() => setCustomerId({ customerId: "" })}
          >
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
