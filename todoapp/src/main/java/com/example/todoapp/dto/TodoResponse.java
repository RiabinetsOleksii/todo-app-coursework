package com.example.todoapp.dto;

import java.time.LocalDate;
import java.util.List;

public class TodoResponse {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private boolean important;
    private LocalDate dueDate;
    private String category;
    private String type;

    private List<SubtaskResponse> subtasks; // НОВЕ ПОЛЕ

    // ОНОВЛЕНИЙ КОНСТРУКТОР
    public TodoResponse(Long id, String title, String description, boolean completed, boolean important, LocalDate dueDate, String category, String type, List<SubtaskResponse> subtasks) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.important = important;
        this.dueDate = dueDate;
        this.category = category;
        this.type = type;
        this.subtasks = subtasks;
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public boolean isCompleted() { return completed; }
    public boolean isImportant() { return important; }
    public LocalDate getDueDate() { return dueDate; }
    public String getCategory() { return category; }
    public String getType() { return type; }
    public List<SubtaskResponse> getSubtasks() { return subtasks; } // НОВИЙ GETTER
}