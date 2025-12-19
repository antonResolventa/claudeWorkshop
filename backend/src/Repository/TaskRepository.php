<?php

namespace App\Repository;

use App\Entity\Task;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Task>
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    public function save(Task $task, bool $flush = false): void
    {
        $this->getEntityManager()->persist($task);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Task $task, bool $flush = false): void
    {
        $this->getEntityManager()->remove($task);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @return Task[]
     */
    public function findByAssignee(User $user): array
    {
        return $this->findBy(['assignee' => $user], ['createdAt' => 'DESC']);
    }

    /**
     * @return Task[]
     */
    public function findByStatus(string $status): array
    {
        return $this->findBy(['status' => $status], ['priority' => 'DESC', 'createdAt' => 'DESC']);
    }

    /**
     * @return Task[]
     */
    public function findOverdue(): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.dueDate < :now')
            ->andWhere('t.status != :completed')
            ->setParameter('now', new \DateTimeImmutable())
            ->setParameter('completed', Task::STATUS_COMPLETED)
            ->orderBy('t.dueDate', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Task[]
     */
    public function findHighPriorityPending(): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.priority = :priority')
            ->andWhere('t.status = :status')
            ->setParameter('priority', Task::PRIORITY_HIGH)
            ->setParameter('status', Task::STATUS_PENDING)
            ->orderBy('t.createdAt', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
