package com.example.todoapp.dto;

public class SubtaskResponse {
    private Long id;
    private String title;
    private boolean completed;

    public SubtaskResponse(Long id, String title, boolean completed) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public boolean isCompleted() { return completed; }
}