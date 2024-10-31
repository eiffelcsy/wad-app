import { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import DataTableDropdown from "./DataTableDropdown.vue";

export const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: "title",
    id: "title",
    header: () => h("div", { class: "text-left" }, "Title"),
    cell: ({ row }) => {
      const title = row.getValue("title");
      return h("div", { class: "text-left w-20" }, title);
    },
  },
  {
    accessorKey: "status",
    id: "status",
    header: () => h("div", { class: "text-center" }, "Status"),
    cell: ({ row }) => {
      const status = row.getValue("status");
      let statusText = "";
      let statusColor = "";
      switch (status) {
        case "completed":
          statusText = "Completed";
          statusColor = "text-green-500";
          break;
        case "in_progress":
          statusText = "In Progress";
          statusColor = "text-amber-500";
          break;
        case "pending":
          statusText = "Pending";
          statusColor = "text-red-500";
          break;
      }
      return h("div", { class: `text-center ${statusColor}` }, statusText);
    },
  },
  {
    accessorKey: "assignee_name",
    id: "assignee_name", 
    header: () => h("div", { class: "text-left" }, "Assigned To"),
    cell: ({ row }) => {
      const assigneeName = row.getValue("assignee_name");
      return h("div", { class: "text-left" }, assigneeName);
    },
  },
  {
    accessorKey: "updated_at",
    id: "updated_at", 
    header: () => h("div", { class: "text-left" }, "Last Updated"),
    cell: ({ row }) => {
      const updatedAt = new Date(row.getValue("updated_at")).toLocaleString(undefined, {
        month: "short",
        year: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      return h("div", { class: "text-left" }, updatedAt);
    },
  },
  {
    accessorKey: "start_date",
    id: "start_date", 
    header: () => h("div", { class: "text-left" }, "Start Date"),
    cell: ({ row }) => {
      const startDate = row.getValue("start_date")
        ? new Date(row.getValue("start_date")).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
            day: "numeric",
          })
        : "";
      return h("div", { class: "text-left" }, startDate);
    },
  },
  {
    accessorKey: "end_date",
    id: "end_date", 
    header: () => h("div", { class: "text-left" }, "End Date"),
    cell: ({ row }) => {
      const endDate = row.getValue("end_date")
        ? new Date(row.getValue("end_date")).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
            day: "numeric",
          })
        : "";
      return h("div", { class: "text-left" }, endDate);
    },
  },
  {
    accessorKey: "is_milestone",
    id: "is_milestone", 
    header: () => h("div", { class: "text-center" }, "Milestones"),
    cell: ({ row }) => {
      const isMilestone = row.getValue("is_milestone")
        ? h("div", {class: "mx-auto size-2 bg-amber-300 transform rotate-45"}, "")
        : "";
      return h("div", { class: "text-center" }, isMilestone);
    },
  },
  {
    id: "actions",
    header: () => h("div", { class: "text-center" }, "Actions"),
    cell: ({ row }) => {
      const todo = row.original;
      return h(
        "div",
        { class: "flex justify-center" }, // Flexbox to center the content
        h(DataTableDropdown, { todo })
      );
    },
  },
];
