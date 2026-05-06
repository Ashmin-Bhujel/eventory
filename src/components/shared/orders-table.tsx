import type { OrderResponse } from "#/lib/zod/order.schema";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";

type OrdersTableProps = {
  orders: OrderResponse[];
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  const totalAmount = orders.reduce((total, order) => total + order.totalAmount, 0);

  return (
    <Table>
      <TableCaption>A list of your recent orders.</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-25">SN</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order, idx) => (
          <TableRow key={order._id}>
            <TableCell className="font-medium">{idx + 1}</TableCell>
            <TableCell>{order.event.title}</TableCell>
            <TableCell>
              <Badge
                className={
                  order.status === "Completed"
                    ? "bg-green-300 text-green-800 dark:bg-green-800 dark:text-green-300"
                    : order.status === "Pending"
                      ? "bg-amber-300 text-amber-800 dark:bg-amber-800 dark:text-amber-300"
                      : "bg-red-300 text-red-800 dark:bg-red-800 dark:text-red-300"
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {order.totalAmount === 0 ? (
                <Badge className="bg-green-300 text-green-800 dark:bg-green-800 dark:text-green-300">
                  FREE
                </Badge>
              ) : (
                `NRs. ${order.totalAmount}`
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">NRs. {totalAmount}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
