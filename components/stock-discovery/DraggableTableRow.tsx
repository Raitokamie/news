'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DraggableTableRowProps {
  id: string;
  children: ReactNode;
  onClick?: () => void;
  isDragDisabled?: boolean;
}

export function DraggableTableRow({ id, children, onClick, isDragDisabled = false }: DraggableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: isDragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={cn(
        'border-b border-[#222F44] hover:bg-white/5 transition-colors cursor-pointer group',
        isDragging && 'opacity-50 z-50',
        isDragDisabled && 'cursor-default'
      )}
    >
      {!isDragDisabled && (
        <td className="px-2 py-3 w-8">
          <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            <GripVertical size={16} />
          </div>
        </td>
      )}
      {children}
    </tr>
  );
}
