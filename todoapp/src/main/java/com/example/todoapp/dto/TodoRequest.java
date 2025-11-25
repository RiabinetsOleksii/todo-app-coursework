package com.example.todoapp.dto;

import java.time.LocalDate;
import java.util.List;

public class TodoRequest {
    private String title;
    private String description;
    private boolean completed;
    private boolean important;
    private LocalDate dueDate;
    private String category;
    private String type;

    private List<SubtaskRequest> subtasks; // НОВЕ ПОЛЕ

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

    public List<SubtaskRequest> getSubtasks() { return subtasks; }
    public void setSubtasks(List<SubtaskRequest> subtasks) { this.subtasks = subtasks; }
}