<?php

namespace App\Service;

use App\Entity\Task;
use App\Entity\User;
use App\Repository\TaskRepository;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Exception\ValidationFailedException;

class TaskService
{
    public function __construct(
        private readonly TaskRepository $taskRepository,
        private readonly ValidatorInterface $validator
    ) {}

    /**
     * @return Task[]
     */
    public function getAllTasks(): array
    {
        return $this->taskRepository->findBy([], ['createdAt' => 'DESC']);
    }

    public function getTaskById(int $id): ?Task
    {
        return $this->taskRepository->find($id);
    }

    /**
     * @return Task[]
     */
    public function getTasksByUser(User $user): array
    {
        return $this->taskRepository->findByAssignee($user);
    }

    /**
     * @return Task[]
     */
    public function getTasksByStatus(string $status): array
    {
        return $this->taskRepository->findByStatus($status);
    }

    /**
     * @return Task[]
     */
    public function getOverdueTasks(): array
    {
        return $this->taskRepository->findOverdue();
    }

    public function createTask(
        string $title,
        User $assignee,
        ?string $description = null,
        string $priority = Task::PRIORITY_MEDIUM,
        ?\DateTimeImmutable $dueDate = null
    ): Task {
        $task = new Task();
        $task->setTitle($title);
        $task->setAssignee($assignee);
        $task->setDescription($description);
        $task->setPriority($priority);
        $task->setDueDate($dueDate);

        $this->validateTask($task);
        $this->taskRepository->save($task, true);

        return $task;
    }

    public function updateTask(Task $task, array $data): Task
    {
        if (isset($data['title'])) {
            $task->setTitle($data['title']);
        }

        if (isset($data['description'])) {
            $task->setDescription($data['description']);
        }

        if (isset($data['status'])) {
            $task->setStatus($data['status']);
        }

        if (isset($data['priority'])) {
            $task->setPriority($data['priority']);
        }

        if (isset($data['dueDate'])) {
            $task->setDueDate(new \DateTimeImmutable($data['dueDate']));
        }

        $this->validateTask($task);
        $this->taskRepository->save($task, true);

        return $task;
    }

    public function completeTask(Task $task): Task
    {
        $task->setStatus(Task::STATUS_COMPLETED);
        $this->taskRepository->save($task, true);

        return $task;
    }

    public function deleteTask(Task $task): void
    {
        $this->taskRepository->remove($task, true);
    }

    private function validateTask(Task $task): void
    {
        $violations = $this->validator->validate($task);

        if (count($violations) > 0) {
            throw new ValidationFailedException($task, $violations);
        }
    }
}
