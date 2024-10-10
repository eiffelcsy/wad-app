import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue'

export const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: 'id',
    id: 'id', // Add an explicit id
    header: () => h('div', { class: 'text-left' }, 'ID'),
    cell: ({ row }) => {
      const id = row.getValue('id');
      return h('div', { class: 'text-left' }, id);
    },
  },
  {
    accessorKey: 'project_id',
    id: 'project_id', // Add an explicit id
    header: () => h('div', { class: 'text-left' }, 'Project ID'),
    cell: ({ row }) => {
      const projectId = row.getValue('project_id');
      return h('div', { class: 'text-left' }, projectId);
    },
  },
  {
    accessorKey: 'title',
    id: 'title', // Add an explicit id
    header: () => h('div', { class: 'text-left' }, 'Title'),
    cell: ({ row }) => {
      const title = row.getValue('title');
      return h('div', { class: 'text-left' }, title);
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
    accessorKey: 'assigned_to',
    id: 'assigned_to', // Add an explicit id
    header: () => h('div', { class: 'text-left' }, 'Assigned To'),
    cell: ({ row }) => {
      const assignedTo = row.getValue('assigned_to');
      return h('div', { class: 'text-left' }, assignedTo);
    },
  },
  {
    accessorKey: 'created_at',
    id: 'created_at', // Add an explicit id
    header: () => h('div', { class: 'text-left' }, 'Created At'),
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue('created_at')).toLocaleString();
      return h('div', { class: 'text-left' }, createdAt);
    },
  },
  {
    accessorKey: 'updated_at',
    id: 'updated_at', // Add an explicit id
    header: () => h('div', { class: 'text-left' }, 'Updated At'),
    cell: ({ row }) => {
      const updatedAt = new Date(row.getValue('updated_at')).toLocaleString();
      return h('div', { class: 'text-left' }, updatedAt);
    },
  },
  {
    id: 'actions', // Add an explicit id
    header: () => h('div', { class: 'text-center' }, 'Actions'),
    cell: ({ row }) => {
      const todoId = row.getValue('id');
      return h('div', { class: 'flex justify-center space-x-2' }, [
        h('button', {
          class: 'text-blue-500 hover:underline',
          onClick: () => markCompleted(todoId),
        }, 'Complete'),
        h('button', {
          class: 'text-red-500 hover:underline',
          onClick: () => deleteTask(todoId),
        }, 'Delete'),
        h('button', {
          class: 'text-yellow-500 hover:underline',
          onClick: () => updateTask(todoId),
        }, 'Edit'),
      ]);
    },
  },
]
