package com.example.todoapp.service;

import com.example.todoapp.model.Todo;
import com.example.todoapp.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public Todo updateTodo(Long id, Todo newTodo) {
        return todoRepository.findById(id).map(todo -> {
            todo.setTitle(newTodo.getTitle());
            todo.setDescription(newTodo.getDescription());
            todo.setCompleted(newTodo.isCompleted());
            return todoRepository.save(todo);
        }).orElse(null);
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}
