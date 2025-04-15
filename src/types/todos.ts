export interface TodoCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    updated_at: string;
  };
  onViewNote: (id: string) => void;
  onEditNote: (note: any) => void;
  onDeleteNote: (id: string) => void;
}