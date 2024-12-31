import React, { useMemo } from "react";
import { useList, useUpdate } from "@refinedev/core";
import KanbanCol from "@/tasks/kanban/KanbanCol";
import {
  KanbanBoardContainer,
  KanbanBoard,
} from "@/tasks/kanban/KanbanBoardContainer";
import KanbanItem from "@/tasks/kanban/KanbanItem";
import { TASK_STAGES_QUERY, TASKS_QUERY } from "@/graphql/queries";
import { Task, TaskStage } from "@/graphql/schema.types";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { TasksQuery } from "@/graphql/types";
import { ProjectCard, ProjectCardMemo } from "@/tasks/kanban/ProjectCard";
import { KanbanAddCardButton } from "@/tasks/kanban/KanbanAddCardButton";
import { KanbanColumnSkeleton, ProjectCardSkeleton } from "@/components";
import { DragEndEvent } from "@dnd-kit/core";
import { UPDATE_TASK_STAGE_MUTATION } from "@/graphql/mutations";

function List({ children }: React.PropsWithChildren) {
  const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
    resource: "taskStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
      },
    ],
    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
  });

  const { data: tasks, isLoading: isloadingTasks } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: "tasks",
    sorters: [
      {
        field: "dueDate",
        order: "asc",
      },
    ],
    pagination: {
      mode: "off",
    },
    queryOptions: {
      enabled: !!stages,
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
  });

  const { mutate: updateTask } = useUpdate();

  const taskStages = useMemo(() => {
    if (!tasks?.data || !stages?.data) {
      return {
        unnasignedStage: [],
        stages: [],
      };
    }

    const unassignedStage = tasks.data.filter((task) => task.stageId === null);
    const grouped: TaskStage[] = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
    }));

    return {
      unassignedStage,
      columns: grouped,
    };
  }, [tasks, stages]);

  const isLoading = isloadingTasks || isLoadingStages;
  const handleAddCard = (args: { stageId: string }) => {};

  const handleOnDragEnd = (event: DragEndEvent) => {
    let stageId = event.over?.id as undefined | string | null;
    const taskId = event.active.id as string;
    const taskStageId = event.activatorEvent.data?.current?.stageId;
    if (taskStageId === stageId) return;
    if (stageId === "unassigned") {
      stageId = null;
    }

    updateTask({
      resource: "tasks",
      id: taskId,
      values: {
        stageId: stageId,
      },
      successNotification: false,
      mutationMode: "optimistic",
      meta: {
        gqlMutation: UPDATE_TASK_STAGE_MUTATION,
      },
    });
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          <KanbanCol
            id={"unassigned"}
            title={"unassigned"}
            count={taskStages?.unassignedStage?.length || 0}
            onAddClick={() => handleAddCard({ stageId: "unnasigned" })}
          >
            {taskStages.unassignedStage?.map((task) => {
              return (
                <KanbanItem
                  key={task.id}
                  id={task.id}
                  data={{ ...task, stageId: "unassigned" }}
                >
                  <ProjectCardMemo
                    {...task}
                    dueDate={task.dueDate || undefined}
                  />
                </KanbanItem>
              );
            })}
            {!taskStages.unassignedStage?.length && (
              <KanbanAddCardButton
                onClick={() => handleAddCard({ stageId: "unnasigned" })}
              />
            )}
          </KanbanCol>
          {taskStages.columns?.map((column) => (
            <KanbanCol
              key={column.id}
              id={column.id}
              title={column.title}
              count={column.tasks.length}
              onAddClick={() => handleAddCard({ stageId: column.id })}
            >
              {!isLoading &&
                column.tasks.map((task) => (
                  <KanbanItem key={task.id} id={task.id} data={task}>
                    <ProjectCardMemo
                      {...task}
                      dueDate={task.dueDate || undefined}
                    />
                  </KanbanItem>
                ))}
              {!column.tasks.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: column.id })}
                />
              )}
            </KanbanCol>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>
      {children}
    </>
  );
}

export default List;

const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, index) => {
        return (
          <KanbanColumnSkeleton key={index}>
            {Array.from({ length: itemCount }).map((_, index) => {
              return <ProjectCardSkeleton key={index} />;
            })}
          </KanbanColumnSkeleton>
        );
      })}
    </KanbanBoardContainer>
  );
};
