<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Exception\ValidationFailedException;

class UserService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly ValidatorInterface $validator
    ) {}

    /**
     * @return User[]
     */
    public function getAllUsers(): array
    {
        return $this->userRepository->findAllWithTasks();
    }

    public function getUserById(int $id): ?User
    {
        return $this->userRepository->find($id);
    }

    public function getUserByEmail(string $email): ?User
    {
        return $this->userRepository->findByEmail($email);
    }

    public function createUser(string $name, string $email): User
    {
        $user = new User();
        $user->setName($name);
        $user->setEmail($email);

        $this->validateUser($user);
        $this->userRepository->save($user, true);

        return $user;
    }

    public function updateUser(User $user, array $data): User
    {
        if (isset($data['name'])) {
            $user->setName($data['name']);
        }

        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }

        $user->setUpdatedAt(new \DateTimeImmutable());

        $this->validateUser($user);
        $this->userRepository->save($user, true);

        return $user;
    }

    public function deleteUser(User $user): void
    {
        $this->userRepository->remove($user, true);
    }

    private function validateUser(User $user): void
    {
        $violations = $this->validator->validate($user);

        if (count($violations) > 0) {
            throw new ValidationFailedException($user, $violations);
        }
    }
}
