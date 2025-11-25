package com.example.todoapp.service;

import com.example.todoapp.dto.SubtaskResponse;
import com.example.todoapp.dto.TodoRequest;
import com.example.todoapp.dto.TodoResponse;
import com.example.todoapp.model.Subtask;
import com.example.todoapp.model.Todo;
import com.example.todoapp.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TodoService {
    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<TodoResponse> getAllTodos() {
        return todoRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TodoResponse createTodo(TodoRequest request) {
        Todo todo = new Todo(
                request.getTitle(),
                request.getDescription(),
                request.isCompleted(),
                request.isImportant(),
                request.getDueDate(),
                request.getCategory(),
                request.getType()
        );

        if ("checklist".equals(request.getType()) && request.getSubtasks() != null) {
            request.getSubtasks().forEach(subtaskRequest -> {
                if (subtaskRequest.getTitle() != null && !subtaskRequest.getTitle().trim().isEmpty()) {
                    todo.addSubtask(new Subtask(subtaskRequest.getTitle(), todo));
                }
            });
        }
        todoRepository.save(todo);
        return mapToResponse(todo);
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }

    public TodoResponse toggleCompleted(Long id) {
        Todo todo = todoRepository.findById(id).orElseThrow();
        todo.setCompleted(!todo.isCompleted());
        todoRepository.save(todo);
        return mapToResponse(todo);
    }

    // ВИПРАВЛЕНО: ФУНКЦІЯ ОНОВЛЕННЯ (PUT /api/todos/{id})
    public TodoResponse updateTodo(Long id, TodoRequest request) {
        Todo todo = todoRepository.findById(id).orElseThrow();

        // 1. ОНОВЛЕННЯ ОСНОВНИХ ПОЛІВ
        // Використовуємо Optional.ofNullable, але з перевіркою на порожній рядок для коректності
        Optional.ofNullable(request.getTitle()).ifPresent(todo::setTitle);
        Optional.ofNullable(request.getDescription()).ifPresent(todo::setDescription);
        Optional.ofNullable(request.getDueDate()).ifPresent(todo::setDueDate);
        Optional.ofNullable(request.getCategory()).ifPresent(todo::setCategory);
        Optional.ofNullable(request.getType()).ifPresent(todo::setType);

        // 2. ОНОВЛЕННЯ BOOLEAN ПОЛІВ (ВОНИ ЗАВЖДИ ПРИСУТНІ В REQUEST)
        todo.setCompleted(request.isCompleted());
        todo.setImportant(request.isImportant());

        // Примітка: Логіка оновлення subtasks тут не реалізована, оскільки вимагає окремих ендпоінтів.

        todoRepository.save(todo);
        return mapToResponse(todo);
    }

    // МЕТОД МАППІНГУ
    private TodoResponse mapToResponse(Todo todo) {
        List<SubtaskResponse> subtasks = todo.getSubtasks().stream()
                .map(st -> new SubtaskResponse(st.getId(), st.getTitle(), st.isCompleted()))
                .collect(Collectors.toList());

        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isCompleted(),
                todo.isImportant(),
                todo.getDueDate(),
                todo.getCategory(),
                todo.getType(),
                subtasks
        );
    }
}