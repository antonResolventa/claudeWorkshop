<?php

namespace App\Controller;

use App\Entity\Task;
use App\Service\TaskService;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/tasks')]
class TaskController extends AbstractController
{
    public function __construct(
        private readonly TaskService $taskService,
        private readonly UserService $userService
    ) {}

    #[Route('', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $status = $request->query->get('status');

        if ($status) {
            $tasks = $this->taskService->getTasksByStatus($status);
        } else {
            $tasks = $this->taskService->getAllTasks();
        }

        return $this->json([
            'data' => $tasks,
            'count' => count($tasks)
        ], context: ['groups' => ['task:read']]);
    }

    #[Route('/overdue', methods: ['GET'])]
    public function overdue(): JsonResponse
    {
        $tasks = $this->taskService->getOverdueTasks();

        return $this->json([
            'data' => $tasks,
            'count' => count($tasks)
        ], context: ['groups' => ['task:read']]);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $task = $this->taskService->getTaskById($id);

        if (!$task) {
            return $this->json(['error' => 'Task not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['data' => $task], context: ['groups' => ['task:read', 'task:details']]);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['title']) || !isset($data['assignee_id'])) {
            return $this->json(
                ['error' => 'Title and assignee_id are required'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $assignee = $this->userService->getUserById($data['assignee_id']);

        if (!$assignee) {
            return $this->json(
                ['error' => 'Assignee not found'],
                Response::HTTP_BAD_REQUEST
            );
        }

        try {
            $dueDate = isset($data['due_date'])
                ? new \DateTimeImmutable($data['due_date'])
                : null;

            $task = $this->taskService->createTask(
                title: $data['title'],
                assignee: $assignee,
                description: $data['description'] ?? null,
                priority: $data['priority'] ?? Task::PRIORITY_MEDIUM,
                dueDate: $dueDate
            );

            return $this->json(
                ['data' => $task, 'message' => 'Task created successfully'],
                Response::HTTP_CREATED,
                context: ['groups' => ['task:read']]
            );
        } catch (\Exception $e) {
            return $this->json(
                ['error' => $e->getMessage()],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $task = $this->taskService->getTaskById($id);

        if (!$task) {
            return $this->json(['error' => 'Task not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        try {
            $updatedTask = $this->taskService->updateTask($task, $data);

            return $this->json(
                ['data' => $updatedTask, 'message' => 'Task updated successfully'],
                context: ['groups' => ['task:read']]
            );
        } catch (\Exception $e) {
            return $this->json(
                ['error' => $e->getMessage()],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    #[Route('/{id}/complete', methods: ['POST'])]
    public function complete(int $id): JsonResponse
    {
        $task = $this->taskService->getTaskById($id);

        if (!$task) {
            return $this->json(['error' => 'Task not found'], Response::HTTP_NOT_FOUND);
        }

        $completedTask = $this->taskService->completeTask($task);

        return $this->json([
            'data' => $completedTask,
            'message' => 'Task completed successfully'
        ], context: ['groups' => ['task:read']]);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $task = $this->taskService->getTaskById($id);

        if (!$task) {
            return $this->json(['error' => 'Task not found'], Response::HTTP_NOT_FOUND);
        }

        $this->taskService->deleteTask($task);

        return $this->json(['message' => 'Task deleted successfully']);
    }
}
