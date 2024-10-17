import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue'
import DataTableDropdown from './DataTableDropdown.vue'

export const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: 'title',
    id: 'title', // Add an explicit id
    header: () => h('div', { class: 'text-left' }, 'Title'),
    cell: ({ row }) => {
      const title = row.getValue('title');
      return h('div', { class: 'text-left w-20' }, title);
    },
  },
  {
    accessorKey: 'status',
    id: 'status', // Add an explicit id
    header: () => h('div', { class: 'text-center' }, 'Status'),
    cell: ({ row }) => {
      const status = row.getValue('status');
      const statusText = status === 'completed' ? 'Completed' : 'Pending';
      return h(
        'div',
        { class: `text-center ${status === 'completed' ? 'text-green-500' : 'text-red-500'}` },
        statusText
      );
    },
  },
  {
    accessorKey: 'name',
    id: 'name', // Add an explicit id
    header: () => h('div', { class: 'text-left' }, 'Assigned To'),
    cell: ({ row }) => {
      const name = row.getValue('name');
      return h('div', { class: 'text-left' }, name);
    },
  },
  {
    accessorKey: 'updated_at',
    id: 'updated_at', // Add an explicit id
    header: () => h('div', { class: 'text-left' }, 'Last Updated'),
    cell: ({ row }) => {
      const updatedAt = new Date(row.getValue('updated_at')).toLocaleString();
      return h('div', { class: 'text-left' }, updatedAt);
    },
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Actions'),
    cell: ({ row }) => {
      const todo = row.original;
      return h(
        'div', 
        { class: 'flex justify-center' }, // Flexbox to center the content
        h(DataTableDropdown, { todo })
      );
    },
  }  
]
