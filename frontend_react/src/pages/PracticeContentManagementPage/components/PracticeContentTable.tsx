import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { PracticeContentMetadata } from "../types";

interface Props {
  contents: PracticeContentMetadata[];
  onEdit: (content: PracticeContentMetadata) => void;
  onDelete: (id: string) => void;
}

export function PracticeContentTable({
  contents,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white border rounded-[12px] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Skill</TableHead>
            <TableHead>Updated On</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Attempts</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {contents.map((content) => (
            <TableRow key={content.id}>
              <TableCell className="font-medium">
                {content.title}
              </TableCell>

              <TableCell>{content.skill}</TableCell>

              <TableCell>
                {content.updatedOn
                  ? new Date(content.updatedOn).toLocaleDateString()
                  : ""}
              </TableCell>

              <TableCell>{content.questions}</TableCell>

              <TableCell>{content.duration} min</TableCell>

              <TableCell>{content.attempts}</TableCell>

              <TableCell>
                <Badge
                  variant={
                    content.status === "Published"
                      ? "default"
                      : "outline"
                  }
                >
                  {content.status}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(content)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(content.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}