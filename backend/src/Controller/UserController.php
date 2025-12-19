<?php

namespace App\Controller;

use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/users')]
class UserController extends AbstractController
{
    public function __construct(
        private readonly UserService $userService,
        private readonly SerializerInterface $serializer
    ) {}

    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $users = $this->userService->getAllUsers();

        return $this->json([
            'data' => $users,
            'count' => count($users)
        ], context: ['groups' => ['user:read']]);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['data' => $user], context: ['groups' => ['user:read', 'user:details']]);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || !isset($data['email'])) {
            return $this->json(
                ['error' => 'Name and email are required'],
                Response::HTTP_BAD_REQUEST
            );
        }

        try {
            $user = $this->userService->createUser($data['name'], $data['email']);

            return $this->json(
                ['data' => $user, 'message' => 'User created successfully'],
                Response::HTTP_CREATED,
                context: ['groups' => ['user:read']]
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
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        try {
            $updatedUser = $this->userService->updateUser($user, $data);

            return $this->json(
                ['data' => $updatedUser, 'message' => 'User updated successfully'],
                context: ['groups' => ['user:read']]
            );
        } catch (\Exception $e) {
            return $this->json(
                ['error' => $e->getMessage()],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $this->userService->deleteUser($user);

        return $this->json(['message' => 'User deleted successfully']);
    }
}
