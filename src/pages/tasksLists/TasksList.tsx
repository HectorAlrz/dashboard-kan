import React from "react";
import KanbanCol from "@/tasks/kanban/KanbanCol";
import {
  KanbanBoardContainer,
  KanbanBoard,
} from "@/tasks/kanban/KanbanBoardContainer";

function List() {
  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard>
          <KanbanCol>
          </KanbanCol>
          <KanbanCol>
          </KanbanCol>
        </KanbanBoard>
      </KanbanBoardContainer>
    </>
  );
}

export default List;
