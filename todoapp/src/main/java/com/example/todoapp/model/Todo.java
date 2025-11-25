package com.example.todoapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private boolean important = false;
    private LocalDate dueDate;
    private String category;
    private String type = "task";

    // ЗВ'ЯЗОК: Список підзадач (CascadeType.ALL для видалення)
    @OneToMany(mappedBy = "todo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subtask> subtasks = new ArrayList<>();

    // --- Конструктори ---
    public Todo() {}

    // ОНОВЛЕНИЙ КОНСТРУКТОР
    public Todo(String title, String description, boolean completed, boolean important, LocalDate dueDate, String category, String type) {
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.important = important;
        this.dueDate = dueDate;
        this.category = category;
        this.type = type;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public boolean isImportant() { return important; }
    public void setImportant(boolean important) { this.important = important; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    // НОВІ GETTERS/SETTERS для Subtasks
    public List<Subtask> getSubtasks() { return subtasks; }
    public void setSubtasks(List<Subtask> subtasks) { this.subtasks = subtasks; }

    // Хелпер для додавання підзадачі
    public void addSubtask(Subtask subtask) {
        this.subtasks.add(subtask);
        subtask.setTodo(this);
    }
}